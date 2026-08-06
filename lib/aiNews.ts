export interface AiNewsItem {
  title: string;
  link: string;
  source: string;
  pubDate: string;
  imageUrl?: string;
}

export interface AiNewsData {
  news: AiNewsItem[];
  updatedAt: string;
}

function decodeXmlEntities(value: string): string {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/<!\[CDATA\[/g, "")
    .replace(/\]\]>/g, "")
    .trim();
}

function makeFallbackImage(title: string): string {
  const seed = encodeURIComponent(title.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").slice(0, 24));
  return `https://picsum.photos/seed/${seed || "ai-news"}/640/360?auto=format&fit=crop`;
}

function normalizeUrl(url: string, baseUrl: string): string {
  try {
    return new URL(url, baseUrl).href;
  } catch {
    return url;
  }
}

function parsePageImage(html: string, pageUrl: string): string | null {
  const metaMatches = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+name=["']twitter:image:src["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["'][^>]*>/i,
  ];

  for (const pattern of metaMatches) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return normalizeUrl(decodeXmlEntities(match[1]), pageUrl);
    }
  }

  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  if (imgMatch?.[1]) {
    return normalizeUrl(decodeXmlEntities(imgMatch[1]), pageUrl);
  }

  return null;
}

async function fetchArticleImage(pageUrl: string): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(pageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) return null;

    const html = await response.text();
    return parsePageImage(html, pageUrl);
  } catch (error) {
    console.error("기사 페이지 이미지 추출 실패:", pageUrl, error);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function enrichNewsImages(news: AiNewsItem[]): Promise<AiNewsItem[]> {
  return await Promise.all(
    news.map(async (item) => {
      if (item.imageUrl) {
        return item;
      }

      const imageUrl = await fetchArticleImage(item.link);
      return {
        ...item,
        imageUrl: imageUrl || makeFallbackImage(item.title),
      };
    }),
  );
}

function extractBingArticleUrl(bingLink: string): string {
  try {
    const real = new URL(bingLink).searchParams.get("url");
    return real || bingLink;
  } catch {
    return bingLink;
  }
}

function parseBingNewsRss(xml: string): AiNewsItem[] {
  const itemRegex = /<item\b[^>]*>([\s\S]*?)<\/item>/gi;
  const parsed: AiNewsItem[] = [];

  for (const match of xml.matchAll(itemRegex)) {
    const itemBlock = match[1] ?? "";
    const titleMatch = itemBlock.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
    const linkMatch = itemBlock.match(/<link\b[^>]*>([\s\S]*?)<\/link>/i);
    const pubDateMatch = itemBlock.match(/<pubDate\b[^>]*>([\s\S]*?)<\/pubDate>/i);
    const sourceMatch = itemBlock.match(/<News:Source\b[^>]*>([\s\S]*?)<\/News:Source>/i);
    // Bing embeds the article's own hero image here, so the thumbnail matches the story.
    const imageMatch = itemBlock.match(/<News:Image\b[^>]*>([\s\S]*?)<\/News:Image>/i);

    const title = titleMatch ? decodeXmlEntities(titleMatch[1]) : "";
    const rawLink = linkMatch ? decodeXmlEntities(linkMatch[1]) : "";
    const link = rawLink ? extractBingArticleUrl(rawLink) : "";
    const pubDate = pubDateMatch ? decodeXmlEntities(pubDateMatch[1]) : "";
    const source = sourceMatch ? decodeXmlEntities(sourceMatch[1]) : "";
    const imageBase = imageMatch ? decodeXmlEntities(imageMatch[1]) : "";

    if (title && link) {
      parsed.push({
        title: title.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(),
        link,
        source: source.replace(/<[^>]+>/g, "").trim() || "Bing 뉴스",
        pubDate: pubDate || new Date().toISOString(),
        imageUrl: imageBase ? `${imageBase}&w=640&h=360&c=7` : undefined,
      });
    }
  }

  return parsed.slice(0, 12);
}

function parseGoogleNewsRss(xml: string): AiNewsItem[] {
  const itemRegex = /<item\b[^>]*>([\s\S]*?)<\/item>/gi;
  const parsed: AiNewsItem[] = [];

  for (const match of xml.matchAll(itemRegex)) {
    const itemBlock = match[1] ?? "";
    const titleMatch = itemBlock.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
    const linkMatch = itemBlock.match(/<link\b[^>]*>([\s\S]*?)<\/link>/i);
    const pubDateMatch = itemBlock.match(/<pubDate\b[^>]*>([\s\S]*?)<\/pubDate>/i);
    const sourceMatch = itemBlock.match(/<source\b[^>]*>([\s\S]*?)<\/source>/i);
    const imageMatch =
      itemBlock.match(/<media:content[^>]*url=["']([^"']+)["'][^>]*\/?>/i)
      || itemBlock.match(/<media:thumbnail[^>]*url=["']([^"']+)["'][^>]*\/?>/i)
      || itemBlock.match(/<enclosure[^>]*url=["']([^"']+)["'][^>]*\/?>/i)
      || itemBlock.match(/<img[^>]*src=["']([^"']+)["'][^>]*>/i);

    const title = titleMatch ? decodeXmlEntities(titleMatch[1]) : "";
    const link = linkMatch ? decodeXmlEntities(linkMatch[1]) : "";
    const pubDate = pubDateMatch ? decodeXmlEntities(pubDateMatch[1]) : "";
    const source = sourceMatch ? decodeXmlEntities(sourceMatch[1]) : "";
    const imageUrl = imageMatch ? decodeXmlEntities(imageMatch[1]) : "";

    if (title && link) {
      parsed.push({
        title: title.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(),
        link,
        source: source.replace(/<[^>]+>/g, "").trim() || "Google News",
        pubDate: pubDate || new Date().toISOString(),
        imageUrl: imageUrl || makeFallbackImage(title),
      });
    }
  }

  return parsed.slice(0, 12);
}

function getFallbackNews(): AiNewsItem[] {
  return [
    {
      title: "생성형 AI가 업무 자동화와 교육 혁신을 가속화하는 이유",
      link: "https://example.com/ai-automation",
      source: "SUDO 소프트",
      pubDate: new Date().toISOString(),
      imageUrl: makeFallbackImage("생성형 AI가 업무 자동화와 교육 혁신을 가속화하는 이유"),
    },
    {
      title: "대형 언어 모델과 실무 도구 통합이 만드는 새로운 개발 생산성",
      link: "https://example.com/ai-productivity",
      source: "AI 코칭 뉴스",
      pubDate: new Date().toISOString(),
      imageUrl: makeFallbackImage("대형 언어 모델과 실무 도구 통합이 만드는 새로운 개발 생산성"),
    },
    {
      title: "AI 기반 개인화 학습과 실전 코칭의 결합이 주목받는 이유",
      link: "https://example.com/ai-education",
      source: "SUDO 소프트",
      pubDate: new Date().toISOString(),
      imageUrl: makeFallbackImage("AI 기반 개인화 학습과 실전 코칭의 결합이 주목받는 이유"),
    },
  ];
}

export async function fetchAiNewsFromSources(): Promise<AiNewsData> {
  const requestHeaders = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  };

  // Bing News RSS embeds each article's real hero image (News:Image) and links
  // straight to the source article, so thumbnails match the story content.
  const bingRssUrls = [
    "https://www.bing.com/news/search?q=인공지능 AI&format=RSS&setlang=ko-KR&cc=KR",
    "https://www.bing.com/news/search?q=AI&format=RSS&setlang=ko-KR&cc=KR",
  ];

  let news: AiNewsItem[] = [];

  for (const rssUrl of bingRssUrls) {
    try {
      const response = await fetch(rssUrl, { headers: requestHeaders, cache: "no-store" });
      if (!response.ok) continue;

      const xml = await response.text();
      news = parseBingNewsRss(xml);
      if (news.length > 0) break;
    } catch (error) {
      console.error("Bing 뉴스 RSS 요청 실패:", error);
    }
  }

  // Google News RSS as a fallback when Bing is unreachable (its links are
  // obfuscated redirects, so images still need per-article enrichment below).
  if (news.length === 0) {
    const googleRssUrls = [
      "https://news.google.com/rss/search?q=인공지능 AI&hl=ko&gl=KR&ceid=KR:ko",
      "https://news.google.com/rss/search?q=AI&hl=ko&gl=KR&ceid=KR:ko",
    ];

    for (const rssUrl of googleRssUrls) {
      try {
        const response = await fetch(rssUrl, { headers: requestHeaders, cache: "no-store" });
        if (!response.ok) continue;

        const xml = await response.text();
        news = parseGoogleNewsRss(xml);
        if (news.length > 0) break;
      } catch (error) {
        console.error("AI 뉴스 RSS 요청 실패:", error);
      }
    }
  }

  if (news.length === 0) {
    news = getFallbackNews();
  } else {
    news = await enrichNewsImages(news);
  }

  return {
    news,
    updatedAt: new Date().toISOString(),
  };
}
