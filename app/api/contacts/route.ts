import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/adminSession";
import { listContacts } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const contacts = await listContacts();
    return NextResponse.json({ contacts });
  } catch (dbError) {
    const err = dbError as Error;
    return NextResponse.json({ error: "DB 조회 오류", details: err.message }, { status: 500 });
  }
}
