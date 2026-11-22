/** Navigation intent only. Session ownership is always checked by the backend. */
export const ACTIVITY_RETURN_HEADER = "x-sidekick-activity-return";

export function safeActivityReturn(value: unknown): string | null {
  if (typeof value !== "string" || value.trim() !== value) return null;
  return /^\/kid\/activity-preview(?:\/(?:generations\/[A-Za-z0-9_-]{1,100}|[A-Za-z0-9_-]{1,100}))?$/.test(value)
    ? value
    : null;
}

export function activityEntry(path: "/login" | "/signup" | "/profiles", target?: string | null): string {
  const safe = safeActivityReturn(target);
  return safe ? `${path}?${new URLSearchParams({ next: safe })}` : path;
}

export function browserActivityReturn(): string | null {
  if (typeof window === "undefined") return null;
  return safeActivityReturn(window.location.pathname)
    || safeActivityReturn(new URLSearchParams(window.location.search).get("next"));
}
