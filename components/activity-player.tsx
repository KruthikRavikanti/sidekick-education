"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  Lightbulb,
  LoaderCircle,
  Sparkles,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { api, errorMessage } from "@/lib/account-api";
import type {
  ActivityResponse,
  ActivityScene,
  ActivitySession,
} from "@/lib/activity-types";
import { RequireMode, useAccountSession } from "./account-session";
import { AccountShell, FormError } from "./account-ui";
import { ActivitySceneControl } from "./activity-scenes";

type ActivityAction = "submit" | "hint" | "next";

function SceneStep({
  scene,
  activity,
  busy,
  onAction,
}: {
  scene: ActivityScene;
  activity: ActivitySession;
  busy: boolean;
  onAction: (
    action: ActivityAction,
    response?: ActivityResponse,
  ) => Promise<boolean>;
}) {
  const [response, setResponse] = useState<ActivityResponse | null>(
    activity.currentResponse,
  );
  const [ready, setReady] = useState(activity.currentResponse !== null);
  const [editing, setEditing] = useState(false);
  const submitted = activity.feedback !== null;
  const independent = scene.phase === "independent";
  const showNext = submitted && !editing;
  async function submitResponse() {
    if (response !== null && (await onAction("submit", response)))
      setEditing(false);
  }
  return (
    <form
      className={`activity-scene ${independent ? "activity-scene-independent" : ""}`}
      onSubmit={(event) => {
        event.preventDefault();
        if (showNext && activity.canAdvance) void onAction("next");
        else if (ready && response !== null) void submitResponse();
      }}
    >
      <div className="activity-phase-label">
        {independent ? (
          <span>Try this on your own</span>
        ) : (
          <span>Let’s explore</span>
        )}
        <span>
          {activity.sceneIndex + 1} of {activity.sceneCount}
        </span>
      </div>
      <h2 id="activity-scene-prompt">{scene.prompt}</h2>
      {independent ? (
        <p className="activity-independent-note">
          One fresh question. Give it your best try.
        </p>
      ) : null}
      <ActivitySceneControl
        scene={scene}
        disabled={busy || (submitted && !editing)}
        initialResponse={activity.currentResponse}
        showHint={!independent && Boolean(activity.hint)}
        onResponse={(next, complete) => {
          setResponse(next);
          setReady(complete);
        }}
      />
      {activity.feedback ? (
        <div
          className={`activity-feedback ${activity.feedback.correct ? "activity-feedback-correct" : ""}`}
          role="status"
        >
          <span className="activity-feedback-icon" aria-hidden="true">
            {activity.feedback.correct ? (
              <Check size={20} />
            ) : (
              <Lightbulb size={20} />
            )}
          </span>
          <p>{activity.feedback.message}</p>
        </div>
      ) : null}
      {!independent && activity.hint ? (
        <aside
          className="activity-hint"
          aria-label="Visual hint"
          aria-live="polite"
        >
          <Lightbulb size={20} aria-hidden="true" />
          <div>
            <p>{activity.hint}</p>
            {scene.component === "fraction_builder" ||
            scene.component === "number_line" ? (
              <>
                <div className="activity-hint-pieces" aria-hidden="true">
                  {Array.from(
                    { length: scene.params.denominator },
                    (_, index) => (
                      <span key={index} />
                    ),
                  )}
                </div>
                <p>
                  Each equal piece is 1/{scene.params.denominator} of one whole.
                </p>
              </>
            ) : null}
          </div>
        </aside>
      ) : null}
      <div className="activity-scene-actions">
        {editing ? (
          <p className="activity-retry-note" role="status">
            Adjust your answer, then check it.
          </p>
        ) : null}
        <button
          className="button primary"
          type="submit"
          disabled={busy || (showNext ? !activity.canAdvance : !ready)}
        >
          {busy ? (
            <>
              <LoaderCircle className="spinner" size={18} aria-hidden="true" />
              Saving…
            </>
          ) : showNext ? (
            <>
              Next <ArrowRight size={18} aria-hidden="true" />
            </>
          ) : independent ? (
            "Save my answer"
          ) : (
            "Check it"
          )}
        </button>
        {!independent && submitted && !editing ? (
          <button
            className="text-button"
            type="button"
            disabled={busy}
            onClick={() => {
              setResponse(activity.currentResponse);
              setReady(activity.currentResponse !== null);
              setEditing(true);
            }}
          >
            Try again
          </button>
        ) : null}
        {!independent && editing && activity.canAdvance ? (
          <button
            className="text-button"
            type="button"
            disabled={busy}
            onClick={() => void onAction("next")}
          >
            Next <ArrowRight size={16} aria-hidden="true" />
          </button>
        ) : null}
        {!independent && submitted && !activity.hint ? (
          <button
            className="text-button"
            type="button"
            disabled={busy}
            onClick={() => void onAction("hint")}
          >
            <Lightbulb size={16} aria-hidden="true" /> Show a hint
          </button>
        ) : null}
      </div>
    </form>
  );
}

