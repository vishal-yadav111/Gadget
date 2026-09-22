import { NextRequest, NextResponse } from "next/server";
import https from "node:https";
import http from "node:http";

const STORETEMP_API_BASE_URL = (
  process.env.STORETEMP_API_URL ||
  process.env.STORE_API_URL ||
  "https://storetemp.xtracover.com/api/StoreApi"
).replace(/\/+$/, "");

const STORE_API_BASE_URL = (
  process.env.STORE_API_URL ||
  "https://store.xtracover.com/api/StoreApi"
).replace(/\/+$/, "");

const QC_PORTAL_BASE_URL = (
  process.env.QC_PORTAL_URL ||
  process.env.BRAHMA_BACKEND_URL ||
  process.env.NEXT_PUBLIC_BRAHMA_API_URL ||
  "http://localhost:5009"
).replace(/\/+$/, "");

// Deterministic O(1) direct routing table
const STORE_API_ENDPOINTS = new Set([
  "GetQCCertificatedt",
  "GetUserList",
]);

const QC_PORTAL_ENDPOINTS = new Set([
  "Get_AddOnViewQcResultlp",
  "Get_AddOnViewQcResultlpfk",
  "Get_AddOnViewQcResultmb",
  "Get_AddOnViewQcResultmh",
  "Get_AddOnViewQcResultdt",
  "Get_AddOnViewQcResultdtmb",
  "Get_AddOnViewQcResultmbdt",
  "Get_AddOnViewQcResult",
  "Get_ViewQcResult",
  "Get_ViewQcDResult",
  "Get_Licence_Listlp",
  "Get_Licence_List",
  "QTCertificate1",
  "Get_BatteryReportResult",
  "Get_BatteryReportResultnew",
]);

function getCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-upstream-host",
  };
}

// Low-level HTTP/HTTPS request executor to bypass Undici chunked-encoding and framing issues with IIS / ASP.NET 4.x
function executeUpstreamRequest(
  url: string,
  method: string,
  headers: Record<string, string>,
  bodyBuffer?: Buffer | string
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
      timeout: 15000,
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
      reject(new Error(`Upstream request to ${url} timed out after 15000ms`));
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

async function handleProxy(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const resolvedParams = await params;
    const path = (resolvedParams.path || []).join("/");
    const search = req.nextUrl.search;
    const firstSegment = (resolvedParams.path || [])[0] || "";

    // 1. Determine exact target host & target URL deterministically (0ms lookup)
    const customHostHeader = req.headers.get("x-upstream-host")?.toLowerCase();
    let primaryUrl = "";
    let fallbackUrl = "";

    if (customHostHeader === "qc" || firstSegment === "Report" || path.startsWith("Report/")) {
      primaryUrl = `${QC_PORTAL_BASE_URL}/${path}${search}`;
      fallbackUrl = ""; // Strictly no fallback to live API for QC Portal endpoints
    } else if (QC_PORTAL_ENDPOINTS.has(firstSegment)) {
      primaryUrl = `${QC_PORTAL_BASE_URL}/Report/${path}${search}`;
      fallbackUrl = ""; // Strictly no fallback to live API for QC Portal endpoints
    } else if (customHostHeader === "store" || STORE_API_ENDPOINTS.has(firstSegment)) {
      primaryUrl = `${STORE_API_BASE_URL}/${path}${search}`;
      fallbackUrl = `${STORETEMP_API_BASE_URL}/${path}${search}`;
    } else {
      primaryUrl = `${STORETEMP_API_BASE_URL}/${path}${search}`;
      fallbackUrl = `${STORE_API_BASE_URL}/${path}${search}`;
    }

    const upstreamHeaders: Record<string, string> = {
      Accept: "application/json, text/plain, */*",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 GadgetIQ/1.0",
    };

    // Forward Basic auth or custom tokens if provided, but strip browser Bearer tokens to prevent IIS OWIN crashes
    const authHeader = req.headers.get("authorization");
    if (authHeader && !authHeader.toLowerCase().startsWith("bearer ")) {
      upstreamHeaders["Authorization"] = authHeader;
    }

    const contentType = req.headers.get("content-type");
    let bodyBuffer: Buffer | undefined = undefined;

    if (req.method !== "GET" && req.method !== "HEAD") {
      if (contentType?.includes("multipart/form-data")) {
        const arrayBuf = await req.arrayBuffer();
        bodyBuffer = Buffer.from(arrayBuf);
        if (contentType) upstreamHeaders["Content-Type"] = contentType;
      } else {
        const textBody = await req.text();
        bodyBuffer = Buffer.from(textBody, "utf-8");
        upstreamHeaders["Content-Type"] = contentType || "application/json; charset=utf-8";
      }

      if (bodyBuffer) {
        upstreamHeaders["Content-Length"] = bodyBuffer.length.toString();
      }
    }

    let upstreamRes: { statusCode: number; headers: http.IncomingHttpHeaders; data: string } | null = null;
    let isSuccess = false;

    // Single direct request to determined primary target
    try {
      upstreamRes = await executeUpstreamRequest(primaryUrl, req.method, upstreamHeaders, bodyBuffer);
      if (upstreamRes.statusCode >= 200 && upstreamRes.statusCode < 400) {
        isSuccess = true;
      } else {
        console.warn(`Primary upstream ${primaryUrl} returned HTTP ${upstreamRes.statusCode}:`, upstreamRes.data.substring(0, 200));
      }
    } catch (err: any) {
      console.warn(`Direct request to ${primaryUrl} encountered network error:`, err?.message || err);
    }

    // Failover safety: If primary returned error and fallback is different, attempt fallback
    if (!isSuccess && fallbackUrl && fallbackUrl !== primaryUrl) {
      try {
        const fallbackRes = await executeUpstreamRequest(fallbackUrl, req.method, upstreamHeaders, bodyBuffer);
        if (fallbackRes.statusCode >= 200 && fallbackRes.statusCode < 400) {
          upstreamRes = fallbackRes;
          isSuccess = true;
        } else if (!upstreamRes) {
          upstreamRes = fallbackRes;
        }
      } catch (fallbackErr: any) {
        console.warn(`Fallback request to ${fallbackUrl} failed:`, fallbackErr?.message || fallbackErr);
      }
    }

    if (!upstreamRes) {
      return NextResponse.json(
        {
          RespCode: 502,
          RespMsg: "Upstream servers unreachable",
          DATA: null,
        },
        { status: 502, headers: getCorsHeaders() }
      );
    }

    const resContentType = (upstreamRes.headers["content-type"] as string) || "application/json";
    const resText = upstreamRes.data;

    try {
      const data = JSON.parse(resText);
      return NextResponse.json(data, {
        status: upstreamRes.statusCode,
        headers: {
          ...getCorsHeaders(),
          "Cache-Control": "no-store, max-age=0",
        },
      });
    } catch {
      return new NextResponse(resText, {
        status: upstreamRes.statusCode,
        headers: {
          ...getCorsHeaders(),
          "Content-Type": resContentType,
          "Cache-Control": "no-store, max-age=0",
        },
      });
    }
  } catch (err: any) {
    console.error("Evaluate StoreApi proxy error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Proxy request failed",
        message: err.message || "Failed to contact StoreApi backend",
      },
      { status: 502, headers: getCorsHeaders() }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(),
  });
}

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, context);
}

export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, context);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, context);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, context);
}
