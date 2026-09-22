import { NextRequest, NextResponse } from "next/server";
import http from "node:http";
import https from "node:https";

const BRAHMA_BACKEND_URL = (
  process.env.BRAHMA_BACKEND_URL ||
  process.env.NEXT_PUBLIC_BRAHMA_API_URL ||
  process.env.BACKEND_API_URL ||
  "http://localhost:5009"
).replace(/\/+$/, "");

const QC_PORTAL_BASE_URL = (
  process.env.QC_PORTAL_URL ||
  "https://qc.xtracover.com"
).replace(/\/+$/, "");

const STORETEMP_API_BASE_URL = (
  process.env.STORETEMP_API_URL ||
  process.env.STORE_API_URL ||
  "https://storetemp.xtracover.com/api/StoreApi"
).replace(/\/+$/, "");

function getCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-user-id, x-username, x-user-uid, x-upstream-host",
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

function extractUserFromRequest(req: NextRequest, bodyOrQueryUid?: string | number): string {
  const headerUserId =
    req.headers.get("x-user-id") ||
    req.headers.get("x-username") ||
    req.headers.get("x-user-uid");
  if (headerUserId && headerUserId.trim()) {
    return headerUserId.trim();
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const payloadBase64 = token.split(".")[1];
      if (payloadBase64) {
        const decodedJson = Buffer.from(payloadBase64, "base64").toString("utf-8");
        const parsedToken = JSON.parse(decodedJson);
        const userIdentifier =
          parsedToken.username ||
          parsedToken.uid ||
          parsedToken.id ||
          parsedToken.userId ||
          parsedToken.sub ||
          parsedToken.name ||
          parsedToken.unique_name;
        if (userIdentifier) {
          return String(userIdentifier);
        }
      }
    } catch {}
  }

  if (bodyOrQueryUid !== undefined && bodyOrQueryUid !== null && String(bodyOrQueryUid).trim() !== "") {
    return String(bodyOrQueryUid).trim();
  }

  return "0";
}

function normalizeDesktopReportPayload(raw: any, req: NextRequest) {
  const draw = Number(raw?.draw ?? 1);

  let length = 10;
  if (raw?.length !== undefined && raw?.length !== null) {
    length = Number(raw.length);
  } else if (raw?.pageSize !== undefined && raw?.pageSize !== null) {
    length = Number(raw.pageSize);
  } else if (raw?.limit !== undefined && raw?.limit !== null) {
    length = Number(raw.limit);
  }

  if (length === -1 || String(raw?.length).toLowerCase() === "all") {
    length = 5000;
  }

  let start = 0;
  if (raw?.start !== undefined && raw?.start !== null) {
    start = Math.max(0, Number(raw.start));
  } else if (raw?.page !== undefined && raw?.page !== null) {
    const page = Math.max(1, Number(raw.page));
    start = (page - 1) * length;
  }

  let searchValue = "";
  if (typeof raw?.search === "object" && raw?.search !== null) {
    searchValue = raw.search.value || "";
  } else if (typeof raw?.search === "string") {
    searchValue = raw.search;
  } else if (typeof raw?.Search === "string") {
    searchValue = raw.Search;
  }

  const fromDate = raw?.FromDate || raw?.fromDate || raw?.sfromdate || "2024-01-01";
  const toDate = raw?.ToDate || raw?.toDate || raw?.stodate || "2026-12-31";

  const rawUid = raw?.uid ?? raw?.userId ?? raw?.username ?? raw?.MstRWid;
  const uid = extractUserFromRequest(req, rawUid);

  const status = raw?.status || raw?.QCResult || "ALL";

  return {
    draw,
    start,
    length,
    search: {
      value: searchValue,
    },
    FromDate: fromDate,
    ToDate: toDate,
    uid,
    status,
    sfromdate: fromDate,
    stodate: toDate,
    MstRWid: uid,
  };
}

