import type { Metadata } from "next";
import { notoSansKr } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "관리자 대시보드 | SUDO 소프트",
  description: "상담 신청 관리자 대시보드",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
