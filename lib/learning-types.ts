export type LearningStatus = "unassessed" | "on_track" | "needs_support";
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
