import { KidHome } from "@/components/kid-pages";
import { requireAccount } from "@/lib/server-account";
export default async function KidPage() {
  await requireAccount("kid");
  return <KidHome />;
}
