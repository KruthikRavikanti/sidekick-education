import { redirect } from "next/navigation";
import { requireAccount } from "@/lib/server-account";
export default async function ParentPage() {
  await requireAccount("parent");
  redirect("/parent/dashboard");
}
