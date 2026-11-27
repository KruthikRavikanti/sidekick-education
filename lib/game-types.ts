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
  // True when a person still has to approve a new game before it appears.
  approval?: boolean;
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
  // The skill map's own label: "K", "5", "Algebra 1", "9-10".
  gradeLabel: string;
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
  // The six answers are the model reviewer's opinion. `issues` are its notes for the person who reviews.
  modelReview: (Record<string, boolean> & { issues?: string[]; blockers?: string[] }) | null;
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
  // False when the games that ship with the app are switched off: the lists then hold only model-written games.
  premade: boolean;
  modelConfigured: boolean;
  // One page of games that match the filters, and how many match in all.
  games: GameReviewItem[];
  total: number;
  offset: number;
  limit: number;
  counts: { verified: number; approved: number; retired: number };
  grades: { subject: "math" | "ela"; grade: string; waiting: number; total: number }[];
  jobs: {
    id: string;
    status: "queued" | "running" | "failed";
    skill: { id: string; name: string };
    updatedAt: number;
    // Why the build stopped: what turned the game down last, after how many tries, and what it said.
    failure: { code: string; stoppedBy: string | null; tries: number; problems: string[] } | null;
  }[];
};
