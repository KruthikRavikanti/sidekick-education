import { ActivityProgramGeneration } from "@/components/activity-program-composition";

export default async function ProgramGenerationPage({ params }: { params: Promise<{ generationId: string }> }) {
  const { generationId } = await params;
  return <ActivityProgramGeneration generationId={generationId} />;
}
