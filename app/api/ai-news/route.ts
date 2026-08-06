import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { fetchAiNewsFromSources } from "@/lib/aiNews";

export const runtime = "nodejs";

// AI 뉴스 스크래핑 결과를 "ai-news" 태그로 캐싱 — ISR처럼 하루(86400초) 주기로 재검증되고,
// /api/revalidate 또는 Vercel Cron이 revalidateTag("ai-news")를 호출하면 즉시 갱신된다.
const getCachedAiNews = unstable_cache(fetchAiNewsFromSources, ["ai-news-feed"], {
  revalidate: 86400,
  tags: ["ai-news"],
});

export async function GET() {
  try {
    const data = await getCachedAiNews();
    return NextResponse.json(data);
  } catch (error) {
    console.error("AI 뉴스 fetch error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      {
        news: [],
        updatedAt: new Date().toISOString(),
        error: "뉴스를 불러오지 못했습니다.",
      },
      { status: 500 },
    );
  }
}
