"use client";

import { useEffect, useRef, useState } from "react";
import { api, errorMessage } from "@/lib/account-api";
import type { ActivityAttemptDetail, ActivityScene } from "@/lib/activity-types";
import { FormError } from "./account-ui";
import { ActivitySceneControl, ActivitySceneMaterial } from "./activity-scenes";

const readOnlyResponse = () => {};

/** Fetch the immutable scene materials and saved actions only in parent mode. */
export function ParentActivityAttempt({ kidId, sessionId }: { kidId: string; sessionId: string }) {
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<ActivityAttemptDetail | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);

  async function load() {
    if (request.current) return;
    const controller = new AbortController();
    request.current = controller;
    setBusy(true);
    setError(null);
    try {
      const result = await api<ActivityAttemptDetail>(`/api/activities/parent/${encodeURIComponent(kidId)}/sessions/${encodeURIComponent(sessionId)}`, { signal: controller.signal });
      if (!controller.signal.aborted) setDetail(result);
    } catch (caught) {
      if (!controller.signal.aborted) setError(errorMessage(caught));
    } finally {
      if (!controller.signal.aborted) setBusy(false);
      request.current = null;
    }
  }

  return <div className="parent-attempt">
    <button type="button" className="text-button" aria-expanded={open} aria-controls={`attempt-${sessionId}`} onClick={() => {
      setOpen(value => !value);
      if (!open && !detail) void load();
    }}>{open ? "Hide activity" : "View activity"}</button>
    {open ? <section id={`attempt-${sessionId}`} className="parent-attempt-steps" aria-label="Saved activity steps">
      <p className="family-note">The original activity and the child’s saved actions, step by step.</p>
      {busy ? <p role="status">Loading saved activity…</p> : null}
      <FormError message={error} />
      {error ? <button type="button" className="text-button" onClick={() => void load()}>Try loading again</button> : null}
      {detail?.scenes.map((scene, index) => {
        const last = scene.responses.at(-1);
        return <article className="parent-attempt-step" key={scene.id}>
          <p className="account-eyebrow">STEP {index + 1} · {scene.phase === "guided" ? "GUIDED" : "INDEPENDENT"}</p>
          <h4>{scene.prompt}</h4>
          {scene.connection ? <p className="family-note">This step uses the child’s saved work from an earlier step.</p> : null}
          <ActivitySceneMaterial scene={scene} />
          <SavedControl scene={scene} sessionId={sessionId} kidId={kidId} response={last?.response ?? null} />
          {scene.responses.length ? <ol className="parent-saved-responses" aria-label={`Saved responses for step ${index + 1}`}>
            {scene.responses.map((attempt, attemptIndex) => <li key={`${attempt.createdAt}-${attemptIndex}`}>
              <p><strong>{scene.responses.length > 1 ? `Try ${attemptIndex + 1}: ` : "Child’s response: "}</strong><span className="transcription">{attempt.responseText}</span></p>
              <p className="family-note">{attempt.correct === null ? "Saved for parent review" : attempt.correct ? "Correct" : "Needs another try"}{attempt.hintUsed ? " · Guided hint used" : ""}</p>
              {attemptIndex < scene.responses.length - 1 ? <details className="parent-earlier-response"><summary>View saved work for this try</summary><SavedControl scene={scene} sessionId={sessionId} kidId={kidId} response={attempt.response} /></details> : null}
            </li>)}
          </ol> : <p className="family-note">No response saved for this step yet.</p>}
        </article>;
      })}
    </section> : null}
  </div>;
}

function SavedControl({ scene, sessionId, kidId, response }: { scene: ActivityScene; sessionId: string; kidId: string; response: ActivityAttemptDetail["scenes"][number]["responses"][number]["response"] | null }) {
  if (scene.component === "oral_studio") {
    const recordingId = response && typeof response === "object" && "recordingId" in response ? response.recordingId : null;
    return <>
      <p className="activity-toolkit-goal">{scene.params.goal}</p>
      {scene.params.passage ? <p className="oral-passage">{scene.params.passage}</p> : null}
      {scene.params.listenText ? <p className="oral-passage">{scene.params.listenText}</p> : null}
      {recordingId ? <audio controls preload="none" className="family-audio" aria-label="Saved reading for this step" src={`/api/activities/parent/${encodeURIComponent(kidId)}/recordings/${encodeURIComponent(recordingId)}`} /> : null}
    </>;
  }
  return <ActivitySceneControl key={`${scene.id}:${JSON.stringify(response)}`} scene={scene} sessionId={sessionId} disabled initialResponse={response} onResponse={readOnlyResponse} />;
}
