/** Public activity DTOs. Grading rules and future scenes stay on the server. */
export type ActivityResponse =
  | string
  | { selectedParts: number[] }
  | { tick: number }
  | { tileIds: string[] }
  | { choiceId: string }
  | { splitFactor: number }
  | { bundles: number }
  | { order: string[] }
  | { sentenceId: string };

interface ToolkitMaterial {
  context: string | null;
  teachingText: string | null;
  goal: string;
}

export interface ActivitySceneBase {
  id: string;
  prompt: string;
  phase: "guided" | "independent";
}

export type ActivityScene = ActivitySceneBase &
  (
    | { component: "fraction_builder"; params: { denominator: number } }
    | {
        component: "number_line";
        params: { denominator: number; min: number; max: number };
      }
    | {
        component: "word_tiles";
        params: { baseWord: string; tiles: { id: string; text: string }[] };
      }
    | {
        component: "word_choice";
        params: { baseWord: string; options: { id: string; text: string }[] };
      }
    | {
        component: "independent_fraction";
        params: { unitDenominator: number; copies: number };
      }
    | { component: "independent_word"; params: { baseWord: string } }
    | {
        component: "guided_choice";
        params: {
          context: string | null;
          teachingText: string;
          options: { id: string; text: string }[];
        };
      }
    | {
        component: "guided_response";
        params: { context: string | null; teachingText: string };
      }
    | {
        component: "fraction_split_compare";
        params: {
          context: string | null;
          teachingText: string;
          wholeLabel: string;
          shadedLabel: string;
          numerator: number;
          denominator: number;
          splitFactors: number[];
        };
      }
    | {
        component: "independent_response";
        params: { context: string | null };
      }
    | {
        component: "bundle_builder";
        params: ToolkitMaterial & {
          itemLabel: string;
          groupLabel: string;
          total: number;
          groupSize: 10;
        };
      }
    | {
        component: "tile_order";
        params: ToolkitMaterial & {
          tiles: { id: string; text: string }[];
          ordering: "story" | "sentence" | "ascending" | "descending";
        };
      }
    | {
        component: "evidence_board";
        params: ToolkitMaterial & {
          sentences: { id: string; text: string }[];
          boardLabel: string;
        };
      }
  );

export interface ActivityFeedback {
  correct: boolean;
  message: string;
}

export interface ActivitySession {
  id: string;
  origin: "original_example" | "model_generated";
  title: string;
  subject: "math" | "ela";
  targetSkill: { id: string; name: string; subject: "math" | "ela" };
  status: "in_progress" | "completed";
  sceneIndex: number;
  sceneCount: number;
  currentScene: ActivityScene | null;
  currentResponse: ActivityResponse | null;
  feedback: ActivityFeedback | null;
  hint: string | null;
  canAdvance: boolean;
  finalResult: { question: string; response: string; correct: boolean } | null;
}

export interface ActivitySuggestionData {
  available: boolean;
  reason: string | null;
  targetSkill: { id: string; name: string; subject: "math" | "ela" } | null;
  sessionId: string | null;
}

export interface ActivityHistoryItem {
  id: string;
  origin: "original_example" | "model_generated";
  title: string;
  subject: "math" | "ela";
  targetSkill: { id: string; name: string; subject: "math" | "ela" };
  status: "in_progress" | "completed";
  startedAt: number;
  completedAt: number | null;
  finalResult: { question: string; response: string; correct: boolean } | null;
  guidedHintCount?: number;
}
