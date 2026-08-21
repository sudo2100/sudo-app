"use client";

import { useEffect, useState } from "react";
import type { ScheduleItem } from "@/lib/types";
import type { Translations } from "@/lib/translations";

interface SchedulePopupProps {
  t: Translations;
  initialItems?: ScheduleItem[];
}

export default function SchedulePopup({ t, initialItems }: SchedulePopupProps) {
  const [show, setShow] = useState((initialItems?.length ?? 0) > 0);
  const [items, setItems] = useState<ScheduleItem[]>(initialItems ?? []);

  useEffect(() => {
    // 서버에서 이미 일정을 받아온 경우 클라이언트 재조회 없이 즉시 노출
    if (initialItems) return;

    (async () => {
      try {
        const res = await fetch("/api/schedules");
        const data = await res.json();
        const schedules: ScheduleItem[] = data.schedules || [];
        setItems(schedules);
        if (schedules.length > 0) {
          setShow(true);
        }
      } catch {
        // 일정 조회 실패 시 팝업을 노출하지 않음
      }
    })();
  }, [initialItems]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center px-4 py-6 sm:items-center sm:py-12">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity" />
      <div className="relative w-full max-w-xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{t.popup.title}</h2>
            <p className="text-sm text-slate-500">{t.popup.subtitle}</p>
          </div>
          <button
            onClick={() => setShow(false)}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
            aria-label={t.popup.closeAria}
          >
            ✕
          </button>
        </div>
        <div className="space-y-4 px-5 py-6 sm:px-6">
          {items.map((item) => (
            <article key={item.id} className="rounded-3xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-sm font-semibold text-indigo-700">{item.dateLabel}</p>
              <p className="mt-1 text-base font-semibold text-slate-900">{item.description}</p>
            </article>
          ))}
          <div className="flex justify-end">
            <button
              onClick={() => setShow(false)}
              className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/15 hover:bg-indigo-700 transition"
            >
              {t.popup.confirmButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
