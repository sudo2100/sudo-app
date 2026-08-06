import { NextResponse } from "next/server";
import { listSchedules } from "@/lib/db";

export const runtime = "nodejs";

// 대표강사 일정 조회 — 홈 진입 팝업에서 사용, 인증 불필요
export async function GET() {
  try {
    const schedules = await listSchedules();
    return NextResponse.json({ schedules });
  } catch (dbError) {
    const err = dbError as Error;
    return NextResponse.json({ error: "일정 조회 오류", details: err.message }, { status: 500 });
  }
}
