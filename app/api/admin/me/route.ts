import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/adminSession";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  return NextResponse.json({ authenticated: isAuthenticated(req) });
}