function ActivityContent({ sessionId }: { sessionId: string }) {
  const [activity, setActivity] = useState<ActivitySession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const controller = useRef<AbortController | null>(null);
  const inFlight = useRef(false);
  const actionKeys = useRef(new Map<string, string>());
  const heading = useRef<HTMLDivElement>(null);
  const load = useCallback(
    async (signal: AbortSignal) => {
      setLoading(true);
      setError(null);
      try {
        const result = await api<ActivitySession>(
          `/api/activities/kid/sessions/${encodeURIComponent(sessionId)}`,
          { signal },
        );
        if (!signal.aborted) setActivity(result);
      } catch (caught) {
        if (!signal.aborted) setError(errorMessage(caught));
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    },
    [sessionId],
  );

  useEffect(() => {
    const request = new AbortController();
    controller.current = request;
    void load(request.signal);
    return () => {
      request.abort();
      controller.current = null;
    };
  }, [load]);

  useEffect(() => {
    heading.current?.focus();
  }, [activity?.currentScene?.id, activity?.status]);

  async function perform(action: ActivityAction, response?: ActivityResponse) {
    const signal = controller.current?.signal;
    const scene = activity?.currentScene;
    if (!signal || signal.aborted || !scene || inFlight.current) return false;
    inFlight.current = true;
    setBusy(true);
    setError(null);
    const operation = `${action}:${scene.id}:${JSON.stringify(response ?? null)}`;
    let idempotencyKey = actionKeys.current.get(operation);
    if (!idempotencyKey) {
      idempotencyKey = crypto.randomUUID();
      actionKeys.current.set(operation, idempotencyKey);
    }
    try {
      const result = await api<ActivitySession>(
        `/api/activities/kid/sessions/${encodeURIComponent(sessionId)}/${action}`,
        {
          method: "POST",
          body: {
            sceneId: scene.id,
            ...(action !== "hint" ? { idempotencyKey } : {}),
            ...(action === "submit" ? { response } : {}),
          },
          signal,
        },
      );
      if (!signal.aborted) {
        setActivity(result);
        // A deliberate guided retry gets a new key, while network retries keep
        // the failed operation's key until its saved response is confirmed.
        actionKeys.current.delete(operation);
        return true;
      }
      return false;
    } catch (caught) {
      if (!signal.aborted) setError(errorMessage(caught));
      return false;
    } finally {
      inFlight.current = false;
      if (!signal.aborted) setBusy(false);
    }
  }

  return (
    <AccountShell kind="kid" backHref="/kid">
      <section className="activity-player" aria-busy={loading}>
        {loading ? (
          <div className="activity-waiting" role="status">
            <LoaderCircle className="spinner" size={26} aria-hidden="true" />
            <p>Getting your activity ready…</p>
          </div>
        ) : activity ? (
          <>
            <div className="activity-title" tabIndex={-1} ref={heading}>
              <p className="account-eyebrow">
                {activity.subject === "math" ? "MATH" : "WORD LAB"} · A LITTLE
                LEARNING ADVENTURE
              </p>
              <h1>{activity.title}</h1>
              <span className="activity-origin">
                {activity.origin === "original_example"
                  ? "Original Sidekick example"
                  : "Generated activity"}
              </span>
              <p>
                {activity.subject === "math"
                  ? "Build fractions from equal parts."
                  : "Explore how words change to mean more than one."}
              </p>
            </div>
            <div
              className="activity-progress"
              role="progressbar"
              aria-label="Activity progress"
              aria-valuemin={0}
              aria-valuemax={activity.sceneCount}
              aria-valuenow={
                activity.status === "completed"
                  ? activity.sceneCount
                  : activity.sceneIndex
              }
            >
              <span
                style={{
                  width: `${(100 * (activity.status === "completed" ? activity.sceneCount : activity.sceneIndex)) / activity.sceneCount}%`,
                }}
              />
            </div>
            {activity.status === "completed" ? (
              <div className="activity-complete">
                <span className="activity-complete-icon">
                  <Sparkles size={31} aria-hidden="true" />
                </span>
                <p className="account-eyebrow">ACTIVITY COMPLETE</p>
                <h2>
                  {activity.finalResult?.correct
                    ? "You did it!"
                    : "Every try is a step forward."}
                </h2>
                <p>
                  {activity.finalResult?.correct
                    ? "You answered the last question on your own."
                    : "Your answer is saved. Keep exploring — there’s more to learn."}
                </p>
                {activity.finalResult ? (
                  <div className="activity-final-response">
                    <p>{activity.finalResult.question}</p>
                    <p>
                      <strong>Your answer:</strong>{" "}
                      {activity.finalResult.response}
                    </p>
                  </div>
                ) : null}
                <Link className="button primary" href="/kid" prefetch={false}>
                  Back to my home <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
            ) : activity.currentScene ? (
              <SceneStep
                key={`${activity.currentScene.id}:${JSON.stringify(activity.currentResponse)}`}
                scene={activity.currentScene}
                activity={activity}
                busy={busy}
                onAction={perform}
              />
            ) : null}
          </>
        ) : null}
        <FormError message={error} />
        {!loading && error ? (
          <button
            className="text-button activity-refresh"
            disabled={busy}
            onClick={() => {
              if (controller.current) void load(controller.current.signal);
            }}
          >
            Reload saved activity
          </button>
        ) : null}
        {activity?.status !== "completed" && activity ? (
          <p className="activity-save-note">
            Your place is saved. You can come back anytime.
          </p>
        ) : null}
      </section>
    </AccountShell>
  );
}

function ProfileActivity({ sessionId }: { sessionId: string }) {
  const { session } = useAccountSession();
  return (
    <ActivityContent
      key={`${session?.activeKidProfileId}:${sessionId}`}
      sessionId={sessionId}
    />
  );
}

export function ActivityPlayer({ sessionId }: { sessionId: string }) {
  return (
    <RequireMode mode="kid">
      <ProfileActivity sessionId={sessionId} />
    </RequireMode>
  );
}
