import type { Metadata } from "next";
import NoticeBoard from "@/components/NoticeBoard";
import { listSchedules } from "@/lib/db";

export const metadata: Metadata = {
  title: "Notices | SUDO Soft",
};

export default async function EnNoticesPage() {
  const notices = await listSchedules().catch(() => []);
  return <NoticeBoard locale="en" notices={notices} />;
}
