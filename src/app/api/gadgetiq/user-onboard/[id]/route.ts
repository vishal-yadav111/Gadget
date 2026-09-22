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
    "Access-Control-Allow-Methods": "GET, OPTIONS",
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

/**
 * GET /api/gadgetiq/user-onboard/:id
 * Proxy for GET /api/v1/user-onboard/:id
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authHeader = req.headers.get("authorization") || "";

  let lastError: any = null;

  for (const baseUrl of BACKEND_URLS) {
    const cleanBase = baseUrl.replace(/\/+$/, "");
    const targetUrl = `${cleanBase}/api/v1/user-onboard/${encodeURIComponent(id)}`;

    try {
      const upstreamRes = await executeUpstreamRequest(
        targetUrl,
        "GET",
        {
          Accept: "application/json",
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        undefined,
        5000
      );

      if (upstreamRes.statusCode === 200 || upstreamRes.statusCode === 400 || upstreamRes.statusCode === 404) {
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
      message: lastError?.message || `Failed to fetch onboarding user details for ID ${id}`,
    },
    { status: 502, headers: getCorsHeaders() }
  );
}
