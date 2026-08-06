"use client";

import { ChevronUp, Mail, Globe, MapPin } from "lucide-react";
import type { Translations } from "@/lib/translations";

interface FooterProps {
  onScrollToTop: () => void;
  t: Translations;
}

export default function Footer({ onScrollToTop, t }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Company info + contact info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-slate-800 pb-8">

          {/* Left: company info */}
          <div className="space-y-1.5">
            <p className="text-base font-extrabold text-slate-100 tracking-tight">{t.footer.companyName}</p>
            <p className="text-[11px] font-semibold text-indigo-400 tracking-widest uppercase">{t.footer.companyTag}</p>
            <p className="text-xs text-slate-400 pt-1">{t.footer.companyDesc}</p>
            <div className="pt-2 space-y-0.5 text-[11px] text-slate-500">
              <p>{t.footer.ceoLabel}: {t.profile.ceoName}</p>
              <p>{t.footer.bizNumberLabel}: 112-33-91011</p>
            </div>
          </div>

          {/* Right: contact info */}
          <div className="space-y-2 text-xs font-medium">
            <h4 className="font-bold text-slate-200 uppercase tracking-widest text-[10px] mb-3">{t.footer.contactInfoTitle}</h4>
            <div className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <a href="mailto:sudo2100@naver.com" className="hover:text-indigo-300 transition">
                sudo2100@naver.com
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <a href="https://www.sudo-app.kr" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-300 transition">
                www.sudo-app.kr
              </a>
            </div>
            <div className="flex items-start space-x-2">
              <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
              <span>{t.footer.address}</span>
            </div>
          </div>

          <button
            onClick={onScrollToTop}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 rounded-full transition active:scale-90 cursor-pointer flex items-center justify-center border border-slate-700 self-end sm:self-auto"
            title={t.footer.scrollToTopAria}
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>

        {/* Copyright */}
        <div className="pt-6 text-xs text-slate-500 font-semibold text-center">
          {t.footer.copyright}
        </div>

      </div>
    </footer>
  );
}
