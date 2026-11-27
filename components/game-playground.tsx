"use client";

import { ChevronLeft, ChevronRight, RefreshCw, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { api, errorMessage } from "@/lib/account-api";
import type { GameReviewDetail, GameReviewList } from "@/lib/game-types";
import { RequireMode } from "./account-session";
import { AccountShell, FormError } from "./account-ui";
import { GameFrame } from "./game-frame";

/**
 * Temporary: a page for trying any stored game, shown only while
 * SIDEKICK_GAMES_PLAYGROUND is on. It reads the reviewer routes, so it gives
 * nobody access they did not already have, and nothing played here is saved.
 *
 * To take it out: delete this file and app/parent/playground, the link in
 * game-history.tsx, and the `playground` setting in backend/games.
 */

const PAGE = 50;

type Access = { reviewer: boolean; playground?: boolean };

function gradeName(label: string) {
  if (label === "K") return "Kindergarten";
  if (/^\d+$/.test(label)) return `Grade ${label}`;
  if (/^\d+-\d+$/.test(label)) return `Grades ${label}`;
  return label;
}

function Player({
  id,
  onStep,
  hasPrevious,
  hasNext,
}: {
  id: string;
  onStep: (delta: 1 | -1) => void;
  hasPrevious: boolean;
  hasNext: boolean;
}) {
  const [game, setGame] = useState<GameReviewDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
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

  function restart() {
    setStopped(null);
    setSeed((value) => value + 1);
  }

  if (!game)
    return (
      <div className="game-review-detail">
        <FormError message={error} />
        {!error ? <p role="status">Loading the game…</p> : null}
      </div>
    );
  return (
    <div className="game-review-detail">
      <header className="game-review-head">
        <span className="game-review-emoji" aria-hidden="true">
          {game.emoji}
        </span>
        <div>
          <h2>{game.title}</h2>
          <p>{game.premise}</p>
        </div>
      </header>
      <p className="game-review-note">
        {game.targetSkill.id} · {game.targetSkill.name} · {gradeName(game.gradeLabel)}
        {game.status === "retired" ? " · Retired" : ""}
      </p>
      <section className="game-review-play">
        <div className="game-review-play-head">
          <h3>Play it</h3>
          <button className="text-button" onClick={restart}>
            <RefreshCw size={15} aria-hidden="true" /> Restart with new numbers
          </button>
        </div>
        {stopped ? (
          <p className="account-error" role="alert">
            The game stopped ({stopped}). Restart it to try again.
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
      <div className="game-review-buttons">
        <button
          className="button secondary"
          disabled={!hasPrevious}
          onClick={() => onStep(-1)}
        >
          <ChevronLeft size={18} aria-hidden="true" /> Previous game
        </button>
        <button
          className="button secondary"
          disabled={!hasNext}
          onClick={() => onStep(1)}
        >
          Next game <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function PlaygroundContent() {
  const [access, setAccess] = useState<Access | null>(null);
  const [list, setList] = useState<GameReviewList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [subject, setSubject] = useState<"" | "math" | "ela">("");
  const [grade, setGrade] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [offset, setOffset] = useState(0);
  // Which game to open when a page of the list arrives: the first, or the last after stepping back a page.
  const open = useRef<"first" | "last">("first");
  const player = useRef<HTMLDivElement>(null);

  function choose(id: string) {
    setSelected(id);
    // On a narrow screen the game sits below the list, so bring it into view.
    if (window.matchMedia("(max-width: 860px)").matches)
      player.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  useEffect(() => {
    const request = new AbortController();
    void api<Access>("/api/games/review/me", { signal: request.signal })
      .then((result) => {
        if (!request.signal.aborted) setAccess(result);
      })
      .catch((caught) => {
        if (!request.signal.aborted) setError(errorMessage(caught));
      });
    return () => request.abort();
  }, []);

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

  const on = Boolean(access?.reviewer && access.playground);
  useEffect(() => {
    if (!on) return;
    const request = new AbortController();
    const params = new URLSearchParams({
      status: "all",
      limit: String(PAGE),
      offset: String(offset),
    });
    if (subject) params.set("subject", subject);
    if (grade) params.set("grade", grade);
    if (query) params.set("q", query);
    void api<GameReviewList>(`/api/games/review?${params}`, { signal: request.signal })
      .then((result) => {
        if (request.signal.aborted) return;
        const game =
          open.current === "last"
            ? result.games[result.games.length - 1]
            : result.games[0];
        open.current = "first";
        setList(result);
        setError(null);
        setSelected(game?.id ?? null);
      })
      .catch((caught) => {
        if (!request.signal.aborted) setError(errorMessage(caught));
      });
    return () => request.abort();
  }, [on, subject, grade, query, offset]);

  const games = list?.games ?? [];
  const index = games.findIndex((game) => game.id === selected);
  const first = list && list.total ? list.offset + 1 : 0;
  const last = list ? list.offset + games.length : 0;
  const morePages = Boolean(list && last < list.total);
  const grades = (list?.grades ?? []).filter(
    (item) => !subject || item.subject === subject,
  );

  function step(delta: 1 | -1) {
    if (!list || index < 0) return;
    const next = games[index + delta];
    if (next) setSelected(next.id);
    else if (delta === 1 && morePages) setOffset(list.offset + list.limit);
    else if (delta === -1 && list.offset > 0) {
      open.current = "last";
      setOffset(Math.max(0, list.offset - list.limit));
    }
  }

  return (
    <AccountShell kind="parent" backHref="/parent/dashboard">
      <section className="game-review game-playground">
        <div className="section-heading">
          <div>
            <h1>Game playground</h1>
            <p>
              Try any game here. Nothing you do is saved, and nothing counts for a
              child.
            </p>
          </div>
        </div>
        <FormError message={error} />
        {access && !access.reviewer ? (
          <p className="game-review-note">
            The playground is limited to the Sidekick team.
          </p>
        ) : null}
        {access?.reviewer && !access.playground ? (
          <p className="game-review-banner">
            The playground is switched off. Set SIDEKICK_GAMES_PLAYGROUND=true in
            backend/.env and restart Sidekick to bring it back.
          </p>
        ) : null}
        {on && list ? (
          <div className="game-review-layout">
            <nav className="game-review-list" aria-label="Games">
              <div className="game-review-filters">
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
                      {[...new Set(grades.map((item) => item.grade))].map((label) => (
                        <option key={label} value={label}>
                          {gradeName(label)}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
              <p className="game-review-count" role="status">
                {list.total
                  ? `Showing ${first.toLocaleString()} to ${last.toLocaleString()} of ${list.total.toLocaleString()}`
                  : subject || grade || query
                    ? "No games match these filters."
                    : "No games are loaded yet."}
              </p>
              {games.map((game) => (
                <button
                  key={game.id}
                  className={selected === game.id ? "selected" : ""}
                  aria-current={selected === game.id ? "true" : undefined}
                  onClick={() => choose(game.id)}
                >
                  <span aria-hidden="true">{game.emoji}</span>
                  <span>
                    <strong>{game.title}</strong>
                    <small>
                      {game.targetSkill.id} · {gradeName(game.gradeLabel)}
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
                    disabled={!morePages}
                    onClick={() => setOffset(list.offset + list.limit)}
                  >
                    Next <ChevronRight size={16} aria-hidden="true" />
                  </button>
                </div>
              ) : null}
            </nav>
            <div className="game-playground-player" ref={player}>
              {selected ? (
                <Player
                  key={selected}
                  id={selected}
                  onStep={step}
                  hasPrevious={index > 0 || list.offset > 0}
                  hasNext={(index >= 0 && index < games.length - 1) || morePages}
                />
              ) : (
                <div className="game-review-detail">
                  <p className="game-review-note">
                    {list.total
                      ? "Pick a game to play."
                      : subject || grade || query
                        ? "Try a different search, subject or grade."
                        : "Run npm run games:seed to load the games that ship with the app."}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : !error && (!access || on) ? (
          <p role="status">Loading games…</p>
        ) : null}
      </section>
    </AccountShell>
  );
}

export function GamePlayground() {
  return (
    <RequireMode mode="parent">
      <PlaygroundContent />
    </RequireMode>
  );
}
