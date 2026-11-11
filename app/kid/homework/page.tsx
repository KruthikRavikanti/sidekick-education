import { KidHomework } from "@/components/kid-pages";
import { requireAccount } from "@/lib/server-account";
export default async function HomeworkPage() {
  await requireAccount("kid");
  return <KidHomework />;
}
