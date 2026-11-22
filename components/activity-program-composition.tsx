"use client";

import Link from "next/link";
import { ArrowRight, LoaderCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { APIError, api, errorMessage } from "@/lib/account-api";
import type { ProgramCompositionSuggestion, ProgramGeneration, ProgramGenerationStage } from "@/lib/activity-program-types";
import { AccountShell, FormError } from "./account-ui";
import { RequireMode, useAccountSession } from "./account-session";

export const generationProgress: Record<ProgramGenerationStage, string> = {
  queued: "Getting your learning goal ready…",
  context: "Looking at the skills in your work…",
  compose: "Creating a learning adventure…",
  validate: "Checking that your activity works…",
  review: "Reviewing the learning and feedback…",
  repair: "Making a small improvement…",
  start: "Saving your workspace…",
  ready: "Your activity is ready.",
  failed: "Let’s give it another try.",
};

function generationFailure(code: string | null) {
  if (code?.includes("provider") || code?.includes("timeout")) return "Sidekick couldn’t finish creating the activity right now. Try again in a moment.";
  if (code?.includes("capability") || code?.includes("adapter") || code?.includes("unsupported")) return "We couldn’t build a supported activity for this learning goal yet. You can try again.";
  return "This activity didn’t pass all of Sidekick’s checks. You can try creating it again.";
}

function CompositionContent({ uploadId }: { uploadId: string }) {
  const { session } = useAccountSession();
  const router = useRouter();
  const [suggestion, setSuggestion] = useState<ProgramCompositionSuggestion | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [uncertain, setUncertain] = useState(false);
  const [reload, setReload] = useState(0);
  const controller = useRef<AbortController | null>(null);
  const requestId = useRef<string | null>(null);
  const inFlight = useRef(false);
  const endpoint = `/api/activity-programs/uploads/${encodeURIComponent(uploadId)}`;

  useEffect(() => {
    const request = new AbortController();
    controller.current = request;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let polls = 0;
    async function load() {
      try {
        const result = await api<ProgramCompositionSuggestion>(`${endpoint}/suggestion`, { signal: request.signal });
        if (request.signal.aborted) return;
        setSuggestion(result);
        setUnavailable(false);
        setError(null);
        if (result.reason === "analysis_pending" && polls++ < 120) timer = setTimeout(() => void load(), 2000);
      } catch (caught) {
        if (request.signal.aborted) return;
        // A disabled development flag exposes no preview card or V1 error.
        if (caught instanceof APIError && caught.status === 404) setUnavailable(true);
        else setError(errorMessage(caught));
      }
    }
    void load();
    return () => { request.abort(); clearTimeout(timer); controller.current = null; };
  }, [endpoint, reload]);

  async function create() {
    const signal = controller.current?.signal;
    if (!signal || signal.aborted || inFlight.current) return;
    inFlight.current = true;
    requestId.current ??= crypto.randomUUID();
    setBusy(true);
    setError(null);
    try {
      const job = await api<ProgramGeneration>(`${endpoint}/generations`, {
        method: "POST", body: { requestId: requestId.current }, signal,
        headers: { "X-Sidekick-Profile-Version": String(session?.version) },
      });
      if (!signal.aborted) router.push(`/kid/activity-preview/generations/${encodeURIComponent(job.id)}`);
    } catch (caught) {
      if (signal.aborted) return;
      setError(errorMessage(caught));
      const unknown = !(caught instanceof APIError) || caught.status >= 500;
      setUncertain(unknown);
      if (!unknown) requestId.current = null;
    } finally {
      inFlight.current = false;
      if (!signal.aborted) setBusy(false);
    }
  }

  if (unavailable || (!suggestion && !error)) return null;
  const job = suggestion?.generation;
  const pendingAnalysis = suggestion?.reason === "analysis_pending";
  const canCreate = suggestion?.available === true;
  return <section className="activity-suggestion program-composition-card" aria-label="Create a learning activity" aria-busy={busy}>
    <span className="activity-suggestion-icon" aria-hidden="true"><Sparkles size={25} /></span>
    <div className="activity-suggestion-copy">
      <p className="account-eyebrow">MADE FOR YOUR LEARNING · DEVELOPMENT PREVIEW</p>
      <h2>{job?.status === "processing" ? "Your learning adventure is taking shape." : job?.status === "ready" ? "Your activity is ready." : pendingAnalysis ? "Finding your learning goal…" : canCreate ? "Let’s make something to learn with." : "We need a clear learning goal first."}</h2>
      <p>{job?.status === "processing" ? generationProgress[job.stage] : job?.status === "ready" ? "Open your saved workspace and keep exploring." : pendingAnalysis ? "Sidekick is still looking at the skills in your work." : canCreate ? "Sidekick will create an original activity around a skill in your work. Build, investigate or create something new." : "We couldn’t reliably identify a supported skill in this work. Your extracted work is still here."}</p>
      {suggestion?.targetSkill ? <p className="activity-suggestion-skill">{suggestion.targetSkill.name}</p> : null}
      <FormError message={error} />
      {job ? <Link className="button primary" href={job.status === "ready" && job.sessionId ? `/kid/activity-preview/${encodeURIComponent(job.sessionId)}` : `/kid/activity-preview/generations/${encodeURIComponent(job.id)}`} prefetch={false}>{job.status === "ready" ? "Open your activity" : job.status === "processing" ? "Continue creating activity" : "Review activity attempt"}<ArrowRight size={18} aria-hidden="true" /></Link> : canCreate || uncertain ? <button className="button primary" disabled={busy} onClick={() => void create()}>{busy ? <><LoaderCircle className="spinner" size={18} aria-hidden="true" />Getting it ready…</> : <>{uncertain ? "Recover activity creation" : "Create an activity"}<ArrowRight size={18} aria-hidden="true" /></>}</button> : error || pendingAnalysis ? <button className="text-button" onClick={() => setReload(value => value + 1)}>Check again</button> : null}
      {job?.status === "ready" && canCreate ? <button className="text-button program-create-another" disabled={busy} onClick={() => void create()}>{uncertain ? "Recover activity creation" : "Create another activity"}</button> : null}
      {uncertain ? <Link className="account-link program-create-another" href="/kid/activity-preview" prefetch={false}>Find saved activity progress</Link> : null}
    </div>
  </section>;
}

export function ActivityProgramComposition({ uploadId }: { uploadId: string }) {
  const { session } = useAccountSession();
  if (session?.mode !== "kid") return null;
  return <CompositionContent key={`${session.activeKidProfileId}:${session.version}:${uploadId}`} uploadId={uploadId} />;
}

function GenerationContent({ generationId }: { generationId: string }) {
  const { session } = useAccountSession();
  const router = useRouter();
  const [job, setJob] = useState<ProgramGeneration | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reload, setReload] = useState(0);
  const controller = useRef<AbortController | null>(null);
  const retryId = useRef<string | null>(null);
  const inFlight = useRef(false);
  const endpoint = `/api/activity-programs/generations/${encodeURIComponent(generationId)}`;

  useEffect(() => {
    const request = new AbortController();
    controller.current = request;
    setPaused(false);
    let timer: ReturnType<typeof setTimeout> | undefined;
    let polls = 0;
    async function poll() {
      try {
        const result = await api<ProgramGeneration>(endpoint, { signal: request.signal });
        if (request.signal.aborted) return;
        setJob(result);
        setError(null);
        if (result.status === "ready" && result.sessionId) router.replace(`/kid/activity-preview/${encodeURIComponent(result.sessionId)}`);
        else if (result.status === "processing") {
          if (polls++ < 240) timer = setTimeout(() => void poll(), 1500);
          else setPaused(true);
        }
      } catch (caught) { if (!request.signal.aborted) { setError(errorMessage(caught)); setPaused(true); } }
    }
    void poll();
    return () => { request.abort(); clearTimeout(timer); controller.current = null; };
  }, [endpoint, reload, router]);

  async function retry() {
    const signal = controller.current?.signal;
    if (!signal || signal.aborted || inFlight.current) return;
    inFlight.current = true;
    retryId.current ??= crypto.randomUUID();
    setBusy(true);
    setError(null);
    try {
      const next = await api<ProgramGeneration>(`${endpoint}/retry`, {
        method: "POST", body: { requestId: retryId.current }, signal,
        headers: { "X-Sidekick-Profile-Version": String(session?.version) },
      });
      if (signal.aborted) return;
      if (next.id === generationId) { setJob(next); setReload(value => value + 1); }
      else router.replace(`/kid/activity-preview/generations/${encodeURIComponent(next.id)}`);
    } catch (caught) {
      if (!signal.aborted) setError(errorMessage(caught));
      // Preserve identity after network/5xx uncertainty; a retry cannot duplicate work.
      if (caught instanceof APIError && caught.status < 500) retryId.current = null;
    } finally { inFlight.current = false; if (!signal.aborted) setBusy(false); }
  }

  return <AccountShell kind="kid" backHref="/kid/activity-preview"><section className="activity-suggestion program-generation-status" aria-labelledby="program-generation-title" aria-busy={busy || job?.status === "processing"}>
    <span className="activity-suggestion-icon" aria-hidden="true"><Sparkles size={27} /></span>
    <div className="activity-suggestion-copy">
      <p className="account-eyebrow">MADE FOR YOUR LEARNING · DEVELOPMENT PREVIEW</p>
      <h1 id="program-generation-title">{job?.status === "failed" ? "Let’s try creating that again." : job?.status === "ready" ? "Your activity is ready." : "A little adventure, made for you."}</h1>
      {job?.targetSkill ? <p className="activity-suggestion-skill">{job.targetSkill.name}</p> : null}
      <p role="status" aria-live="polite" className="program-composition-progress">{!job && !error ? <><LoaderCircle className="spinner" size={18} aria-hidden="true" />Finding your saved progress…</> : job?.status === "processing" ? <><LoaderCircle className="spinner" size={18} aria-hidden="true" />{generationProgress[job.stage]}</> : job?.status === "failed" ? generationFailure(job.reasonCode) : job?.status === "ready" ? "Your workspace is saved and ready to open." : null}</p>
      <FormError message={error} />
      {job?.status === "ready" && job.sessionId ? <Link className="button primary" href={`/kid/activity-preview/${encodeURIComponent(job.sessionId)}`} prefetch={false}>Open your activity<ArrowRight size={18} aria-hidden="true" /></Link> : job?.status === "failed" && job.canRetry ? <button className="button primary" disabled={busy} onClick={() => void retry()}>{busy ? "Starting again…" : "Try creating again"}</button> : null}
      {paused || error ? <button className="text-button" disabled={busy} onClick={() => setReload(value => value + 1)}>Check activity progress</button> : null}
      <p className="program-control-note">You can refresh this page. Sidekick keeps the saved progress for this profile.</p>
    </div>
  </section></AccountShell>;
}

function ProfileGeneration({ generationId }: { generationId: string }) {
  const { session } = useAccountSession();
  return <GenerationContent key={`${session?.activeKidProfileId}:${session?.version}:${generationId}`} generationId={generationId} />;
}
export function ActivityProgramGeneration({ generationId }: { generationId: string }) {
  return <RequireMode mode="kid"><ProfileGeneration generationId={generationId} /></RequireMode>;
}
