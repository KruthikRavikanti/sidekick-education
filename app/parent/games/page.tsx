import { GameReview } from "@/components/game-review";
import { requireAccount } from "@/lib/server-account";

export default async function GameReviewPage() {
  await requireAccount("parent");
  return <GameReview />;
}
