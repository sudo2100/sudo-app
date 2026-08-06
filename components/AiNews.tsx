"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Clock3 } from "lucide-react";
import type { Translations } from "@/lib/translations";
import type { Locale } from "@/lib/locale";

interface AiNewsItem {
  title: string;
  link: string;
  source: string;
  pubDate: string;
  imageUrl?: string;
}

interface AiNewsResponse {
  news: AiNewsItem[];
  updatedAt: string;
}

interface AiNewsProps {
  t: Translations;
  locale: Locale;
}

function formatRelativeTime(value: string, t: Translations["aiNews"]) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return t.timeJustNow;

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return t.timeJustNow;
  if (diffMinutes < 60) return t.timeMinutesAgo(diffMinutes);
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return t.timeHoursAgo(diffHours);
  const diffDays = Math.floor(diffHours / 24);
  return t.timeDaysAgo(diffDays);
}

export default function AiNews({ t, locale }: AiNewsProps) {
  const [news, setNews] = useState<AiNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai-news");
      if (!response.ok) {
        throw new Error(t.aiNews.fetchErrorMessage);
      }

      const data: AiNewsResponse = await response.json();
      setNews(data.news ?? []);
      setUpdatedAt(data.updatedAt ?? null);
    } catch (err) {
      const message = err instanceof Error ? err.message : t.aiNews.unknownError;
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 마운트 시 1회 뉴스 fetch
    void fetchNews();
  }, []);

  const summary = useMemo(() => {
    if (!news.length) return t.aiNews.summaryEmpty;
    return t.aiNews.summaryCount(news.length);
  }, [news.length, t]);

  const makePlaceholderImage = (title: string) => {
    const seed = title.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").slice(0, 24) || "ai-news";
    return `https://picsum.photos/seed/${seed}/640/360?auto=format&fit=crop`;
  };

  return (
    <section id="ai-news" className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
          <span className="text-xs font-extrabold tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100/50">
            {t.aiNews.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.aiNews.title}
          </h2>
          <div className="w-12 h-1 bg-indigo-600 mx-auto rounded-full" />
          <p className="text-slate-500 font-medium text-sm sm:text-base">
            {summary}
          </p>
        </div>

        <div className="text-center text-sm text-slate-500 mb-8">
          {updatedAt
            ? `${t.aiNews.updatedAtPrefix}${new Date(updatedAt).toLocaleString(locale === "ko" ? "ko-KR" : "en-US")}${t.aiNews.updatedAtSuffix}`
            : t.aiNews.loadingText}
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="animate-pulse rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="h-40 w-full rounded-3xl bg-slate-200 mb-4" />
                <div className="h-3 w-24 rounded bg-slate-200 mb-4" />
                <div className="h-4 w-full rounded bg-slate-200 mb-3" />
                <div className="h-4 w-5/6 rounded bg-slate-200 mb-6" />
                <div className="h-3 w-20 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">
            <p className="font-semibold">{t.aiNews.errorTitle}</p>
            <p className="mt-2 text-sm">{error}</p>
          </div>
        ) : news.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
            {t.aiNews.noNews}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {news.map((item, index) => (
              <motion.article
                key={`${item.link}-${index}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className="group rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <div className="relative overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl ?? makePlaceholderImage(item.title)}
                    alt={item.title}
                    loading="lazy"
                    className="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{item.source || t.aiNews.sourceFallback}</span>
                  </div>

                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="block mt-4 text-base font-semibold leading-6 text-slate-900 line-clamp-3 hover:text-indigo-600 transition"
                  >
                    {item.title}
                  </a>

                  <div className="mt-5 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="w-4 h-4" />
                      {formatRelativeTime(item.pubDate, t.aiNews)}
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
