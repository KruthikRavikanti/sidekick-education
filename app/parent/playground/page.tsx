import { GamePlayground } from "@/components/game-playground";
import { requireAccount } from "@/lib/server-account";

// Temporary: shown only while SIDEKICK_GAMES_PLAYGROUND is on. See components/game-playground.tsx.
export default async function GamePlaygroundPage() {
  await requireAccount("parent");
  return <GamePlayground />;
}
