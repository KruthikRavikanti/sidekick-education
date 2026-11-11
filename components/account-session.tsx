"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  api,
  APIError,
  clearCSRF,
  clearPrivateRequests,
} from "@/lib/account-api";
import type { SessionView } from "@/lib/account-types";

interface SessionContextValue {
  session: SessionView | null;
  checking: boolean;
  connectionError: boolean;
  destination: string | null;
  accept: (
    session: SessionView | null,
    rotateCSRF?: boolean,
    destination?: string,
  ) => void;
  refresh: (lockParent?: boolean) => Promise<void>;
  toPicker: () => Promise<void>;
  chooseKid: (id: string) => Promise<void>;
  logout: () => Promise<void>;
  activity: () => void;
}
const SessionContext = createContext<SessionContextValue | null>(null);
const fingerprint = (session: SessionView | null) =>
  session
    ? `${session.mode}:${session.activeKidProfileId}:${session.version}`
    : "signed-out";
const storageKey = "sidekick-session-change";
function pausePrivateUI() {
  document.documentElement.setAttribute("data-session-paused", "true");
}

export function AccountSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<SessionView | null>(null);
  const [checking, setChecking] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const [destination, setDestination] = useState<string | null>(null);
  const sessionRef = useRef<SessionView | null>(null);
  const channel = useRef<BroadcastChannel | null>(null);
  const generation = useRef(0);
  const initializing = useRef(true);
  const lastInteraction = useRef(0);
  const router = useRouter();

  const accept = useCallback(
    (next: SessionView | null, rotateCSRF = false, target?: string) => {
      generation.current += 1;
      initializing.current = false;
      clearPrivateRequests();
      if (rotateCSRF) clearCSRF();
      sessionRef.current = next;
      setSession(next);
      setChecking(false);
      setConnectionError(false);
      setDestination(
        target ||
          (!next
            ? "/login"
            : next.mode === "parent"
              ? "/parent/dashboard"
              : next.mode === "kid"
                ? "/kid"
                : "/profiles"),
      );
      // Only a nonce leaves this tab. Account, profile and learning data stay in memory.
      channel.current?.postMessage("changed");
      try {
        localStorage.setItem(storageKey, `${Date.now()}:${Math.random()}`);
      } catch {}
    },
    [],
  );

  const synchronize = useCallback(
    async (lockParent = false, blocking = true, external = false) => {
      const ticket = ++generation.current;
      const mustLockParent = lockParent || initializing.current;
      if (blocking) {
        pausePrivateUI();
        clearPrivateRequests();
        setChecking(true);
      }
      try {
        let next = await api<SessionView>("/api/auth/session");
        // A superseded check must never mutate the session after its caller left.
        if (ticket !== generation.current) return;
        const lockedParent = mustLockParent && next.mode === "parent";
        if (lockedParent)
          next = await api<SessionView>("/api/session/picker", {
            method: "POST",
          });
        if (ticket !== generation.current) return;
        initializing.current = false;
        if (fingerprint(sessionRef.current) !== fingerprint(next)) {
          clearPrivateRequests();
          setDestination(
            lockedParent ||
              (!external &&
                sessionRef.current?.mode === "parent" &&
                next.mode === "picker")
              ? "/parent/unlock"
              : next.mode === "parent"
                ? "/parent/dashboard"
                : next.mode === "kid"
                  ? "/kid"
                  : "/profiles",
          );
        }
        sessionRef.current = next;
        setSession(next);
        setChecking(false);
        setConnectionError(false);
        if (lockedParent) {
          channel.current?.postMessage("changed");
          try {
            localStorage.setItem(storageKey, `${Date.now()}:${Math.random()}`);
          } catch {}
        }
      } catch (error) {
        if (ticket !== generation.current) return;
        if (error instanceof APIError && error.status === 401) {
          initializing.current = false;
          clearPrivateRequests();
          clearCSRF();
          sessionRef.current = null;
          setSession(null);
          setChecking(false);
          setConnectionError(false);
        } else if (!(error instanceof Error && error.name === "AbortError")) {
          clearPrivateRequests();
          setSession(null);
          setChecking(false);
          setConnectionError(true);
        }
      }
    },
    [],
  );

  useEffect(() => {
    if (typeof BroadcastChannel !== "undefined") {
      channel.current = new BroadcastChannel("sidekick-session");
      channel.current.onmessage = () => {
        clearCSRF();
        void synchronize(false, true, true);
      };
    }
    const storage = (event: StorageEvent) => {
      if (event.key === storageKey) {
        clearCSRF();
        void synchronize(false, true, true);
      }
    };
    const focus = () => {
      // A native camera/file picker also restores focus. Keep that child's
      // preview unless the server reports an actual session/profile change.
      if (document.visibilityState === "visible")
        void synchronize(false, false);
    };
    const back = () => {
      void synchronize(true);
    };
    const show = (event: PageTransitionEvent) => {
      if (event.persisted) void synchronize(true);
    };
    const hide = () => {
      generation.current += 1;
      pausePrivateUI();
      clearPrivateRequests();
    };
    const authorizationChanged = () => {
      void synchronize(false);
    };
    window.addEventListener("storage", storage);
    window.addEventListener("focus", focus);
    document.addEventListener("visibilitychange", focus);
    window.addEventListener("popstate", back);
    window.addEventListener("pageshow", show);
    window.addEventListener("pagehide", hide);
    window.addEventListener("sidekick-auth-recheck", authorizationChanged);
    // A fresh document never restores a parent unlock from browser history or a reload.
    void synchronize(true);
    const poll = setInterval(() => {
      if (document.visibilityState === "visible")
        void synchronize(false, false);
    }, 15000);
    return () => {
      generation.current += 1;
      clearPrivateRequests();
      clearInterval(poll);
      channel.current?.close();
      window.removeEventListener("storage", storage);
      window.removeEventListener("focus", focus);
      document.removeEventListener("visibilitychange", focus);
      window.removeEventListener("popstate", back);
      window.removeEventListener("pageshow", show);
      window.removeEventListener("pagehide", hide);
      window.removeEventListener("sidekick-auth-recheck", authorizationChanged);
    };
  }, [synchronize]);

  useEffect(() => {
    // Remove the history-cache mask only after the checked session has rendered.
    if (!checking)
      document.documentElement.removeAttribute("data-session-paused");
  }, [checking, session, connectionError]);

  useEffect(() => {
    if (session?.mode !== "parent" || !session.parentExpiresAt) return;
    const remaining = Math.max(
      1000,
      session.parentExpiresAt * 1000 - Date.now(),
    );
    const timeout = setTimeout(() => {
      void synchronize(false);
    }, remaining);
    return () => clearTimeout(timeout);
  }, [session?.mode, session?.parentExpiresAt, synchronize]);

  const toPicker = useCallback(async () => {
    setChecking(true);
    clearPrivateRequests();
    try {
      accept(await api<SessionView>("/api/session/picker", { method: "POST" }));
      router.replace("/profiles");
    } catch (error) {
      setChecking(false);
      throw error;
    }
  }, [accept, router]);
  const chooseKid = useCallback(
    async (id: string) => {
      setChecking(true);
      clearPrivateRequests();
      try {
        accept(
          await api<SessionView>("/api/session/kid", {
            method: "POST",
            body: { profileId: id },
          }),
        );
        router.replace("/kid");
      } catch (error) {
        setChecking(false);
        throw error;
      }
    },
    [accept, router],
  );
  const logout = useCallback(async () => {
    await api("/api/auth/logout", { method: "POST" });
    accept(null, true);
    router.replace("/login");
  }, [accept, router]);

  const activity = useCallback(() => {
    if (
      sessionRef.current?.mode !== "parent" ||
      Date.now() - lastInteraction.current < 30000
    )
      return;
    lastInteraction.current = Date.now();
    void api<SessionView>("/api/parent/activity", { method: "POST" })
      .then((next) => {
        if (fingerprint(next) === fingerprint(sessionRef.current)) {
          sessionRef.current = next;
          setSession(next);
        }
      })
      .catch((error) => {
        if (error instanceof APIError && [401, 403].includes(error.status))
          void synchronize(false);
      });
  }, [synchronize]);

  return (
    <SessionContext.Provider
      value={{
        session,
        checking,
        connectionError,
        destination,
        accept,
        refresh: synchronize,
        toPicker,
        chooseKid,
        logout,
        activity,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useAccountSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("AccountSessionProvider is required");
  return context;
}

export function SessionLoading() {
  return (
    <div className="account-loading" role="status">
      A little moment…
    </div>
  );
}

export function RequireMode({
  mode,
  children,
}: {
  mode?: SessionView["mode"];
  children: React.ReactNode;
}) {
  const { session, checking, connectionError, destination, refresh } =
    useAccountSession();
  const router = useRouter();
  useEffect(() => {
    if (checking || connectionError) return;
    if (!session) router.replace("/login");
    else if (mode && session.mode !== mode)
      router.replace(
        destination ||
          (session.mode === "parent"
            ? "/parent/dashboard"
            : session.mode === "kid"
              ? "/kid"
              : "/profiles"),
      );
  }, [checking, connectionError, session, mode, router, destination]);
  if (connectionError)
    return (
      <div className="account-loading">
        <p>Sidekick couldn’t connect.</p>
        <button className="button primary" onClick={() => void refresh(false)}>
          Try again
        </button>
      </div>
    );
  if (checking || !session || (mode && session.mode !== mode))
    return <SessionLoading />;
  return <>{children}</>;
}