async function handleDesktopReports(req: NextRequest) {
  try {
    let payload: any = {};

    if (req.method === "POST") {
      try {
        payload = await req.json();
      } catch {
        payload = {};
      }
    } else if (req.method === "GET") {
      const url = new URL(req.url);
      payload = {
        draw: url.searchParams.get("draw") || 1,
        start: url.searchParams.get("start") !== null ? url.searchParams.get("start") : undefined,
        length: url.searchParams.get("length") !== null ? url.searchParams.get("length") : undefined,
        page: url.searchParams.get("page") !== null ? url.searchParams.get("page") : undefined,
        pageSize: url.searchParams.get("pageSize") !== null ? url.searchParams.get("pageSize") : undefined,
        search: { value: url.searchParams.get("search") || url.searchParams.get("search[value]") || "" },
        FromDate: url.searchParams.get("FromDate") || url.searchParams.get("fromDate"),
        ToDate: url.searchParams.get("ToDate") || url.searchParams.get("toDate"),
        uid: url.searchParams.get("uid") || url.searchParams.get("userId") || url.searchParams.get("username"),
        status: url.searchParams.get("status") || "ALL",
      };
    }

    const normalizedBody = normalizeDesktopReportPayload(payload, req);
    const bodyJsonString = JSON.stringify(normalizedBody);
    const bodyBuffer = Buffer.from(bodyJsonString, "utf-8");

    const upstreamHeaders: Record<string, string> = {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Length": bodyBuffer.length.toString(),
      Accept: "application/json, text/plain, */*",
      "User-Agent": "GadgetIQ-Evaluate-API/1.0",
      "x-user-id": normalizedBody.uid,
    };

    const authHeader = req.headers.get("authorization");
    if (authHeader) {
      upstreamHeaders["Authorization"] = authHeader;
    }

    // Dedicated Brahma Backend Endpoint (Port 5009)
    // Only hit NEXT_PUBLIC_BRAHMA_API_URL because backend API is built there
    const upstreamCandidates = [
      `${BRAHMA_BACKEND_URL}/Report/Get_AddOnViewQcResultdt`,
    ];

    let lastError: any = null;
    let successfulResponse: { statusCode: number; data: string } | null = null;

    for (const upstreamUrl of upstreamCandidates) {
      try {
        const res = await executeUpstreamRequest(
          upstreamUrl,
          "POST",
          upstreamHeaders,
          bodyBuffer,
          6000
        );

        if (res.statusCode >= 200 && res.statusCode < 400) {
          try {
            const parsed = JSON.parse(res.data);
            if (parsed && (parsed.data || parsed.DATA || Array.isArray(parsed))) {
              successfulResponse = res;
              break;
            }
          } catch {}
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    if (successfulResponse) {
      try {
        const rawData = JSON.parse(successfulResponse.data);

        let finalData: any[] = [];
        let recordsTotal = 0;
        let recordsFiltered = 0;
        const draw = String(normalizedBody.draw || 1);

        if (Array.isArray(rawData?.data)) {
          finalData = rawData.data;
          recordsTotal = Number(rawData.recordsTotal ?? finalData.length);
          recordsFiltered = Number(rawData.recordsFiltered ?? finalData.length);
        } else if (Array.isArray(rawData?.DATA)) {
          finalData = rawData.DATA;
          recordsTotal = Number(rawData.recordsTotal ?? finalData.length);
          recordsFiltered = Number(rawData.recordsFiltered ?? finalData.length);
        } else if (Array.isArray(rawData)) {
          finalData = rawData;
          recordsTotal = finalData.length;
          recordsFiltered = finalData.length;
        }

        const pageSize = normalizedBody.length;
        const page = Math.floor(normalizedBody.start / (pageSize || 1)) + 1;
        const totalPages = Math.ceil(recordsFiltered / (pageSize || 1)) || 1;

        return NextResponse.json(
          {
            draw,
            recordsTotal,
            recordsFiltered,
            page,
            pageSize,
            totalPages,
            uid: normalizedBody.uid,
            data: finalData,
          },
          {
            status: 200,
            headers: {
              ...getCorsHeaders(),
              "Cache-Control": "no-store, max-age=0",
            },
          }
        );
      } catch {
        return new NextResponse(successfulResponse.data, {
          status: successfulResponse.statusCode,
          headers: {
            ...getCorsHeaders(),
            "Content-Type": "application/json",
            "Cache-Control": "no-store, max-age=0",
          },
        });
      }
    }

    return NextResponse.json(
      {
        draw: String(normalizedBody.draw || 1),
        recordsTotal: 0,
        recordsFiltered: 0,
        page: 1,
        pageSize: normalizedBody.length,
        totalPages: 0,
        uid: normalizedBody.uid,
        data: [],
        message: "Upstream Desktop report service currently unreachable or returned no records.",
        error: lastError?.message || null,
      },
      {
        status: 200,
        headers: getCorsHeaders(),
      }
    );
  } catch (err: any) {
    console.error("Desktop QC Reports API error:", err);
    return NextResponse.json(
      {
        draw: "1",
        recordsTotal: 0,
        recordsFiltered: 0,
        page: 1,
        pageSize: 50,
        totalPages: 0,
        data: [],
        error: "Internal Server Error",
        message: err?.message || "Failed to process Desktop reports request",
      },
      {
        status: 500,
        headers: getCorsHeaders(),
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(),
  });
}

export async function GET(req: NextRequest) {
  return handleDesktopReports(req);
}

export async function POST(req: NextRequest) {
  return handleDesktopReports(req);
}
