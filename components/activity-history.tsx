"use client";

import { BookOpen, Check, Clock3, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { api, errorMessage } from "@/lib/account-api";
import type { ActivityHistoryItem, ActivityResult } from "@/lib/activity-types";
import { FormError } from "./account-ui";
import { DrawingPreview } from "./activity-media-controls";
import { ParentActivityAttempt } from "./parent-activity-attempt";

function ParentReview({ kidId, activity, onReviewed }: { kidId: string; activity: ActivityHistoryItem; onReviewed: (result: ActivityResult) => void }) {
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [note, setNote] = useState("");
  const [observed, setObserved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const keys = useRef(new Map<string, string>());
  const result = activity.finalResult!;
  async function submit() {
    if (correct === null || (result.parentParticipation && !observed) || busy) return;
    setBusy(true);
    setError(null);
    const operation = JSON.stringify({ correct, note, parentObserved: observed });
    let idempotencyKey = keys.current.get(operation);
    if (!idempotencyKey) { idempotencyKey = crypto.randomUUID(); keys.current.set(operation, idempotencyKey); }
    try {
      const response = await api<{ finalResult: ActivityResult }>(`/api/activities/parent/${encodeURIComponent(kidId)}/sessions/${encodeURIComponent(activity.id)}/review`, {
        method: "POST", body: { correct, note, parentObserved: observed, idempotencyKey },
      });
      onReviewed(response.finalResult);
    } catch (caught) { setError(errorMessage(caught)); }
    finally { setBusy(false); }
  }
  return <form className="parent-activity-review" onSubmit={event => { event.preventDefault(); void submit(); }}>
    <h4>Review the learning goal</h4>
    <p>Use the saved response and these criteria. This result has not been marked correct or incorrect yet.</p>
    {result.rubric?.length ? <ul>{result.rubric.map((criterion, index) => <li key={index}>{criterion}</li>)}</ul> : null}
    <fieldset disabled={busy}>
      <legend>What did the child demonstrate?</legend>
      <label><input type="radio" name={`review-${activity.id}`} checked={correct === true} onChange={() => setCorrect(true)} />Demonstrated the goal</label>
      <label><input type="radio" name={`review-${activity.id}`} checked={correct === false} onChange={() => setCorrect(false)} />Needs another try</label>
    </fieldset>
    {result.parentParticipation ? <label className="parent-review-observed"><input type="checkbox" checked={observed} disabled={busy} onChange={event => setObserved(event.target.checked)} required />I observed the child take part in this activity.</label> : null}
    <label htmlFor={`review-note-${activity.id}`}>Review note (optional)</label>
    <textarea id={`review-note-${activity.id}`} value={note} maxLength={500} rows={3} disabled={busy} onChange={event => setNote(event.target.value)} />
    <FormError message={error} />
    <button className="button primary" type="submit" disabled={busy || correct === null || Boolean(result.parentParticipation && !observed)}>{busy ? "Saving review…" : "Save parent review"}</button>
  </form>;
}

function activityDate(value: number) {
  const date = new Date(value * 1000);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

function HistoryContent({ kidId }: { kidId: string }) {
  const [activities, setActivities] = useState<ActivityHistoryItem[] | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  useEffect(() => {
    const request = new AbortController();
    void api<{ activities: ActivityHistoryItem[] }>(
      `/api/activities/parent/${encodeURIComponent(kidId)}/history`,
      { signal: request.signal },
    )
      .then((result) => {
        if (!request.signal.aborted) {
          setActivities(result.activities);
          setError(null);
        }
      })
      .catch((caught) => {
        if (!request.signal.aborted) setError(errorMessage(caught));
      });
    return () => request.abort();
  }, [kidId, reload]);

  return (
    <section className="dashboard-section activity-history">
      <div className="section-heading">
        <div>
          <h2>Little steps in action.</h2>
          <p>See activities and each fresh question answered independently.</p>
        </div>
      </div>
      <p className="activity-history-note">
        These are records of individual attempts. Skill support observations
        still come from uploaded work.
      </p>
      <FormError message={error} />
      {error ? (
        <button
          className="text-button"
          onClick={() => setReload((value) => value + 1)}
        >
          Try again
        </button>
      ) : !activities ? (
        <p role="status">Loading activities…</p>
      ) : activities.length === 0 ? (
        <div className="activity-history-empty">
          <Sparkles size={28} aria-hidden="true" />
          <h3>Room for a new learning adventure.</h3>
          <p>
            Suggested activities will appear after uploaded work points to a
            skill we can support.
          </p>
        </div>
      ) : (
        <div className="activity-history-list">
          {activities.map((activity) => (
            <article className="activity-history-card" key={activity.id}>
              <div className="activity-history-top">
                <span className="subject-tag">
                  {activity.subject === "math" ? "Math" : "ELA"}
                </span>
                <span
                  className={`status ${activity.status === "completed" ? "status-answered" : "status-blank"}`}
                >
                  {activity.status === "completed" ? (
                    <Check size={13} aria-hidden="true" />
                  ) : (
                    <Clock3 size={13} aria-hidden="true" />
                  )}
                  {activity.status === "completed"
                    ? activity.finalResult?.correct === null ? "Awaiting parent review" : "Completed"
                    : "In progress"}
                </span>
              </div>
              <h3>{activity.title}</h3>
              <span className="activity-origin">
                {activity.origin === "original_example"
                  ? "Original Sidekick example"
                  : "Generated activity"}
              </span>
              <p className="activity-history-skill">
                <BookOpen size={15} aria-hidden="true" />
                {activity.targetSkill.name}
              </p>
              <p className="activity-history-date">
                {activity.completedAt
                  ? `Completed ${activityDate(activity.completedAt)}`
                  : `Started ${activityDate(activity.startedAt)}`}
              </p>
              {activity.finalResult ? (
                <div className="activity-history-result">
                  <p className="account-eyebrow">INDEPENDENT QUESTION</p>
                  <p>{activity.finalResult.question}</p>
                  <p>
                    <strong>Child’s answer:</strong>{" "}
                    <span className="transcription">
                      {activity.finalResult.response}
                    </span>
                  </p>
                  {activity.finalResult.recordingId ? <audio controls preload="none" className="family-audio" aria-label="Child’s recorded response" src={`/api/activities/parent/${encodeURIComponent(kidId)}/recordings/${encodeURIComponent(activity.finalResult.recordingId)}`} /> : null}
                  {activity.finalResult.strokes?.length ? <DrawingPreview strokes={activity.finalResult.strokes} label="Child’s submitted drawing" /> : null}
                  <span
                    className={`status ${activity.finalResult.correct ? "status-answered" : "status-unclear"}`}
                  >
                    {activity.finalResult.correct === null ? "Parent review needed" : activity.finalResult.correct ? "Correct" : "Incorrect"}
                  </span>
                  {activity.finalResult.assessmentStatus === "parent_reviewed" ? <p className="activity-review-attribution">Reviewed by parent{activity.finalResult.reviewNote ? ` · ${activity.finalResult.reviewNote}` : ""}</p> : null}
                  {activity.finalResult.correct === null ? <ParentReview kidId={kidId} activity={activity} onReviewed={result => setActivities(current => current?.map(item => item.id === activity.id ? { ...item, finalResult: result } : item) ?? null)} /> : null}
                </div>
              ) : (
                <p className="activity-history-pending">
                  Independent question not answered yet.
                </p>
              )}
              {typeof activity.guidedHintCount === "number" ? (
                <p className="activity-history-hints">
                  Guided hints used: {activity.guidedHintCount}
                </p>
              ) : null}
              <ParentActivityAttempt kidId={kidId} sessionId={activity.id} />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export function ParentActivityHistory({ kidId }: { kidId: string }) {
  return <HistoryContent key={kidId} kidId={kidId} />;
}
