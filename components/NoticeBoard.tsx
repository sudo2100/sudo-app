"use client";

import { useRouter } from "next/navigation";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { translations } from "@/lib/translations";
import type { Locale } from "@/lib/locale";
import type { ScheduleItem } from "@/lib/types";

interface NoticeBoardProps {
  locale: Locale;
  notices: ScheduleItem[];
}

export default function NoticeBoard({ locale, notices }: NoticeBoardProps) {
  const t = translations[locale];
  const router = useRouter();

  const handleNavigate = (id: string) => {
    const homePath = locale === "en" ? "/en" : "/";
    router.push(`${homePath}#${id}`);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-indigo-600 selection:text-white">
      <Navigation activeSection="notices" onNavigate={handleNavigate} t={t} locale={locale} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="mb-10 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{t.notices.pageTitle}</h1>
          <p className="text-sm text-slate-500">{t.notices.pageSubtitle}</p>
        </div>

        {notices.length === 0 ? (
          <p className="text-sm text-slate-400 py-16 text-center">{t.notices.empty}</p>
        ) : (
          <div className="space-y-4">
            {notices.map((item) => (
              <article key={item.id} className="rounded-3xl bg-white border border-slate-200 shadow-sm p-5 sm:p-6">
                <p className="text-sm font-semibold text-indigo-700">{item.dateLabel}</p>
                <p className="mt-1.5 text-base font-semibold text-slate-900">{item.description}</p>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer onScrollToTop={handleScrollToTop} t={t} />
    </div>
  );
}
