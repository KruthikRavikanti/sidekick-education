"use client";

import { BookOpen, Check, Clock3, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { api, errorMessage } from "@/lib/account-api";
import type { ActivityHistoryItem } from "@/lib/activity-types";
import { FormError } from "./account-ui";

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
                    ? "Completed"
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
                  <span
                    className={`status ${activity.finalResult.correct ? "status-answered" : "status-unclear"}`}
                  >
                    {activity.finalResult.correct ? "Correct" : "Incorrect"}
                  </span>
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
