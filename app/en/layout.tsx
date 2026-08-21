import type { Metadata } from "next";
import { notoSansKr } from "@/lib/fonts";
import { translations } from "@/lib/translations";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sudo-app.kr"),
  title: "SUDO Soft | AI Coaching & Software Development",
  description: translations.en.profile.companyDesc,
  openGraph: {
    title: "SUDO Soft - Advanced Software & AI",
    description: "Hands-on software development and generative AI coaching, led by CEO Giyong Kim.",
    url: "https://sudo-app.kr/en",
    siteName: "SUDO Soft",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/ai_coaching_banner_1781579699499.jpg",
        width: 1376,
        height: 768,
      },
    ],
  },
};

export default function EnRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
