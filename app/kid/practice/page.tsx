import { KidHome } from "@/components/kid-pages";
import { requireAccount } from "@/lib/server-account";
export default async function PracticePage() {
  await requireAccount("kid");
  return <KidHome practice />;
}
