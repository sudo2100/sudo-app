import type { Metadata } from "next";
import { notoSansKr } from "@/lib/fonts";
import { translations } from "@/lib/translations";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sudo-app.kr"),
  title: "SUDO 소프트 | AI 코칭 & 소프트웨어 개발",
  description: translations.ko.profile.companyDesc,
  openGraph: {
    title: "SUDO 소프트 - Advanced Software & AI",
    description: "실무 중심 소프트웨어 개발과 생성형 AI 코칭. 김기용 대표와 함께 기업과 개인의 디지털 혁신을 이끕니다.",
    url: "https://sudo-app.kr",
    siteName: "SUDO 소프트",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/images/og-card.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function KoRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
