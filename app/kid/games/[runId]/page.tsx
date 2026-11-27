import { GamePlayer } from "@/components/game-player";
import { requireAccount } from "@/lib/server-account";

export default async function GamePage({ params }: { params: Promise<{ runId: string }> }) {
  await requireAccount("kid");
  const { runId } = await params;
  return <GamePlayer runId={runId} />;
}
