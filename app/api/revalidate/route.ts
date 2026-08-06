import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export const runtime = "nodejs";

// 온디맨드 ISR 재검증 — AI 뉴스를 긴급 갱신해야 할 때 시크릿 토큰과 함께 호출한다.
// 사용 예: curl -X POST https://<host>/api/revalidate -H "x-revalidate-secret: <REVALIDATE_SECRET>"
export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "REVALIDATE_SECRET이 설정되지 않았습니다." }, { status: 503 });
  }

  const provided = req.headers.get("x-revalidate-secret");
  if (provided !== secret) {
    return NextResponse.json({ error: "유효하지 않은 재검증 토큰입니다." }, { status: 401 });
  }

  // "days" 프로필 — lib/aiNews.ts의 unstable_cache revalidate(86400초)와 동일한 하루 주기를 의미한다.
  revalidateTag("ai-news", "days");
  return NextResponse.json({ success: true, revalidated: "ai-news", now: new Date().toISOString() });
}
