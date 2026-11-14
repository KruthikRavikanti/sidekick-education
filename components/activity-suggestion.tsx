"use client";

import { ArrowRight, LoaderCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api, errorMessage } from "@/lib/account-api";
import type {
  ActivitySession,
  ActivitySuggestionData,
} from "@/lib/activity-types";
import { useAccountSession } from "./account-session";
import { FormError } from "./account-ui";

function SuggestionContent({ uploadId }: { uploadId: string }) {
  const [suggestion, setSuggestion] = useState<ActivitySuggestionData | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [reload, setReload] = useState(0);
  const [pollingPaused, setPollingPaused] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const startKey = useRef<string | null>(null);
  const starting = useRef(false);
  const router = useRouter();

  useEffect(() => {
    const request = new AbortController();
    controller.current = request;
    setPollingPaused(false);
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let polls = 0;
    async function fetchSuggestion() {
      try {
        const result = await api<ActivitySuggestionData>(
          `/api/activities/kid/suggestion?uploadId=${encodeURIComponent(uploadId)}`,
          { signal: request.signal },
        );
        if (request.signal.aborted) return;
        setSuggestion(result);
        setError(null);
        if (result.reason === "analysis_pending") {
          if (polls++ < 60)
            timeout = setTimeout(() => void fetchSuggestion(), 3000);
          else setPollingPaused(true);
        }
      } catch (caught) {
        if (!request.signal.aborted) setError(errorMessage(caught));
      }
    }
    void fetchSuggestion();
    return () => {
      request.abort();
      clearTimeout(timeout);
      controller.current = null;
    };
  }, [uploadId, reload]);

  async function start() {
    const signal = controller.current?.signal;
    if (!signal || signal.aborted || starting.current) return;
    if (suggestion?.sessionId) {
      router.push(
        `/kid/activities/${encodeURIComponent(suggestion.sessionId)}`,
      );
      return;
    }
    starting.current = true;
    setBusy(true);
    setError(null);
    startKey.current ??= crypto.randomUUID();
    try {
      const activity = await api<ActivitySession>("/api/activities/kid/start", {
        method: "POST",
        body: { uploadId, idempotencyKey: startKey.current },
        signal,
      });
      if (!signal.aborted)
        router.push(`/kid/activities/${encodeURIComponent(activity.id)}`);
    } catch (caught) {
      if (!signal.aborted) setError(errorMessage(caught));
    } finally {
      starting.current = false;
      if (!signal.aborted) setBusy(false);
    }
  }

  const unsupported =
    !suggestion?.available && suggestion?.reason === "no_supported_skill";
  const pending = !suggestion || suggestion.reason === "analysis_pending";
  return (
    <section
      className="activity-suggestion"
      aria-label="Suggested learning activity"
      aria-busy={busy}
    >
      <span className="activity-suggestion-icon" aria-hidden="true">
        <Sparkles size={25} />
      </span>
      <div className="activity-suggestion-copy">
        <p className="account-eyebrow">YOUR NEXT LITTLE STEP</p>
        <h2>
          {suggestion?.available
            ? "Keep learning with an activity."
            : pending
              ? "Finding your next little step…"
              : unsupported
                ? "Let’s get a clearer look."
                : "A little moment for your next step."}
        </h2>
        <p>
          {suggestion?.available
            ? "Use what you’ve learned in a short activity. Sidekick can create one for the skills in your work."
            : pending
              ? "Sidekick is looking at the skills in your work."
              : unsupported
                ? "We couldn’t identify a clear Math or ELA skill in this page. Try a clearer photo with the whole page in view."
                : "We couldn’t find an activity just yet. You can try again."}
        </p>
        {suggestion?.available && suggestion.targetSkill ? (
          <p className="activity-suggestion-skill">{suggestion.targetSkill.name}</p>
        ) : null}
        <FormError message={error} />
        {suggestion?.available ? (
          <button
            className="button primary"
            disabled={busy}
            onClick={() => void start()}
          >
            {busy ? (
              <>
                <LoaderCircle
                  className="spinner"
                  size={18}
                  aria-hidden="true"
                />
                Getting it ready…
              </>
            ) : (
              <>
                {suggestion.sessionId ? "Continue activity" : "Try an activity"}
                <ArrowRight size={18} aria-hidden="true" />
              </>
            )}
          </button>
        ) : error || (!pending && !unsupported) || pollingPaused ? (
          <button
            className="text-button"
            onClick={() => setReload((value) => value + 1)}
          >
            Try again
          </button>
        ) : null}
      </div>
    </section>
  );
}

export function ActivitySuggestion({ uploadId }: { uploadId: string }) {
  const { session } = useAccountSession();
  if (session?.mode !== "kid") return null;
  return (
    <SuggestionContent
      key={`${session.activeKidProfileId}:${uploadId}`}
      uploadId={uploadId}
    />
  );
}
