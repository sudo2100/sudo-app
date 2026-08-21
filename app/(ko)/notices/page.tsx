import type { Metadata } from "next";
import NoticeBoard from "@/components/NoticeBoard";
import { listSchedules } from "@/lib/db";

export const metadata: Metadata = {
  title: "공지사항 | SUDO 소프트",
};

export default async function KoNoticesPage() {
  const notices = await listSchedules().catch(() => []);
  return <NoticeBoard locale="ko" notices={notices} />;
}
