export type Grade = "K" | "1" | "2" | "3" | "4" | "5";
export type AvatarKey = "fox" | "owl" | "bear" | "bunny" | "cat" | "panda";
export interface PickerProfile {
  id: string;
  firstName: string;
  avatarKey: AvatarKey;
}
export interface KidProfile extends PickerProfile {
  grade: Grade;
}
export interface SessionView {
  mode: "picker" | "kid" | "parent";
  activeKidProfileId: string | null;
  activeKid: KidProfile | null;
  parentExpiresAt: number | null;
  version: number;
}
export interface PinGate {
  pinSetupRequired: boolean;
  lockedUntil: number | null;
}
export interface Skill {
  id: string;
  name: string;
  subject: "math" | "ela";
  commonCoreCode: string;
  status: "gap" | "practicing" | "mastered" | "unassessed";
}
export interface ConversationSummary {
  id: string;
  title: string;
  startedAt: number;
  preview: string;
}
export interface DashboardData {
  profile: KidProfile;
  sample: true;
  skills: Skill[];
  analytics: {
    sessionsThisWeek: number;
    timeSpentMinutes: number;
    problemsAttempted: number;
    problemsCorrect: number;
  };
  conversations: ConversationSummary[];
}
export interface Conversation {
  id: string;
  title: string;
  startedAt: number;
  sample: true;
  messages: { role: "student" | "sidekick"; text: string; timestamp: number }[];
}
