"use client";

import { useMemo, useRef, useState } from "react";
import type { KidProfile } from "@/lib/account-types";
import type { GameHistoryItem } from "@/lib/game-types";
import type { LearningSkill } from "@/lib/learning-types";
import { outcome } from "./game-history";

export const learningLabels = {
  unassessed: "Not enough evidence",
  on_track: "On track",
  needs_support: "Needs support",
};

// How one dot is drawn. A skill that showed up in uploaded work but could not be judged yet
// ("seen") looks different from one that has not shown up at all.
type Tone = "needs_support" | "on_track" | "seen" | "unseen";
const TONES: Tone[] = ["needs_support", "on_track", "seen", "unseen"];
const LEGEND: Record<Tone, string> = {
  needs_support: "Needs support",
  on_track: "On track",
  seen: "Seen, not enough to say yet",
  unseen: "Not seen yet",
};
const SUBJECTS = [
  { key: "math", label: "Math" },
  { key: "ela", label: "Reading and writing" },
] as const;

type Area = {
  key: string;
  name: string;
  subject: string;
  skills: LearningSkill[];
  counts: Record<Tone, number>;
};

function tone(skill: LearningSkill): Tone {
  if (skill.status !== "unassessed") return skill.status;
  return skill.evidence?.length ? "seen" : "unseen";
}

function gradeLabel(grade: string) {
  return grade === "K" ? "Kindergarten" : `Grade ${grade}`;
}

function plural(count: number, one: string, many: string) {
  return `${count} ${count === 1 ? one : many}`;
}

