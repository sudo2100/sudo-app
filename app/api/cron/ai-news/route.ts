import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export const runtime = "nodejs";

// Vercel Cron 전용 엔드포인트 — vercel.json의 "0 22 * * *"(22:00 UTC = 07:00 KST)에 호출된다.
// CRON_SECRET을 설정하면 Vercel이 모든 Cron 호출에 Authorization: Bearer <CRON_SECRET> 헤더를 자동으로 실어 보낸다.
export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "인증되지 않은 요청입니다." }, { status: 401 });
    }
  }

  // "days" 프로필 — lib/aiNews.ts의 unstable_cache revalidate(86400초)와 동일한 하루 주기를 의미한다.
  revalidateTag("ai-news", "days");
  return NextResponse.json({ success: true, revalidated: "ai-news", now: new Date().toISOString() });
}
