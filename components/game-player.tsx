"use client";

import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api, errorMessage } from "@/lib/account-api";
import type { GameRun } from "@/lib/game-types";
import { RequireMode } from "./account-session";
import { AccountShell, FormError, KidTrail } from "./account-ui";
import { GameFrame, type GameFrameMessage } from "./game-frame";

function GameContent({ runId }: { runId: string }) {
  const [run, setRun] = useState<GameRun | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stopped, setStopped] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const controller = useRef<AbortController | null>(null);
  const saved = useRef(false);
  const router = useRouter();

  useEffect(() => {
    const request = new AbortController();
    controller.current = request;
    void api<GameRun>(`/api/games/kid/runs/${encodeURIComponent(runId)}`, {
      signal: request.signal,
    })
      .then((result) => {
        if (!request.signal.aborted) setRun(result);
      })
      .catch((caught) => {
        if (!request.signal.aborted) setError(errorMessage(caught));
      });
    return () => {
      request.abort();
      controller.current = null;
    };
  }, [runId]);

  async function onMessage(message: GameFrameMessage) {
    const signal = controller.current?.signal;
    if (!run || !signal || signal.aborted) return;
    if (message.type === "done") {
      router.push("/kid");
      return;
    }
    if (message.type !== "finish" || saved.current) return;
    saved.current = true;
    try {
      // The server checks the shape and keeps only the first result for a run.
      await api<GameRun>(`/api/games/kid/runs/${encodeURIComponent(run.id)}/finish`, {
        method: "POST",
        body: { token: run.messageToken, result: message.result },
        signal,
      });
    } catch (caught) {
      saved.current = false;
      if (!signal.aborted) setError(errorMessage(caught));
    }
  }

  return (
    <AccountShell kind="kid" backHref="/kid">
      <KidTrail current="play" />
      <section className="game-player">
        {!run && !error ? (
          <div className="activity-waiting" role="status">
            <LoaderCircle className="spinner" size={26} aria-hidden="true" />
            <p>Getting your game ready…</p>
          </div>
        ) : null}
        {run ? (
          <>
            <div className="game-title">
              <p className="account-eyebrow">
                {run.targetSkill.subject === "math" ? "MATH" : "READING & WORDS"} · A
                SIDEKICK GAME
              </p>
              <h1>{run.game.title}</h1>
              <p>{run.targetSkill.name}</p>
            </div>
            {stopped ? (
              <div className="game-stopped" role="status">
                <span aria-hidden="true">🧩</span>
                <h2>This game needs a little fix.</h2>
                <p>You did nothing wrong. Try it again, or head back and pick something else.</p>
                <div className="game-stopped-actions">
                  <button
                    className="button primary"
                    onClick={() => {
                      setStopped(null);
                      setAttempt((value) => value + 1);
                    }}
                  >
                    Start again
                  </button>
                  <Link className="text-button" href="/kid">
                    Back home
                  </Link>
                </div>
              </div>
            ) : (
              <GameFrame
                key={attempt}
                src={`/api/games/kid/runs/${encodeURIComponent(run.id)}/frame`}
                title={run.game.title}
                kit={run.kitVersion}
                token={run.messageToken}
                onMessage={(message) => void onMessage(message)}
                onStopped={(reason) => setStopped(reason)}
              />
            )}
          </>
        ) : null}
        <FormError message={error} />
        {error && !run ? (
          <Link className="text-button" href="/kid">
            Back home
          </Link>
        ) : null}
      </section>
    </AccountShell>
  );
}

export function GamePlayer({ runId }: { runId: string }) {
  return (
    <RequireMode mode="kid">
      <GameContent key={runId} runId={runId} />
    </RequireMode>
  );
}
