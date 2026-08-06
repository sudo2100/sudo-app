import type { Metadata } from "next";
import { notoSansKr } from "@/lib/fonts";
import { translations } from "@/lib/translations";
import "../globals.css";

export const metadata: Metadata = {
  title: "SUDO 소프트 | AI 코칭 & 소프트웨어 개발",
  description: translations.ko.profile.companyDesc,
};

export default function KoRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
