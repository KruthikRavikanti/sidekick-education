"use client";

import Link from "next/link";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { api, APIError, errorMessage } from "@/lib/account-api";
import type { GameReviewDetail, GameReviewList } from "@/lib/game-types";
import { RequireMode } from "./account-session";
import { AccountShell, FormError } from "./account-ui";
import { GameFrame } from "./game-frame";

const STATUS_LABEL = {
  verified: "Waiting for you",
  approved: "Live for kids",
  retired: "Retired",
} as const;
const REVIEW_LABEL: Record<string, string> = {
  conceptIsTheRule: "The skill is the rule of the game",
  playNotQuiz: "It is play, not a quiz",
  contentCorrect: "Numbers and words are correct",
  kidAppropriate: "Language suits a child",
  soloIsFresh: "The last round is fresh and unaided",
  mistakeIsRealistic: "The known mistakes are realistic",
};

const STATUS_TABS = [
  ["waiting", "Waiting", "verified"],
  ["approved", "Live", "approved"],
  ["retired", "Retired", "retired"],
] as const;
type StatusFilter = (typeof STATUS_TABS)[number][0];
const PAGE = 50;

function gradeName(label: string) {
  if (label === "K") return "Kindergarten";
  if (/^\d+$/.test(label)) return `Grade ${label}`;
  if (/^\d+-\d+$/.test(label)) return `Grades ${label}`;
  return label;
}

function when(value: number | null) {
  if (!value) return "";
  const date = new Date(value * 1000);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
}

