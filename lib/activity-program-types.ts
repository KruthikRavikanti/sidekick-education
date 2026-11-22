/** Public runtime projection. Rules, witnesses and assessment keys stay on the server. */
export type ProgramValue = number | boolean | string | string[] | null;
export type ProgramInputs = Record<string, number | string | string[]>;

export interface ProgramInput {
  id: string;
  kind: "integer" | "text" | "choice" | "id_list" | "artifact";
  minimum?: number | null;
  maximum?: number | null;
  minLength?: number | null;
  maxLength?: number | null;
  options?: string[] | null;
  maxItems?: number | null;
}
export interface ProgramAction {
  id: string;
  componentId: string;
  operation: string;
  inputs: ProgramInput[];
  label: string;
}
export interface ProgramObject {
  id: string;
  kind: string;
  bindings: Record<string, string>;
  materialIds: string[];
  width?: number | null;
  height?: number | null;
}
export interface ProgramMaterial {
  id: string;
  kind: "unit_tiles" | "passage" | "words" | "prompt";
  text: string | null;
  items: { id: string; text: string }[];
  quantity: number | null;
}
export interface ProgramComponent {
  id: string;
  kind: string;
  objectIds: string[];
  spaceId: string;
}
export interface ProgramPreview {
  id: string;
  title: string;
  description: string;
  available?: boolean;
  reasonCode?: string;
  sessionId?: string | null;
  status?: "in_progress" | "completed" | null;
}
export interface ProgramSession {
  id: string;
  programId: string;
  title: string;
  definitionHash: string;
  schemaVersion: string;
  componentVersion: string;
  runtimeVersion: string;
  revision: number;
  actionCount: number;
  status: "in_progress" | "completed";
  spaces: { id: string; title: string }[];
  components: ProgramComponent[];
  objects: ProgramObject[];
  materials: ProgramMaterial[];
  state: Record<string, ProgramValue>;
  stateSlots: { id: string; kind: string; minimum?: number; maximum?: number; options?: string[]; maxItems?: number; maxLength?: number }[];
  actions: ProgramAction[];
  goals: { id: string; description: string; achieved: boolean }[];
  help: { id: string; kind: "hint" | "demonstration" | "cue"; label: string; remainingUses: number }[];
  deliveredHelp: { id: string; kind: string; text: string; uses: number; actionIds: string[]; evidenceIds: string[] }[];
  assistance: { received: boolean; actionIds: string[]; evidenceIds: string[] };
  outcome: {
    missionComplete: boolean;
    assessment: "not_assessed" | "demonstrated" | "pending_parent_review" | "mixed";
    assisted: boolean;
    evidence: { id: string; status: "not_observed" | "not_established" | "demonstrated" | "pending_parent_review"; assisted: boolean }[];
  };
  completionFeedback?: string | null;
}
