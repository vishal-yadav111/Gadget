import { NextRequest, NextResponse } from "next/server";
import { fetchQCCertificate } from "@/lib/qc-api/service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const serviceKey =
    searchParams.get("servicekey") ||
    searchParams.get("serviceKey") ||
    searchParams.get("imei") ||
    searchParams.get("serial");
  const deviceType = (searchParams.get("type") || "laptop").toLowerCase() as "laptop" | "mobile";

  if (!serviceKey || !serviceKey.trim()) {
    return NextResponse.json(
      { success: false, error: "Missing required parameter: servicekey or imei" },
      { status: 400 }
    );
  }

  try {
    const data = await fetchQCCertificate(serviceKey.trim(), deviceType === "mobile" ? "mobile" : "laptop");
    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: `No QC diagnostic record found for ${deviceType === "mobile" ? "IMEI" : "Service Key"}: "${serviceKey}". Please verify the identifier and try again.`,
        },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to retrieve certificate" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const serviceKey = body.servicekey || body.serviceKey || body.imei || body.serial;
    const deviceType = (body.type || "laptop").toLowerCase() as "laptop" | "mobile";

    if (!serviceKey || !serviceKey.trim()) {
      return NextResponse.json(
        { success: false, error: "Missing required field: servicekey or imei" },
        { status: 400 }
      );
    }

    const data = await fetchQCCertificate(serviceKey.trim(), deviceType === "mobile" ? "mobile" : "laptop");
    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: `No QC diagnostic record found for ${deviceType === "mobile" ? "IMEI" : "Service Key"}: "${serviceKey}". Please verify the identifier and try again.`,
        },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to process certificate request" },
      { status: 500 }
    );
  }
}
