"use client";
import { useState } from "react";
import type { LearningSkill } from "@/lib/learning-types";

export const learningLabels = {
  unassessed: "Not enough evidence",
  on_track: "On track",
  needs_support: "Needs support",
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
export function GapInsights({ skills }: { skills: LearningSkill[] }) {
  const [filter, setFilter] = useState("");
  const [all, setAll] = useState(false);
  const filtered = skills.filter((skill) =>
    `${skill.name} ${skill.commonCoreCode}`
      .toLowerCase()
      .includes(filter.toLowerCase()),
  );
  return (
    <section className="dashboard-section">
      <div className="section-heading">
        <div>
          <h2>Where a little support can help.</h2>
          <p>
            Uploaded work shows where support may help. Gray means there isn’t
            enough reliable evidence yet.
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
                  {(skill.status !== "unassessed" ||
                    Boolean(skill.evidence?.length)) && (
                    <details className="gap-details">
                      <summary>See work observations</summary>
                      <p>
                        {skill.parentExplanation ||
                          (skill.status === "needs_support"
                            ? "Uploaded work suggests this skill could use support."
                            : "These observations come from the child’s uploaded work.")}
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
                            Uploaded evidence ({skill.evidence.length})
                          </summary>
                          {skill.evidence.map((event, i) => (
                            <p key={i}>{detail(event)}</p>
                          ))}
                        </details>
                      )}
                      {skill.homeTip && (
                        <p>
                          <strong>Try at home:</strong> {skill.homeTip}
                        </p>
                      )}
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
