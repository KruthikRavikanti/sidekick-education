import { ParentDashboard } from "@/components/parent-dashboard";
import { requireAccount } from "@/lib/server-account";
export default async function ParentDashboardPage() {
  await requireAccount("parent");
  return <ParentDashboard />;
}
