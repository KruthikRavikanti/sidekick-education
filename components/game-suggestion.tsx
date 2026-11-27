"use client";

import { ArrowRight, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api, errorMessage } from "@/lib/account-api";
import type { GameRun, GameSuggestionData } from "@/lib/game-types";
import { useAccountSession } from "./account-session";
import { FormError } from "./account-ui";

function GameSuggestionContent({ uploadId }: { uploadId: string }) {
  const [suggestion, setSuggestion] = useState<GameSuggestionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const startKey = useRef<string | null>(null);
  const requested = useRef(false);
  const router = useRouter();

  useEffect(() => {
    const request = new AbortController();
    controller.current = request;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let polls = 0;
    let waits = 0;
    async function load() {
      try {
        let result = await api<GameSuggestionData>(
          `/api/games/kid/suggestion?uploadId=${encodeURIComponent(uploadId)}`,
          { signal: request.signal },
        );
        if (request.signal.aborted) return;
        if (result.canRequest && !requested.current) {
          // Ask once for a game to be invented. Nobody waits on it: it is built
          // in the background and a grown-up checks it before it appears.
          requested.current = true;
          const queued = await api<{ queued: boolean; state: string }>(
            "/api/games/kid/request",
            { method: "POST", body: { uploadId }, signal: request.signal },
          );
          if (queued.state === "building")
            result = { ...result, state: "building", canRequest: false };
        }
        if (request.signal.aborted) return;
        setSuggestion(result);
        if (result.reason === "analysis_pending" && polls++ < 60)
          timeout = setTimeout(() => void load(), 3000);
        // A game being built or waiting for a grown-up can become ready while the page is open.
        // Look again now and then, so the card changes by itself: often while one is being
        // written (a few minutes), less often while one waits for a person.
        else if ((result.state === "building" || result.state === "in_review") && waits++ < 240)
          timeout = setTimeout(() => void load(), result.state === "building" ? 5000 : 15000);
      } catch {
        // The game card is an extra. If it cannot load, the page works without it.
        if (!request.signal.aborted) setSuggestion(null);
      }
    }
    void load();
    return () => {
      request.abort();
      clearTimeout(timeout);
      controller.current = null;
    };
  }, [uploadId]);

  async function play() {
    const signal = controller.current?.signal;
    if (!signal || signal.aborted || busy || !suggestion) return;
    if (suggestion.runId) {
      router.push(`/kid/games/${encodeURIComponent(suggestion.runId)}`);
      return;
    }
    setBusy(true);
    setError(null);
    startKey.current ??= crypto.randomUUID();
    try {
      const run = await api<GameRun>("/api/games/kid/start", {
        method: "POST",
        body: { uploadId, idempotencyKey: startKey.current },
        signal,
      });
      if (!signal.aborted) router.push(`/kid/games/${encodeURIComponent(run.id)}`);
    } catch (caught) {
      if (!signal.aborted) setError(errorMessage(caught));
    } finally {
      if (!signal.aborted) setBusy(false);
    }
  }

  if (!suggestion?.enabled) return null;
  if (suggestion.state === "ready" && suggestion.game)
    return (
      <section className="game-suggestion" aria-label="A game for this skill">
        <span className="game-suggestion-art" aria-hidden="true">
          {suggestion.game.emoji}
        </span>
        <div className="game-suggestion-copy">
          <p className="account-eyebrow">A GAME FOR THIS SKILL</p>
          <h2>{suggestion.game.title}</h2>
          <p>{suggestion.game.premise}</p>
          {suggestion.targetSkill ? (
            <p className="game-suggestion-skill">{suggestion.targetSkill.name}</p>
          ) : null}
          <FormError message={error} />
          <button className="button primary" disabled={busy} onClick={() => void play()}>
            {busy ? (
              <>
                <LoaderCircle className="spinner" size={18} aria-hidden="true" />
                Opening…
              </>
            ) : (
              <>
                {suggestion.runId ? "Keep playing" : "Play"}
                <ArrowRight size={18} aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </section>
    );
  if (suggestion.state === "building" || suggestion.state === "in_review")
    return (
      <section className="game-suggestion game-suggestion-soon" aria-label="A game is on the way">
        <span className="game-suggestion-art" aria-hidden="true">
          🛠️
        </span>
        <div className="game-suggestion-copy">
          <p className="account-eyebrow">A NEW GAME IS ON THE WAY</p>
          {suggestion.state === "building" ? (
            <>
              <h2>Sidekick is inventing a game for this skill.</h2>
              <p>
                {suggestion.approval === false
                  ? "It takes a few minutes. It will show up here when it is ready."
                  : "It takes a few minutes. A grown-up on the Sidekick team plays every new game first. It will show up here when it is ready."}
              </p>
            </>
          ) : (
            <>
              <h2>A new game is waiting for a grown-up to try it.</h2>
              <p>
                A grown-up on the Sidekick team plays every new game first. It will
                show up here when it is ready.
              </p>
            </>
          )}
          {suggestion.targetSkill ? (
            <p className="game-suggestion-skill">{suggestion.targetSkill.name}</p>
          ) : null}
        </div>
      </section>
    );
  // A game was tried for this skill and did not pass its checks. Say so instead of showing nothing.
  if (suggestion.reason === "build_failed")
    return (
      <section className="game-suggestion game-suggestion-soon" aria-label="No game this time">
        <span className="game-suggestion-art" aria-hidden="true">
          🧩
        </span>
        <div className="game-suggestion-copy">
          <p className="account-eyebrow">NO GAME THIS TIME</p>
          <h2>Sidekick tried to invent a game, and it was not good enough to show.</h2>
          <p>Upload more work to try again.</p>
          {suggestion.targetSkill ? (
            <p className="game-suggestion-skill">{suggestion.targetSkill.name}</p>
          ) : null}
        </div>
      </section>
    );
  return null;
}

export function GameSuggestion({ uploadId }: { uploadId: string }) {
  const { session } = useAccountSession();
  if (session?.mode !== "kid") return null;
  return (
    <GameSuggestionContent
      key={`${session.activeKidProfileId}:${uploadId}`}
      uploadId={uploadId}
    />
  );
}
