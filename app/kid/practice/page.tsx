import { redirect } from "next/navigation";
import { requireAccount } from "@/lib/server-account";
export default async function PracticePage() {
  await requireAccount("kid");
  redirect("/kid");
}
