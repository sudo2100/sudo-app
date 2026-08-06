import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/adminSession";
import { createSchedule } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 대표강사 일정 추가 — 관리자 전용
export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { dateLabel, description } = await req.json().catch(() => ({}));
  if (typeof dateLabel !== "string" || !dateLabel.trim() || typeof description !== "string" || !description.trim()) {
    return NextResponse.json({ error: "일정 날짜와 내용을 입력해주세요." }, { status: 400 });
  }

  try {
    const schedule = await createSchedule(dateLabel.trim(), description.trim());
    return NextResponse.json({ success: true, schedule }, { status: 201 });
  } catch (dbError) {
    const err = dbError as Error;
    return NextResponse.json({ error: "일정 저장 오류", details: err.message }, { status: 500 });
  }
}
