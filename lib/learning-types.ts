export type LearningStatus =
  | "unassessed"
  | "on_track"
  | "checking"
  | "gap"
  | "practicing"
  | "mastered";
export interface LearningSkill {
  id: string;
  name: string;
  subject: "math" | "ela";
  commonCoreCode: string;
  status: LearningStatus;
  subskillId?: string;
  parentExplanation?: string;
  observedPattern?: string;
  homeTip?: string;
  evidence?: unknown[];
  traceback?: unknown[];
  currentPracticeTarget?: unknown;
  teacherSuggestion?: string | null;
}
export interface PracticeItem {
  assignmentId: string;
  assignmentItemId: string;
  itemId: string;
  purpose: "check" | "practice" | "recheck";
  question: string;
  context: Record<string, unknown> | string;
  responseSpec: Record<string, unknown>;
  readAloud: string | null;
}
export interface PracticeSession {
  sessionId: string | null;
  items: PracticeItem[];
  pendingCount: number;
  message: string;
}
export interface UploadRecord {
  id: string;
  state: string;
  stage: string;
  pageCount?: number;
  pages?: number;
  problemCount?: number;
  error?: string | { code: string; message: string } | null;
  extraction?: import("./extraction").Extraction | null;
  problems?: {
    id: string;
    page?: number;
    grading?: { correctness: string; explanation?: string };
    teacherConflict?: boolean;
    mapping?: unknown;
    signature?: unknown;
  }[];
  createdAt?: number;
}
