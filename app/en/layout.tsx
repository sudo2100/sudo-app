import type { Metadata } from "next";
import { notoSansKr } from "@/lib/fonts";
import { translations } from "@/lib/translations";
import "../globals.css";

export const metadata: Metadata = {
  title: "SUDO Soft | AI Coaching & Software Development",
  description: translations.en.profile.companyDesc,
};

export default function EnRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
