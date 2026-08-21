import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/adminSession";
import { updateSchedule, deleteSchedule } from "@/lib/db";
import { revalidateSchedulePages } from "@/lib/revalidate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// 대표강사 일정 수정 — 관리자 전용
export async function PUT(req: NextRequest, { params }: RouteContext) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;
  const { dateLabel, description } = await req.json().catch(() => ({}));
  if (typeof dateLabel !== "string" || !dateLabel.trim() || typeof description !== "string" || !description.trim()) {
    return NextResponse.json({ error: "일정 날짜와 내용을 입력해주세요." }, { status: 400 });
  }

  try {
    const schedule = await updateSchedule(id, dateLabel.trim(), description.trim());
    if (!schedule) {
      return NextResponse.json({ error: "해당 일정을 찾을 수 없습니다." }, { status: 404 });
    }
    revalidateSchedulePages();
    return NextResponse.json({ success: true, schedule });
  } catch (dbError) {
    const err = dbError as Error;
    return NextResponse.json({ error: "일정 수정 오류", details: err.message }, { status: 500 });
  }
}

// 대표강사 일정 삭제 — 관리자 전용
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;

  try {
    const deleted = await deleteSchedule(id);
    if (!deleted) {
      return NextResponse.json({ error: "해당 일정을 찾을 수 없습니다." }, { status: 404 });
    }
    revalidateSchedulePages();
    return NextResponse.json({ success: true });
  } catch (dbError) {
    const err = dbError as Error;
    return NextResponse.json({ error: "일정 삭제 오류", details: err.message }, { status: 500 });
  }
}
