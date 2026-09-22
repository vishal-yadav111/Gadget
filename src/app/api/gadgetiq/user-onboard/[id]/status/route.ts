import { NextRequest, NextResponse } from "next/server";
import http from "node:http";
import https from "node:https";

const BACKEND_URLS = [
  process.env.BRAHMA_BACKEND_URL,
  process.env.NEXT_PUBLIC_BRAHMA_API_URL,
  process.env.USER_ONBOARD_API_URL,
  process.env.QC_PORTAL_URL,
  "http://localhost:5000",
  "http://localhost:5009",
].filter(Boolean) as string[];

function getCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-user-id, x-username",
  };
}

function executeUpstreamRequest(
  url: string,
  method: string,
  headers: Record<string, string>,
  bodyBuffer?: Buffer | string,
  timeoutMs: number = 10000
): Promise<{ statusCode: number; headers: http.IncomingHttpHeaders; data: string }> {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const isHttps = parsedUrl.protocol === "https:";
    const transport = isHttps ? https : http;

    const requestOptions: https.RequestOptions = {
      protocol: parsedUrl.protocol,
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (isHttps ? 443 : 80),
      path: `${parsedUrl.pathname}${parsedUrl.search}`,
      method: method.toUpperCase(),
      headers: {
        ...headers,
        Host: parsedUrl.hostname,
      },
      timeout: timeoutMs,
    };

    const req = transport.request(requestOptions, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () => {
        const fullBody = Buffer.concat(chunks).toString("utf-8");
        resolve({
          statusCode: res.statusCode || 500,
          headers: res.headers,
          data: fullBody,
        });
      });
    });

    req.on("timeout", () => {
      req.destroy();
      reject(new Error(`Upstream request to ${url} timed out`));
    });

    req.on("error", (err) => {
      reject(err);
    });

    if (bodyBuffer) {
      req.write(bodyBuffer);
    }
    req.end();
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(),
  });
}

async function handleStatusUpdate(
  req: NextRequest,
  id: string,
  method: "PATCH" | "PUT"
) {
  const authHeader = req.headers.get("authorization") || "";

  let payload: any = {};
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      {
        statusCode: 400,
        success: false,
        message: "Invalid JSON body provided.",
      },
      { status: 400, headers: getCorsHeaders() }
    );
  }

  const bodyJsonString = JSON.stringify(payload);
  const bodyBuffer = Buffer.from(bodyJsonString, "utf-8");

  let lastError: any = null;

  for (const baseUrl of BACKEND_URLS) {
    const cleanBase = baseUrl.replace(/\/+$/, "");
    const targetUrl = `${cleanBase}/api/v1/user-onboard/${encodeURIComponent(id)}/status`;

    try {
      const upstreamRes = await executeUpstreamRequest(
        targetUrl,
        method,
        {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Length": bodyBuffer.length.toString(),
          Accept: "application/json",
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        bodyBuffer,
        5000
      );

      if (
        upstreamRes.statusCode === 200 ||
        upstreamRes.statusCode === 201 ||
        upstreamRes.statusCode === 400 ||
        upstreamRes.statusCode === 401 ||
        upstreamRes.statusCode === 403 ||
        upstreamRes.statusCode === 404
      ) {
        let parsed: any;
        try {
          parsed = JSON.parse(upstreamRes.data);
        } catch {
          parsed = { data: upstreamRes.data };
        }
        return NextResponse.json(parsed, {
          status: upstreamRes.statusCode,
          headers: getCorsHeaders(),
        });
      }
    } catch (err: any) {
      lastError = err;
    }
  }

  return NextResponse.json(
    {
      statusCode: 502,
      success: false,
      message: lastError?.message || `Failed to update user status for ID ${id}`,
    },
    { status: 502, headers: getCorsHeaders() }
  );
}

/**
 * PATCH /api/gadgetiq/user-onboard/:id/status
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return handleStatusUpdate(req, id, "PATCH");
}

/**
 * PUT /api/gadgetiq/user-onboard/:id/status
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return handleStatusUpdate(req, id, "PUT");
}