function evidenceLine(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const row = value as Record<string, unknown>;
    if (row.question)
      return `${row.question}: ${row.correctness || "ungraded"}${row.eligible === false ? " (not used for assessment)" : ""}`;
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

function buildAreas(skills: LearningSkill[]): Area[] {
  const byKey = new Map<string, Area>();
  for (const skill of skills) {
    const name =
      skill.area ||
      (skill.subject === "math" ? "More math" : "More reading and writing");
    const key = `${skill.subject}:${name}`;
    let area = byKey.get(key);
    if (!area) {
      area = {
        key,
        name,
        subject: skill.subject,
        skills: [],
        counts: { needs_support: 0, on_track: 0, seen: 0, unseen: 0 },
      };
      byKey.set(key, area);
    }
    area.skills.push(skill);
    area.counts[tone(skill)] += 1;
  }
  const areas = [...byKey.values()];
  for (const area of areas)
    area.skills.sort((a, b) => TONES.indexOf(tone(a)) - TONES.indexOf(tone(b)));
  // Biggest areas first, so the map keeps the same shape from visit to visit.
  return areas.sort(
    (a, b) => b.skills.length - a.skills.length || a.name.localeCompare(b.name),
  );
}

function areaNote(area: Area) {
  const parts = [plural(area.skills.length, "skill", "skills")];
  if (area.counts.needs_support)
    parts.push(
      `${area.counts.needs_support} ${area.counts.needs_support === 1 ? "needs" : "need"} support`,
    );
  if (area.counts.on_track) parts.push(`${area.counts.on_track} on track`);
  if (area.counts.seen) parts.push(`${area.counts.seen} seen`);
  return parts.join(" · ");
}

function SkillCard({
  skill,
  games,
}: {
  skill: LearningSkill;
  games: GameHistoryItem[];
}) {
  const shown = tone(skill);
  const played = games.filter(
    (game) => game.targetSkill?.id === (skill.subskillId || skill.id),
  );
  const open = shown !== "unseen";
  return (
    <article className={`skill-card skill-card-${skill.status}`}>
      <span className={`skill-status skill-${skill.status}`}>
        {shown === "seen" ? LEGEND.seen : learningLabels[skill.status]}
      </span>
      <h4>{skill.name}</h4>
      <code>{skill.commonCoreCode}</code>
      {open && (
        <div className="skill-story">
          {skill.observedPattern && (
            <div className="skill-story-block skill-story-noticed">
              <h5>What we noticed</h5>
              <p>{skill.observedPattern}</p>
            </div>
          )}
          {skill.homeTip && skill.status !== "on_track" && (
            <div className="skill-story-block skill-story-try">
              <h5>Try at home</h5>
              <p>{skill.homeTip}</p>
            </div>
          )}
          {played.length > 0 && (
            <div className="skill-story-block skill-story-played">
              <h5>Played</h5>
              {played.map((game) => (
                <p key={game.id}>
                  {game.title}. {outcome(game)}.
                </p>
              ))}
            </div>
          )}
          {skill.parentExplanation && (
            <p className="skill-about">
              <strong>What this skill is:</strong> {skill.parentExplanation}
            </p>
          )}
          {skill.evidence && skill.evidence.length > 0 && (
            <details className="gap-details">
              <summary>Uploaded evidence ({skill.evidence.length})</summary>
              {skill.evidence.map((event, index) => (
                <p key={index}>{evidenceLine(event)}</p>
              ))}
            </details>
          )}
        </div>
      )}
    </article>
  );
}

export function SkillMap({
  profile,
  skills,
  games,
  onUpload,
}: {
  profile: KidProfile;
  skills: LearningSkill[];
  games: GameHistoryItem[];
  onUpload: () => void;
}) {
  const areas = useMemo(() => buildAreas(skills), [skills]);
  const totals = useMemo(() => {
    const counts = { needs_support: 0, on_track: 0, unassessed: 0 };
    for (const skill of skills) counts[skill.status] += 1;
    return counts;
  }, [skills]);
  // Open on the area that has something to say, if any does.
  const first = useMemo(() => {
    for (const wanted of ["needs_support", "on_track", "seen"] as const)
      for (const subject of SUBJECTS) {
        const found = areas.find(
          (area) => area.subject === subject.key && area.counts[wanted] > 0,
        );
        if (found) return found.key;
      }
    return null;
  }, [areas]);
  const [chosen, setChosen] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const panel = useRef<HTMLElement>(null);
  function pick(key: string) {
    setChosen(key);
    setQuery("");
    // On a phone the list of skills sits under the map, so bring it into view after a tap.
    if (window.matchMedia("(max-width: 860px)").matches)
      requestAnimationFrame(() =>
        panel.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
  }
  const pickedKey =
    chosen && areas.some((area) => area.key === chosen) ? chosen : first;
  const picked = areas.find((area) => area.key === pickedKey) || null;
  const search = query.trim().toLowerCase();
  const matches = search
    ? skills.filter((skill) =>
        `${skill.name} ${skill.commonCoreCode}`.toLowerCase().includes(search),
      )
    : [];
  const name = profile.firstName;

  return (
    <div className="skill-map">
      <section className="portal-hero portal-hero-forest">
        <div>
          <p className="portal-eyebrow">
            {name} · {gradeLabel(profile.grade)} ·{" "}
            {plural(skills.length, "skill", "skills")}
          </p>
          <h1>One dot for every skill.</h1>
          <p>
            A dot lights up when {name}’s own uploaded work shows that skill.
            Tap an area to see what is in it.
          </p>
        </div>
        <dl className="portal-stats" aria-label="Skill picture">
          <div className="portal-stat portal-stat-needs">
            <dt>
              {totals.needs_support === 1 ? "needs support" : "need support"}
            </dt>
            <dd>{totals.needs_support}</dd>
          </div>
          <div className="portal-stat portal-stat-track">
            <dt>on track</dt>
            <dd>{totals.on_track}</dd>
          </div>
          <div className="portal-stat">
            <dt>not enough evidence yet</dt>
            <dd>{totals.unassessed}</dd>
          </div>
        </dl>
      </section>

      <div className="skill-map-body">
        <div className="skill-map-areas">
          <label className="learning-filter">
            Find a skill
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Skill name or Common Core code"
            />
          </label>
          {SUBJECTS.map((subject) => {
            const subset = areas.filter((area) => area.subject === subject.key);
            if (!subset.length) return null;
            return (
              <section key={subject.key} className="skill-map-subject">
                <h2>{subject.label}</h2>
                <div className="skill-area-grid">
                  {subset.map((area) => (
                    <button
                      type="button"
                      key={area.key}
                      className={`skill-area${area.counts.needs_support ? " skill-area-needs" : ""}`}
                      aria-pressed={!search && picked?.key === area.key}
                      onClick={() => pick(area.key)}
                    >
                      <span className="skill-area-name">{area.name}</span>
                      <span className="skill-dots" aria-hidden="true">
                        {area.skills.map((skill) => (
                          <i
                            key={skill.id}
                            className={`skill-dot skill-dot-${tone(skill)}`}
                          />
                        ))}
                      </span>
                      <span className="skill-area-note">{areaNote(area)}</span>
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
          <ul className="skill-legend" aria-label="Skill status legend">
            {TONES.map((item) => (
              <li key={item}>
                <i
                  className={`skill-dot skill-dot-${item}`}
                  aria-hidden="true"
                />
                {LEGEND[item]}
              </li>
            ))}
          </ul>
        </div>

        <aside className="skill-map-panel" aria-live="polite" ref={panel}>
          {search ? (
            <>
              <p className="portal-eyebrow">Search</p>
              <h3>
                {plural(matches.length, "skill", "skills")} matching “
                {query.trim()}”
              </h3>
              {matches.length === 0 && <p>No matching skills yet.</p>}
              <div className="skill-list">
                {matches.slice(0, 30).map((skill) => (
                  <SkillCard key={skill.id} skill={skill} games={games} />
                ))}
              </div>
              {matches.length > 30 && (
                <p>Showing the first 30. Keep typing to narrow it down.</p>
              )}
            </>
          ) : picked ? (
            <>
              <p className="portal-eyebrow">
                {
                  SUBJECTS.find((subject) => subject.key === picked.subject)
                    ?.label
                }{" "}
                · {picked.skills.length - picked.counts.unseen} of{" "}
                {picked.skills.length} seen
              </p>
              <h3>{picked.name}</h3>
              {picked.counts.unseen === picked.skills.length && (
                <p>
                  None of these has shown up in {name}’s uploaded work yet, so
                  there is nothing to say either way. Upload a page that covers
                  this area and the dots will start to fill in.
                </p>
              )}
              <div className="skill-list">
                {picked.skills
                  .filter((skill) => tone(skill) !== "unseen")
                  .map((skill) => (
                    <SkillCard key={skill.id} skill={skill} games={games} />
                  ))}
              </div>
              {picked.counts.unseen > 0 && (
                <details
                  className="skill-rest"
                  key={picked.key}
                  open={picked.counts.unseen === picked.skills.length}
                >
                  <summary>
                    {plural(picked.counts.unseen, "skill", "skills")} not seen
                    yet
                  </summary>
                  <ul>
                    {picked.skills
                      .filter((skill) => tone(skill) === "unseen")
                      .map((skill) => (
                        <li key={skill.id}>
                          {skill.name} <code>{skill.commonCoreCode}</code>
                        </li>
                      ))}
                  </ul>
                </details>
              )}
            </>
          ) : (
            <>
              <p className="portal-eyebrow">Getting started</p>
              <h3>Nothing has shown up yet.</h3>
              <p>
                Upload a worksheet, quiz or any schoolwork. Sidekick reads it,
                finds the skills on the page, and lights up their dots. Tap any
                area to see the skills in it.
              </p>
              <button
                type="button"
                className="button primary"
                onClick={onUpload}
              >
                Upload {name}’s work
              </button>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
