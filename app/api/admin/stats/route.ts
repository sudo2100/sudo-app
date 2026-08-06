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
    const rows = contacts.map((c) => ({ course: c.course, day: c.createdAt.slice(0, 10) }));

    const kstNow = new Date(Date.now() + 9 * 60 * 60 * 1000);
    const todayStr = kstNow.toISOString().slice(0, 10);
    const weekAgoStr = new Date(kstNow.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const byCourseMap = new Map<string, number>();
    let today = 0;
    let last7Days = 0;

    for (const row of rows) {
      byCourseMap.set(row.course, (byCourseMap.get(row.course) ?? 0) + 1);
      if (row.day === todayStr) today += 1;
      if (row.day >= weekAgoStr) last7Days += 1;
    }

    const byCourse = [...byCourseMap.entries()]
      .map(([course, count]) => ({ course, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({ total: rows.length, today, last7Days, byCourse });
  } catch (dbError) {
    const err = dbError as Error;
    return NextResponse.json({ error: "통계 조회 오류", details: err.message }, { status: 500 });
  }
}
