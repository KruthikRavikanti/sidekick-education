import { ActivityProgramPlayer } from "@/components/activity-program-player";

export default async function ActivityProgramPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  return <ActivityProgramPlayer sessionId={sessionId} />;
}
