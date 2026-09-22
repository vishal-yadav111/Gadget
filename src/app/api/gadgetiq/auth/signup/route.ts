import { NextRequest, NextResponse } from "next/server";
import http from "node:http";
import https from "node:https";

const BRAHMA_BACKEND_URL = (
  process.env.BRAHMA_BACKEND_URL ||
  process.env.NEXT_PUBLIC_BRAHMA_API_URL ||
  process.env.QC_PORTAL_URL ||
  process.env.USER_ONBOARD_API_URL ||
  "http://localhost:5009"
).replace(/\/+$/, "");

function getCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-user-id, x-username",
  };
}

function executeUpstreamRequest(
  url: string,
  method: string,
  headers: Record<string, string>,
  bodyBuffer?: Buffer | string,
  timeoutMs: number = 15000
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
      reject(new Error(`Upstream request to ${url} timed out after ${timeoutMs}ms`));
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

export async function POST(req: NextRequest) {
  try {
    let payload: any = {};
    try {
      payload = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          code: 400,
          message: "Invalid JSON request body",
        },
        { status: 400, headers: getCorsHeaders() }
      );
    }

    // Validate required fields (gst is optional)
    const requiredFields = [
      "company",
      "address",
      "name",
      "email",
      "phone",
      "username",
      "password",
    ];
    for (const field of requiredFields) {
      if (!payload[field] || String(payload[field]).trim() === "") {
        return NextResponse.json(
          {
            success: false,
            code: 400,
            message: `Field '${field}' is required`,
          },
          { status: 400, headers: getCorsHeaders() }
        );
      }
    }

    const bodyJsonString = JSON.stringify({
      company: String(payload.company || "").trim(),
      address: String(payload.address || "").trim(),
      name: String(payload.name || "").trim(),
      email: String(payload.email || "").trim(),
      phone: String(payload.phone || "").trim(),
      gst: String(payload.gst || "").trim(),
      username: String(payload.username || "").trim(),
      password: String(payload.password || ""),
      confirmPassword: String(payload.confirmPassword || payload.password || ""),
    });

    const bodyBuffer = Buffer.from(bodyJsonString, "utf-8");

    const upstreamHeaders: Record<string, string> = {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Length": bodyBuffer.length.toString(),
      Accept: "application/json, text/plain, */*",
      "User-Agent": "GadgetIQ-Signup-API/1.0",
    };

    const targetUrl = `${BRAHMA_BACKEND_URL}/api/v1/user-onboard/signup`;

    try {
      const upstreamRes = await executeUpstreamRequest(
        targetUrl,
        "POST",
        upstreamHeaders,
        bodyBuffer,
        10000
      );

      let parsedData: any;
      try {
        parsedData = JSON.parse(upstreamRes.data);
      } catch {
        parsedData = {
          success: upstreamRes.statusCode >= 200 && upstreamRes.statusCode < 300,
          code: upstreamRes.statusCode,
          message: upstreamRes.data || "Backend response received",
        };
      }

      return NextResponse.json(parsedData, {
        status: upstreamRes.statusCode || 200,
        headers: getCorsHeaders(),
      });
    } catch (upstreamErr: any) {
      console.error("Upstream signup error:", upstreamErr);
      return NextResponse.json(
        {
          success: false,
          code: 502,
          message:
            upstreamErr?.message ||
            "Unable to connect to registration backend server at port 5009.",
        },
        { status: 502, headers: getCorsHeaders() }
      );
    }
  } catch (err: any) {
    console.error("Signup handler error:", err);
    return NextResponse.json(
      {
        success: false,
        code: 500,
        message: err?.message || "Internal server error during registration",
      },
      { status: 500, headers: getCorsHeaders() }
    );
  }
}
