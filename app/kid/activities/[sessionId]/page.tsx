import { ActivityPlayer } from "@/components/activity-player";
import { requireAccount } from "@/lib/server-account";

export default async function ActivityPage({ params }: { params: Promise<{ sessionId: string }> }) {
  await requireAccount("kid");
  const { sessionId } = await params;
  return <ActivityPlayer sessionId={sessionId} />;
}
