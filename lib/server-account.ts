import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import type { SessionView } from "./account-types";
import { ACTIVITY_RETURN_HEADER, activityEntry, safeActivityReturn } from "./activity-return";

export async function serverSession(): Promise<SessionView | null> {
  const cookie = (await cookies()).toString();
  if (!cookie) return null;
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL || "http://127.0.0.1:8000"}/api/auth/session`,
      {
        headers: { Cookie: cookie },
        cache: "no-store",
      },
    );
    return response.ok ? await response.json() : null;
  } catch {
    return null;
  }
}

export async function requireAccount(mode?: SessionView["mode"], returnTo?: string | null) {
  const session = await serverSession();
  const target = safeActivityReturn(returnTo)
    || (mode === "kid" ? safeActivityReturn((await headers()).get(ACTIVITY_RETURN_HEADER)) : null);
  if (!session) redirect(activityEntry("/login", target));
  if (mode === "parent" && session.mode !== "parent")
    redirect("/parent/unlock");
  if (mode === "kid" && (session.mode !== "kid" || !session.activeKid))
    redirect(activityEntry("/profiles", target));
  if (mode === "picker" && session.mode !== "picker")
    redirect(session.mode === "kid" ? "/kid" : "/parent/dashboard");
  return session;
}
