"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/account-api";
import type { GameHistoryItem } from "@/lib/game-types";

function day(value: number) {
  const date = new Date(value * 1000);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function outcome(item: GameHistoryItem) {
  if (item.status !== "completed" || !item.solo) return "Started, not finished yet";
  if (item.solo.firstTry) return "Got the last round on the first try";
  if (item.solo.solved)
    return `Got the last round after ${item.solo.attempts} ${item.solo.attempts === 1 ? "try" : "tries"}`;
  return "Tried the last round, not there yet";
}

export function ParentGameHistory({ kidId }: { kidId: string }) {
  const [runs, setRuns] = useState<GameHistoryItem[] | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [review, setReview] = useState<{
    reviewer: boolean;
    waiting?: number;
    playground?: boolean;
  } | null>(null);
  useEffect(() => {
    const request = new AbortController();
    void api<{ enabled: boolean; runs: GameHistoryItem[] }>(
      `/api/games/parent/${encodeURIComponent(kidId)}/history`,
      { signal: request.signal },
    )
      .then((result) => {
        if (request.signal.aborted) return;
        setRuns(result.runs);
        setEnabled(result.enabled);
      })
      .catch(() => {
        if (!request.signal.aborted) setRuns([]);
      });
    void api<{ reviewer: boolean; waiting?: number; playground?: boolean }>("/api/games/review/me", {
      signal: request.signal,
    })
      .then((result) => {
        if (!request.signal.aborted) setReview(result);
      })
      .catch(() => undefined);
    return () => request.abort();
  }, [kidId]);

  if (!runs) return null;
  // Games can be switched off for a whole Sidekick. Say so plainly instead of leaving the tab empty.
  if (!enabled && runs.length === 0 && !review?.reviewer)
    return (
      <section className="dashboard-section game-history">
        <div className="section-heading">
          <div>
            <h2>Games played.</h2>
            <p>Games are switched off on this Sidekick right now.</p>
          </div>
        </div>
      </section>
    );
  return (
    <section className="dashboard-section game-history">
      <div className="section-heading">
        <div>
          <h2>Games played.</h2>
          <p>
            Games are practice. They show how play went and do not change the skill
            picture, which still comes from uploaded work.
          </p>
        </div>
        {/* Temporary: the playground link shows only while SIDEKICK_GAMES_PLAYGROUND is on. */}
        {review?.reviewer && review.playground ? (
          <Link
            className="button secondary"
            href="/parent/playground"
            prefetch={false}
            style={{ marginLeft: "auto" }}
          >
            Game playground
          </Link>
        ) : null}
        {review?.reviewer ? (
          <Link className="button secondary" href="/parent/games" prefetch={false}>
            Review games{review.waiting ? ` (${review.waiting})` : ""}
          </Link>
        ) : null}
      </div>
      {runs.length === 0 ? (
        <p className="game-history-note">No games played yet.</p>
      ) : (
        <ul className="game-history-list">
          {runs.map((item) => (
            <li key={item.id}>
              <span className="game-history-emoji" aria-hidden="true">
                {item.emoji}
              </span>
              <div>
                <strong>{item.title}</strong>
                <span>{item.targetSkill?.name}</span>
                <span>
                  {outcome(item)}
                  {item.hints ? ` · ${item.hints} ${item.hints === 1 ? "hint" : "hints"}` : ""}
                  {item.solo?.mistakes.length
                    ? ` · tried: ${item.solo.mistakes.map((tag) => tag.replaceAll("_", " ")).join(", ")}`
                    : ""}
                </span>
              </div>
              <time>{day(item.startedAt)}</time>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