function Detail({ id, onChanged }: { id: string; onChanged: () => void }) {
  const [game, setGame] = useState<GameReviewDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [seed, setSeed] = useState(1);
  const [stopped, setStopped] = useState<string | null>(null);

  useEffect(() => {
    const request = new AbortController();
    void api<GameReviewDetail>(`/api/games/review/${encodeURIComponent(id)}`, {
      signal: request.signal,
    })
      .then((result) => {
        if (!request.signal.aborted) setGame(result);
      })
      .catch((caught) => {
        if (!request.signal.aborted) setError(errorMessage(caught));
      });
    return () => request.abort();
  }, [id]);

  async function decide(decision: "approve" | "retire") {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = await api<GameReviewDetail>(
        `/api/games/review/${encodeURIComponent(id)}/decision`,
        { method: "POST", body: { decision, note } },
      );
      setGame(result);
      setNote("");
      onChanged();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  if (!game)
    return (
      <div className="game-review-detail">
        <FormError message={error} />
        {!error ? <p role="status">Loading the game…</p> : null}
      </div>
    );
  const failed = game.robotChecks.filter((item) => !item.ok);
  return (
    <div className="game-review-detail">
      <header className="game-review-head">
        <span className="game-review-emoji" aria-hidden="true">
          {game.emoji}
        </span>
        <div>
          <span className={`game-status game-status-${game.status}`}>
            {STATUS_LABEL[game.status]}
          </span>
          <h2>{game.title}</h2>
          <p>{game.premise}</p>
        </div>
      </header>
      <dl className="game-review-facts">
        <div>
          <dt>Skill</dt>
          <dd>
            {game.targetSkill.id} · {game.targetSkill.name}
          </dd>
        </div>
        <div>
          <dt>Known misconception</dt>
          <dd>{game.targetSkill.misconception || "None listed in the skill map"}</dd>
        </div>
        <div>
          <dt>How the skill is the rule</dt>
          <dd>{game.idea}</dd>
        </div>
        <div>
          <dt>Written by</dt>
          <dd>
            {game.origin === "seed_example" ? "Reference game" : "Model"} · {game.model} ·
            {" "}
            {when(game.createdAt)}
          </dd>
        </div>
      </dl>

      <section className="game-review-play">
        <div className="game-review-play-head">
          <h3>Play it</h3>
          <button
            className="text-button"
            onClick={() => {
              setStopped(null);
              setSeed((value) => value + 1);
            }}
          >
            <RefreshCw size={15} aria-hidden="true" /> Restart with new numbers
          </button>
        </div>
        <p className="game-review-note">
          This runs in the same locked box a child gets. Try the right way and the
          wrong ways.
        </p>
        {stopped ? (
          <p className="account-error" role="alert">
            The game stopped ({stopped}). That alone is a reason to retire it.
          </p>
        ) : (
          <GameFrame
            key={seed}
            src={`/api/games/review/${encodeURIComponent(game.id)}/frame?seed=${seed}`}
            title={game.title}
            kit={game.kitVersion}
            onStopped={(reason) => setStopped(reason)}
          />
        )}
      </section>

      <section>
        <h3>What the game says, round by round</h3>
        <ol className="game-review-rounds">
          {game.rounds.map((round) => (
            <li key={round.id}>
              <span className="game-round-phase">
                {round.phase === "solo" ? "On their own" : "Guided"}
              </span>
              <p>{plainText(round.say)}</p>
              {round.mistakes.length ? (
                <ul>
                  {round.mistakes.map((mistake) => (
                    <li key={mistake.tag}>
                      <code>{mistake.tag}</code>
                      {mistake.say ? ` → “${plainText(mistake.say)}”` : " (no words in the solo round)"}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h3>Robot player</h3>
        <p className="game-review-note">
          {game.robot.passed ? "Passed" : "Did not pass"} {game.robotChecks.length} checks:
          winnable with its own solution, every known mistake rejected, not guessable,
          no network, fits a phone and a tablet.
        </p>
        {failed.length ? (
          <ul className="game-review-checks">
            {failed.map((item) => (
              <li key={item.name}>
                <X size={14} aria-hidden="true" /> {item.name}: {item.detail}
              </li>
            ))}
          </ul>
        ) : null}
        <details>
          <summary>All checks</summary>
          <ul className="game-review-checks">
            {game.robotChecks.map((item) => (
              <li key={item.name}>
                {item.ok ? (
                  <Check size={14} aria-hidden="true" />
                ) : (
                  <X size={14} aria-hidden="true" />
                )}{" "}
                {item.name}
              </li>
            ))}
          </ul>
        </details>
      </section>

      {game.modelReview ? (
        <section>
          <h3>Model reviewer</h3>
          <ul className="game-review-checks">
            {Object.entries(REVIEW_LABEL).map(([key, label]) => (
              <li key={key}>
                {game.modelReview?.[key] ? (
                  <Check size={14} aria-hidden="true" />
                ) : (
                  <X size={14} aria-hidden="true" />
                )}{" "}
                {label}
              </li>
            ))}
          </ul>
          {game.modelReview.issues?.length ? (
            <>
              <p className="game-review-note">
                Its notes for you. None of these stopped the game; they are things to
                look for while you play.
              </p>
              <ul className="game-review-notes">
                {game.modelReview.issues.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </>
          ) : null}
        </section>
      ) : null}

      <details className="game-review-source">
        <summary>Source ({game.code.length.toLocaleString()} characters)</summary>
        <pre>{game.code}</pre>
        {game.css ? <pre>{game.css}</pre> : null}
      </details>

      <section className="game-review-decision">
        <h3>Your call</h3>
        {game.status === "retired" ? (
          <p className="game-review-note">
            Retired{game.decisionNote ? `: ${game.decisionNote}` : ""}. A retired game
            stays retired.
          </p>
        ) : (
          <>
            <label htmlFor="game-note">Note (optional)</label>
            <input
              id="game-note"
              value={note}
              maxLength={300}
              disabled={busy}
              onChange={(event) => setNote(event.target.value)}
              placeholder="What you checked, or why it goes"
            />
            <FormError message={error} />
            <div className="game-review-buttons">
              {game.status === "verified" ? (
                <button
                  className="button primary"
                  disabled={busy}
                  onClick={() => void decide("approve")}
                >
                  {busy ? (
                    <LoaderCircle className="spinner" size={18} aria-hidden="true" />
                  ) : (
                    <Check size={18} aria-hidden="true" />
                  )}
                  Approve for kids
                </button>
              ) : null}
              <button
                className="button secondary"
                disabled={busy}
                onClick={() => void decide("retire")}
              >
                <X size={18} aria-hidden="true" /> Retire
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function ReviewContent() {
  const [list, setList] = useState<GameReviewList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [denied, setDenied] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusFilter>("waiting");
  const [subject, setSubject] = useState<"" | "math" | "ela">("");
  const [grade, setGrade] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [offset, setOffset] = useState(0);

  // Search as you type, a moment after the last key. Only a changed search goes back to the first page.
  const applied = useRef("");
  useEffect(() => {
    const next = search.trim();
    if (next === applied.current) return;
    const timer = window.setTimeout(() => {
      applied.current = next;
      setQuery(next);
      setOffset(0);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const load = useCallback(
    async (signal?: AbortSignal, keepSelection = false) => {
      const params = new URLSearchParams({
        status,
        limit: String(PAGE),
        offset: String(offset),
      });
      if (subject) params.set("subject", subject);
      if (grade) params.set("grade", grade);
      if (query) params.set("q", query);
      try {
        const result = await api<GameReviewList>(`/api/games/review?${params}`, {
          signal,
        });
        if (signal?.aborted) return;
        setList(result);
        setError(null);
        setSelected((current) =>
          keepSelection && current ? current : (result.games[0]?.id ?? current),
        );
      } catch (caught) {
        if (signal?.aborted) return;
        if (caught instanceof APIError && caught.code === "reviewer_required")
          setDenied(true);
        else setError(errorMessage(caught));
      }
    },
    [status, subject, grade, query, offset],
  );
  useEffect(() => {
    const request = new AbortController();
    void load(request.signal);
    return () => request.abort();
  }, [load]);

  const grades = (list?.grades ?? []).filter(
    (item) => !subject || item.subject === subject,
  );
  const first = list && list.total ? list.offset + 1 : 0;
  const last = list ? list.offset + list.games.length : 0;
  const filtered = Boolean(subject || grade || query);

  return (
    <AccountShell kind="parent" backHref="/parent/dashboard">
      <section className="game-review">
        <div className="section-heading">
          <div>
            <h1>Game review</h1>
            <p>
              Every game waits here. Nothing reaches a child until someone on the team
              plays it and approves it.
            </p>
          </div>
        </div>
        {denied ? (
          <p className="game-review-note">
            Game review is limited to the Sidekick team.{" "}
            <Link href="/parent/dashboard">Back to the dashboard</Link>
          </p>
        ) : null}
        <FormError message={error} />
        {list && !list.enabled ? (
          <p className="game-review-banner">
            Games are switched off for families (SIDEKICK_GAMES_ENABLED). You can still
            review here.
          </p>
        ) : null}
        {list && !list.requireApproval ? (
          <p className="game-review-banner">
            Approval is switched off, so games that pass the robot go straight to kids.
            Turn SIDEKICK_GAMES_REQUIRE_APPROVAL back on before real families use this.
          </p>
        ) : null}
        {list ? (
          <div className="game-review-layout">
            <nav className="game-review-list" aria-label="Games">
              <div className="game-review-filters">
                <div className="game-review-tabs" role="group" aria-label="Status">
                  {STATUS_TABS.map(([value, label, key]) => (
                    <button
                      key={value}
                      type="button"
                      className={status === value ? "selected" : ""}
                      aria-pressed={status === value}
                      onClick={() => {
                        setStatus(value);
                        setOffset(0);
                      }}
                    >
                      {label} <span>{list.counts[key].toLocaleString()}</span>
                    </button>
                  ))}
                </div>
                <label className="game-review-search">
                  <Search size={15} aria-hidden="true" />
                  <span className="sr-only">Search games</span>
                  <input
                    type="search"
                    value={search}
                    maxLength={80}
                    placeholder="Title or skill, like 3.NF"
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </label>
                <div className="game-review-selects">
                  <label>
                    <span className="sr-only">Subject</span>
                    <select
                      value={subject}
                      onChange={(event) => {
                        setSubject(event.target.value as "" | "math" | "ela");
                        setGrade("");
                        setOffset(0);
                      }}
                    >
                      <option value="">All subjects</option>
                      <option value="math">Math</option>
                      <option value="ela">Reading and writing</option>
                    </select>
                  </label>
                  <label>
                    <span className="sr-only">Grade</span>
                    <select
                      value={grade}
                      onChange={(event) => {
                        setGrade(event.target.value);
                        setOffset(0);
                      }}
                    >
                      <option value="">All grades</option>
                      {[...new Map(grades.map((item) => [item.grade, item])).values()].map(
                        (item) => {
                          const waiting = grades
                            .filter((other) => other.grade === item.grade)
                            .reduce((sum, other) => sum + other.waiting, 0);
                          return (
                            <option key={item.grade} value={item.grade}>
                              {gradeName(item.grade)}
                              {waiting ? ` (${waiting} waiting)` : ""}
                            </option>
                          );
                        },
                      )}
                    </select>
                  </label>
                </div>
              </div>
              <p className="game-review-count" role="status">
                {list.total
                  ? `Showing ${first.toLocaleString()} to ${last.toLocaleString()} of ${list.total.toLocaleString()}`
                  : filtered
                    ? "No games match these filters."
                    : status === "waiting"
                      ? "Nothing is waiting for review."
                      : "No games here yet."}
              </p>
              {list.games.map((game) => (
                <button
                  key={game.id}
                  className={selected === game.id ? "selected" : ""}
                  aria-current={selected === game.id ? "true" : undefined}
                  onClick={() => setSelected(game.id)}
                >
                  <span aria-hidden="true">{game.emoji}</span>
                  <span>
                    <strong>{game.title}</strong>
                    <small>
                      {game.targetSkill.id} · {gradeName(game.gradeLabel)}
                      {game.plays
                        ? ` · ${game.plays} ${game.plays === 1 ? "play" : "plays"}`
                        : ""}
                    </small>
                  </span>
                </button>
              ))}
              {list.total > list.limit ? (
                <div className="game-review-pager">
                  <button
                    type="button"
                    disabled={list.offset === 0}
                    onClick={() => setOffset(Math.max(0, list.offset - list.limit))}
                  >
                    <ChevronLeft size={16} aria-hidden="true" /> Previous
                  </button>
                  <button
                    type="button"
                    disabled={last >= list.total}
                    onClick={() => setOffset(list.offset + list.limit)}
                  >
                    Next <ChevronRight size={16} aria-hidden="true" />
                  </button>
                </div>
              ) : null}
              {list.counts.verified + list.counts.approved + list.counts.retired === 0 ? (
                <p className="game-review-note">
                  {list.premade ? (
                    <>
                      No games are loaded yet. Run <code>npm run games:seed</code> to load
                      the games that ship with the app.
                    </>
                  ) : (
                    "Pre-made games are switched off. A game the model writes shows up here when it is ready for you to try."
                  )}
                </p>
              ) : null}
              {list.jobs.length ? (
                <div>
                  <h3>
                    Builds <span>{list.jobs.length}</span>
                  </h3>
                  {list.jobs.map((job) => (
                    <div className="game-review-job" key={job.id}>
                      <strong>
                        {job.skill.id} · {job.status}
                      </strong>
                      <small>{job.skill.name}</small>
                      {job.failure ? (
                        job.failure.problems.length ? (
                          <>
                            <small>
                              Stopped by {job.failure.stoppedBy ?? "a check"} after{" "}
                              {job.failure.tries} {job.failure.tries === 1 ? "try" : "tries"}:
                            </small>
                            <ul className="game-review-notes">
                              {job.failure.problems.map((problem) => (
                                <li key={problem}>{problem.replace(/^review: /, "")}</li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <small>{job.failure.code}</small>
                        )
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}
            </nav>
            {selected ? (
              <Detail
                key={selected}
                id={selected}
                onChanged={() => void load(undefined, true)}
              />
            ) : (
              <div className="game-review-detail">
                <p className="game-review-note">Pick a game to review.</p>
              </div>
            )}
          </div>
        ) : !denied && !error ? (
          <p role="status">Loading games…</p>
        ) : null}
      </section>
    </AccountShell>
  );
}

// In a game, {3/4} is drawn as a stacked fraction. In this plain list it reads 3/4.
function plainText(text: string) {
  return text.replace(/\{\s*([^{}\/]+?)\s*\/\s*([^{}\/]+?)\s*\}/g, "$1/$2");
}

export function GameReview() {
  return (
    <RequireMode mode="parent">
      <ReviewContent />
    </RequireMode>
  );
}
