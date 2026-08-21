import HomeSections from "@/components/HomeSections";
import { listSchedules } from "@/lib/db";

export default async function KoHomePage() {
  const initialSchedules = await listSchedules().catch(() => []);
  return <HomeSections locale="ko" initialSchedules={initialSchedules} />;
}
