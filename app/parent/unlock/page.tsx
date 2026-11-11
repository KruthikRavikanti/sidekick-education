import { ParentPinGate } from "@/components/parent-pin-gate";
import { requireAccount } from "@/lib/server-account";
export default async function UnlockPage() {
  await requireAccount();
  return <ParentPinGate />;
}
