"use client";

import Link from "next/link";
import { Check, Circle, Lightbulb, LoaderCircle, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { APIError, api, errorMessage } from "@/lib/account-api";
import type { ProgramAction, ProgramInputs, ProgramSession } from "@/lib/activity-program-types";
import { RequireMode, useAccountSession } from "./account-session";
import { AccountShell, FormError } from "./account-ui";
import { ActivityProgramControl } from "./activity-program-controls";
import { ActivityProgramStage } from "./activity-program-stage";

type PendingRequest = { path: "actions" | "help"; body: Record<string, unknown>; fingerprint: string };

function ProgramContent({ sessionId }: { sessionId: string }) {
  const { session: account } = useAccountSession();
  const [program, setProgram] = useState<ProgramSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [uncertain, setUncertain] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const inFlight = useRef(false);
  const pending = useRef<PendingRequest | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const base = `/api/activity-programs/sessions/${encodeURIComponent(sessionId)}`;

  const load = useCallback(async (signal: AbortSignal) => {
    const result = await api<ProgramSession>(base, { signal });
    if (!signal.aborted) setProgram(result);
  }, [base]);

  useEffect(() => {
    const request = new AbortController();
    controller.current = request;
    void load(request.signal)
      .catch((caught) => { if (!request.signal.aborted) setError(errorMessage(caught)); })
      .finally(() => { if (!request.signal.aborted) setLoading(false); });
    return () => { request.abort(); controller.current = null; };
  }, [load]);

  useEffect(() => { heading.current?.focus(); }, [program?.id]);

  async function send(request: PendingRequest) {
    const signal = controller.current?.signal;
    if (!signal || signal.aborted || inFlight.current) return false;
    inFlight.current = true;
    setBusy(true);
    setError(null);
    setNotice("");
    try {
      const result = await api<ProgramSession>(`${base}/${request.path}`, {
        method: "POST", body: request.body, signal,
        headers: { "X-Sidekick-Profile-Version": String(account?.version) },
      });
      if (signal.aborted) return false;
      setProgram(result);
      pending.current = null;
      setUncertain(false);
      setNotice(request.path === "help" ? "Your help is saved with this activity." : result.status === "completed" ? "Mission complete. Your workspace is saved." : "Your move is saved. Keep exploring.");
      return true;
    } catch (caught) {
      if (signal.aborted) return false;
      setError(errorMessage(caught));
      if (caught instanceof APIError && caught.status < 500) {
        // A definite rejection did not mutate state. Restore a fresh server view
        // for stale revisions; never apply the rejected move in the browser.
        pending.current = null;
        setUncertain(false);
        if (caught.status === 409) {
          try { await load(signal); } catch { /* Keep the original safe rejection. */ }
        }
      } else {
        // Network failures and 5xx proxy/server responses can arrive after a
        // commit. Retry their identical request ID instead of repeating a move.
        // Do not let another move overtake an unconfirmed accepted event.
        setUncertain(true);
      }
      return false;
    } finally {
      inFlight.current = false;
      if (!signal.aborted) setBusy(false);
    }
  }

  function perform(path: PendingRequest["path"], payload: Record<string, unknown>) {
    if (!program || uncertain || inFlight.current) return Promise.resolve(false);
    const fingerprint = `${path}:${JSON.stringify(payload)}`;
    const request: PendingRequest = pending.current?.fingerprint === fingerprint ? pending.current : {
      path, fingerprint,
      body: { ...payload, expectedRevision: program.revision, requestId: crypto.randomUUID() },
    };
    pending.current = request;
    return send(request);
  }
  const act = (action: ProgramAction, inputs: ProgramInputs) => perform("actions", { actionId: action.id, inputs });
  const disabled = busy || uncertain || program?.status === "completed";

  return <AccountShell kind="kid" backHref="/kid/activity-preview">
    <section className={`program-player ${program?.stageView ? "program-player-world" : ""}`} aria-busy={loading || busy}>
      {loading ? <p className="program-loading" role="status"><LoaderCircle className="spinner" size={24} aria-hidden="true" />Opening your workspace…</p> : null}
      {program ? <>
        <header className="activity-title">
          <p className="account-eyebrow">BUILD · INVESTIGATE · CREATE</p>
          <h1 ref={heading} tabIndex={-1}>{program.title}</h1>
          <span className="activity-origin">{program.origin === "ai_composed" ? "Created for your learning · Development preview" : "Original Sidekick example · Development preview"}</span>
        </header>
        <section className={program.stageView ? "program-world-mission" : "program-mission"} aria-labelledby="program-mission-title">
          <div className="program-mission-heading"><Sparkles size={22} aria-hidden="true" /><h2 id="program-mission-title">Your mission</h2></div>
          <ul>{program.goals.map((goal) => <li key={goal.id} data-achieved={goal.achieved}>{goal.achieved ? <Check size={20} aria-label="Reached" /> : <Circle size={18} aria-label="In progress" />}<span>{goal.description}</span></li>)}</ul>
        </section>
        {program.status === "completed" && !program.stageView ? <section className="program-completion" aria-labelledby="program-completion-title" role="status">
          <Sparkles size={27} aria-hidden="true" />
          <div><h2 id="program-completion-title">Mission complete</h2><p>{program.completionFeedback || "Your finished workspace is saved. Take a look at what you made."}</p>
            {program.outcome.evidence.some((item) => item.status === "pending_parent_review") ? <p className="program-outcome"><strong>Pending parent review</strong> · Your writing is saved. Its quality has not been scored.</p> : <p className="program-outcome">Activity evidence recorded.</p>}
            <p className="program-assistance-status">{program.outcome.assisted ? "Finished with help. Your assistance is saved with the outcome." : "Finished without using help."}</p>
          </div>
        </section> : null}
        <FormError message={error} />
        {uncertain ? <button className="button primary program-retry" disabled={busy} onClick={() => { if (pending.current) void send(pending.current); }}>Retry saving the same move</button> : null}
        <p className="program-live-notice" role="status" aria-live="polite">{busy ? "Saving…" : notice}</p>
        {program.stageView ? <ActivityProgramStage session={program} disabled={Boolean(disabled)} onAction={act} /> : <div className="program-spaces">{program.spaces.map((space) => <section className="program-space" key={space.id} aria-labelledby={`program-space-${space.id}`}>
          <h2 id={`program-space-${space.id}`}>{space.title}</h2>
          {program.components.filter((component) => component.spaceId === space.id).map((component) => <div key={component.id} data-program-component={component.id}><ActivityProgramControl session={program} component={component} disabled={Boolean(disabled)} onAction={act} /></div>)}
        </section>)}</div>}
        <aside className={`program-help ${program.stageView ? "program-help-world" : ""}`} aria-labelledby="program-help-title">
          <div className="program-help-heading"><Lightbulb size={21} aria-hidden="true" /><h2 id="program-help-title">A little help</h2></div>
          {program.help.length && program.status !== "completed" ? <div className="program-help-actions">{program.help.map((help) => <button key={help.id} className="button secondary" disabled={Boolean(disabled) || help.remainingUses < 1} onClick={() => void perform("help", { helpId: help.id })}>{help.kind === "hint" ? "Get a hint" : help.kind === "demonstration" ? "Show me an example" : "Give me a cue"}</button>)}</div> : null}
          {program.deliveredHelp.map((help) => <div className="program-delivered-help" key={help.id}><p>{help.text}</p><span>Help received · Saved with your activity</span></div>)}
          {!program.deliveredHelp.length ? <p className="program-control-note">{program.status === "completed" ? "You finished without opening help." : program.help.length ? "You can ask for help and keep working on the same mission." : "Keep exploring your mission. Any available help will appear here."}</p> : null}
        </aside>
        <p className="program-save-note">Your workspace and any help are saved for this profile.</p>
        {program.status === "completed" ? <Link className="button primary program-back" href="/kid/activity-preview" prefetch={false}>Explore another workspace</Link> : null}
      </> : null}
      {!program && !loading ? <><FormError message={error} /><button className="button secondary" onClick={() => { const signal = controller.current?.signal; if (signal) void load(signal).catch((caught) => setError(errorMessage(caught))); }}>Reload saved workspace</button></> : null}
    </section>
  </AccountShell>;
}

function ProfileProgram({ sessionId }: { sessionId: string }) {
  const { session } = useAccountSession();
  return <ProgramContent key={`${session?.activeKidProfileId}:${session?.version}:${sessionId}`} sessionId={sessionId} />;
}
export function ActivityProgramPlayer({ sessionId }: { sessionId: string }) {
  return <RequireMode mode="kid"><ProfileProgram sessionId={sessionId} /></RequireMode>;
}
