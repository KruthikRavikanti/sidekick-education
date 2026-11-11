"use client";
import { useState } from "react";
import { api, errorMessage } from "@/lib/account-api";
import type { LearningSkill } from "@/lib/learning-types";
import { FormError } from "./account-ui";

export const learningLabels = {
  unassessed: "Unassessed",
  on_track: "On track",
  checking: "Checking",
  gap: "Gap",
  practicing: "Practicing",
  mastered: "Mastered",
};
function detail(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const row = value as Record<string, unknown>;
    if (row.question)
      return `${row.question} — ${row.correctness || "ungraded"}${row.eligible === false ? " (not used for assessment)" : ""}`;
    const label = String(
      row.name ||
        row.subskill ||
        row.explanation ||
        row.reason ||
        row.subskillId ||
        row.subskill_id ||
        "Learning observation",
    );
    return row.outcome ? `${label}: ${row.outcome}` : label;
  }
  return String(value ?? "");
}
export function GapInsights({
  skills,
  kidId,
}: {
  skills: LearningSkill[];
  kidId: string;
}) {
  const [filter, setFilter] = useState("");
  const [all, setAll] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const filtered = skills.filter((skill) =>
    `${skill.name} ${skill.commonCoreCode}`
      .toLowerCase()
      .includes(filter.toLowerCase()),
  );
  async function send(skill: LearningSkill) {
    setBusy(skill.id);
    setError(null);
    setMessage(null);
    try {
      const result = await api<{ state: string }>(
        `/api/learning/parent/${kidId}/extra-practice`,
        { method: "POST", body: { subskillId: skill.subskillId || skill.id } },
      );
      setMessage(
        result.state === "awaiting_items"
          ? "This practice is waiting for suitable, verified questions. You can retry preparing it later."
          : "Practice is ready, or already waiting, in your child’s practice area.",
      );
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(null);
    }
  }
  return (
    <section className="dashboard-section">
      <div className="section-heading">
        <div>
          <h2>Where a little support can help.</h2>
          <p>
            Based on eligible homework and practice. Gray means there’s no
            assessment yet.
          </p>
        </div>
      </div>
      <div className="skill-legend" aria-label="Skill status legend">
        {Object.entries(learningLabels).map(([status, label]) => (
          <span className={`skill-status skill-${status}`} key={status}>
            {label}
          </span>
        ))}
      </div>
      <label className="learning-filter">
        Find a skill
        <input
          type="search"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder="Skill name or Common Core code"
        />
      </label>
      <FormError message={error} />
      {message && (
        <p className="account-success" role="status">
          {message}
        </p>
      )}
      {(["math", "ela"] as const).map((subject) => {
        const subset = filtered.filter((skill) => skill.subject === subject);
        return (
          <section className="subject-skills" key={subject}>
            <h3>{subject === "math" ? "Math" : "ELA"}</h3>
            <div className="skill-grid">
              {(all || filter ? subset : subset.slice(0, 12)).map((skill) => (
                <article
                  key={skill.id}
                  className={`skill-card skill-card-${skill.status}`}
                >
                  <span className={`skill-status skill-${skill.status}`}>
                    {learningLabels[skill.status]}
                  </span>
                  <h4>{skill.name}</h4>
                  <code>{skill.commonCoreCode}</code>
                  {["checking", "gap", "practicing"].includes(skill.status) && (
                    <details className="gap-details">
                      <summary>See the learning story</summary>
                      <p>
                        {skill.parentExplanation ||
                          "A little focused practice can help build this skill."}
                      </p>
                      {skill.observedPattern && (
                        <p>
                          <strong>Observed pattern:</strong>{" "}
                          {skill.observedPattern}
                        </p>
                      )}
                      {skill.evidence && skill.evidence.length > 0 && (
                        <details>
                          <summary>
                            Homework evidence ({skill.evidence.length})
                          </summary>
                          {skill.evidence.map((event, i) => (
                            <p key={i}>{detail(event)}</p>
                          ))}
                        </details>
                      )}
                      {skill.traceback && skill.traceback.length > 0 && (
                        <div>
                          <strong>Steps checked</strong>
                          <ol>
                            {skill.traceback.map((step, i) => (
                              <li key={i}>{detail(step)}</li>
                            ))}
                          </ol>
                        </div>
                      )}
                      {Boolean(skill.currentPracticeTarget) && (
                        <p>
                          <strong>Practicing now:</strong>{" "}
                          {skills.find(
                            (target) =>
                              target.id === skill.currentPracticeTarget,
                          )?.name || detail(skill.currentPracticeTarget)}
                        </p>
                      )}
                      {skill.homeTip && (
                        <p>
                          <strong>Try at home:</strong> {skill.homeTip}
                        </p>
                      )}
                      {skill.teacherSuggestion && (
                        <p className="teacher-suggestion">
                          {skill.teacherSuggestion}
                        </p>
                      )}
                      <button
                        className="text-button"
                        disabled={busy !== null}
                        onClick={() => void send(skill)}
                      >
                        {busy === skill.id
                          ? "Preparing…"
                          : "Send extra practice"}
                      </button>
                    </details>
                  )}
                </article>
              ))}
            </div>
            {subset.length === 0 && <p>No matching skills yet.</p>}
          </section>
        );
      })}
      {!all && !filter && (
        <button className="text-button" onClick={() => setAll(true)}>
          Show all skills ({skills.length})
        </button>
      )}
    </section>
  );
}
