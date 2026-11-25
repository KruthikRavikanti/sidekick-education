export type GameSkill = {
  id: string;
  name: string;
  subject: "math" | "ela" | null;
};
export type GameCard = {
  id: string;
  title: string;
  premise: string;
  emoji: string;
};
export type GameSuggestionData = {
  enabled: boolean;
  state: "off" | "none" | "building" | "in_review" | "ready";
  reason: string | null;
  targetSkill: GameSkill | null;
  game: GameCard | null;
  canRequest: boolean;
  runId: string | null;
};
export type GameSolo = {
  solved: boolean;
  firstTry: boolean;
  attempts: number;
  mistakes: string[];
};
export type GameResult = {
  rounds: {
    id: string;
    phase: "guided" | "solo";
    attempts: number;
    hints: number;
    solved: boolean;
    firstTry: boolean | null;
    mistakes: string[];
  }[];
  solo: GameSolo | null;
  ms: number;
};
export type GameRun = {
  id: string;
  status: "in_progress" | "completed";
  uploadId: string | null;
  game: GameCard;
  targetSkill: GameSkill;
  messageToken: string;
  kitVersion: string;
  result: GameResult | null;
};
export type GameHistoryItem = {
  id: string;
  title: string;
  emoji: string;
  status: "in_progress" | "completed";
  startedAt: number;
  completedAt: number | null;
  targetSkill: GameSkill | null;
  solo: GameSolo | null;
  hints: number;
};
export type GameReviewItem = {
  id: string;
  title: string;
  emoji: string;
  premise: string;
  idea: string;
  status: "verified" | "approved" | "retired";
  origin: "seed_example" | "model_generated";
  model: string;
  grade: number;
  subject: "math" | "ela";
  createdAt: number;
  decidedAt: number | null;
  plays: number;
  targetSkill: { id: string; name: string; misconception: string };
  robot: { passed: boolean; checks: number; stats: Record<string, number> };
};
export type GameReviewDetail = GameReviewItem & {
  code: string;
  css: string;
  kitVersion: string;
  promptVersion: string;
  decisionNote: string | null;
  robotChecks: { name: string; ok: boolean; detail: string }[];
  modelReview: (Record<string, boolean> & { issues?: string[] }) | null;
  rounds: {
    id: string;
    phase: "guided" | "solo";
    say: string;
    hints: string[];
    win: string;
    mistakes: { tag: string; say: string }[];
  }[];
};
export type GameReviewList = {
  enabled: boolean;
  requireApproval: boolean;
  autogenerate: boolean;
  modelConfigured: boolean;
  games: GameReviewItem[];
  jobs: {
    id: string;
    status: "queued" | "running" | "failed";
    skill: { id: string; name: string };
    updatedAt: number;
    failure: { code: string; problems: string[] } | null;
  }[];
};
