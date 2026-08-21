import HomeSections from "@/components/HomeSections";
import { listSchedules } from "@/lib/db";

export default async function EnHomePage() {
  const initialSchedules = await listSchedules().catch(() => []);
  return <HomeSections locale="en" initialSchedules={initialSchedules} />;
}
