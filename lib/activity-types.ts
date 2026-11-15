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
  | { sentenceId: string }
  | { allocations: { containerId: string; count: number }[] }
  | { marks: { x: number; y: number }[]; text: string }
  | { placements: { pieceId: string; targetId: string }[] }
  | { writtenText: string }
  | { recordingId: string }
  | { strokes: { x: number; y: number }[][] };

interface ToolkitMaterial {
  context: string | null;
  teachingText: string | null;
  goal: string;
}

export interface ActivityVisual {
  kind: "scene" | "book_cover" | "book_pages" | "coins" | "solid_shapes" | "diagram" | "chart";
  title: string;
  author: string | null;
  caption: string | null;
  items: {
    id: string;
    kind: "rect" | "circle" | "triangle" | "line" | "text" | "cube" | "sphere" | "cone" | "cylinder" | "penny" | "nickel" | "dime" | "quarter" | "fox" | "tree" | "sun" | "book";
    label: string;
    x: number; y: number; width: number; height: number;
    color: "green" | "blue" | "red" | "yellow" | "gray" | "brown";
  }[];
}

interface FamilyMaterial extends ToolkitMaterial {
  visual: ActivityVisual | null;
}

export interface ActivitySceneBase {
  id: string;
  prompt: string;
  phase: "guided" | "independent";
  parentParticipation?: boolean;
  connection?: {
    sourceSceneId: string;
    sourceOutput: "area_rectangle" | "quantity_total" | "ordered_text" | "selected_evidence" | "written_text";
    targetInput: "area_rectangle" | "quantity_equation" | "context_material" | "draft_text";
  } | null;
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
    | {
        component: "quantity_lab";
        params: FamilyMaterial & {
          stock: number;
          containers: { id: string; label: string }[];
          unitValue: string;
          taskOperation: "distribute" | "combine" | "remove" | "build";
          initialCounts: number[];
        };
      }
    | {
        component: "math_workspace";
        params: FamilyMaterial & {
          mode: "grid" | "ruler" | "number_line" | "clock" | "angle" | "balance" | "vessel" | "chart" | "equation" | "shape" | "area_tile" | "area_design" | "area_expression";
          width: number;
          height: number;
          step: string;
          origin: string;
          unitLabel: string;
          objects: { id: string; label: string; x: number; y: number; width: number; height: number; shape: "rect" | "circle" | "triangle" | "line" | "text"; value: string | null }[];
          tokens: { id: string; text: string }[];
          area?: { rows: number; columns: number; targetArea: number | null } | null;
        };
      }
    | {
        component: "sort_connect";
        params: FamilyMaterial & {
          pieces: { id: string; text: string }[];
          targets: { id: string; label: string }[];
          mode: "sort" | "connect";
        };
      }
    | {
        component: "text_editor";
        params: FamilyMaterial & {
          mode: "edit" | "compose" | "assemble";
          initialText: string;
          minLength: number;
          maxLength: number;
          minWords: number;
          wordBank: string[];
        };
      }
    | {
        component: "oral_studio";
        params: FamilyMaterial & {
          mode: "read_aloud" | "say_sounds" | "listen_respond" | "perform";
          passage: string;
          listenText: string | null;
        };
      }
    | {
        component: "drawing_studio";
        params: FamilyMaterial & {
          backgroundPrompt: string;
          labels: string[];
        };
      }
  );

export interface ActivityFeedback {
  correct: boolean | null;
  message: string;
}

export interface ActivityResult {
  question: string;
  response: string;
  correct: boolean | null;
  assessmentStatus?: "automatic" | "pending_parent_review" | "parent_reviewed";
  rubric?: string[];
  recordingId?: string | null;
  strokes?: { x: number; y: number }[][] | null;
  reviewNote?: string | null;
  parentParticipation?: boolean;
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
  finalResult: ActivityResult | null;
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
  finalResult: ActivityResult | null;
  guidedHintCount?: number;
}

export interface ActivityAttemptDetail {
  id: string;
  title: string;
  subject: "math" | "ela";
  status: "in_progress" | "completed";
  targetSkill: ActivitySession["targetSkill"];
  scenes: (ActivityScene & {
    responses: {
      response: ActivityResponse;
      responseText: string;
      correct: boolean | null;
      assessmentStatus: "automatic" | "pending_parent_review" | "parent_reviewed";
      hintUsed: boolean;
      createdAt: number;
    }[];
  })[];
  finalResult: ActivityResult | null;
}
