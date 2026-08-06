import AdminDashboard from "@/components/AdminDashboard";

// 인증 필요·개인정보 포함 페이지 — 정적 캐싱 대상에서 명시적으로 제외
export const dynamic = "force-dynamic";

export default function AdminPage() {
  return <AdminDashboard />;
}
