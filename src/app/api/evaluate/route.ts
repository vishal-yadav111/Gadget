import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "online", service: "Gadget Evaluate StoreApi Proxy", timestamp: new Date().toISOString() });
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
