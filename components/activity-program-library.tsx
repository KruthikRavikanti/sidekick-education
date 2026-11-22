"use client";

import Link from "next/link";
import { ArrowRight, LoaderCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api, errorMessage } from "@/lib/account-api";
import type { ProgramBenchmark, ProgramGeneration, ProgramPreview, ProgramSession } from "@/lib/activity-program-types";
import { RequireMode, useAccountSession } from "./account-session";
import { AccountShell, FormError } from "./account-ui";

function LibraryContent() {
  const router = useRouter();
  const { session } = useAccountSession();
  const [programs, setPrograms] = useState<ProgramPreview[] | null>(null);
  const [benchmarks, setBenchmarks] = useState<ProgramBenchmark[] | null>(null);
  const [benchmarkError, setBenchmarkError] = useState<string | null>(null);
  const [benchmarkReload, setBenchmarkReload] = useState(0);
  const [generations, setGenerations] = useState<ProgramGeneration[]>([]);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generationReload, setGenerationReload] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const controller = useRef<AbortController | null>(null);
  const requests = useRef(new Map<string, string>());
  const inFlight = useRef(false);
  useEffect(() => {
    const request = new AbortController();
    controller.current = request;
    void api<{ programs: ProgramPreview[] }>("/api/activity-programs/preview", { signal: request.signal })
      .then((result) => { if (!request.signal.aborted) setPrograms(result.programs); })
      .catch((caught) => { if (!request.signal.aborted) setError(errorMessage(caught)); });
    return () => { request.abort(); controller.current = null; };
  }, []);

  useEffect(() => {
    const request = new AbortController();
    void api<{ benchmarks: ProgramBenchmark[] }>("/api/activity-programs/benchmarks", { signal: request.signal })
      .then(result => { if (!request.signal.aborted) { setBenchmarks(result.benchmarks); setBenchmarkError(null); } })
      .catch(caught => { if (!request.signal.aborted) setBenchmarkError(errorMessage(caught)); });
    return () => request.abort();
  }, [benchmarkReload]);

  useEffect(() => {
    const request = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let polls = 0;
    async function loadGenerations() {
      try {
        const result = await api<{ generations: ProgramGeneration[] }>("/api/activity-programs/generations", { signal: request.signal });
        if (request.signal.aborted) return;
        setGenerations(result.generations);
        setGenerationError(null);
        if (result.generations.some(item => item.status === "processing") && polls++ < 120) timer = setTimeout(() => void loadGenerations(), 3000);
      } catch (caught) { if (!request.signal.aborted) setGenerationError(errorMessage(caught)); }
    }
    void loadGenerations();
    return () => { request.abort(); clearTimeout(timer); };
  }, [generationReload]);

  async function start(programId: string, source: "preview" | "benchmarks" = "preview") {
    const signal = controller.current?.signal;
    if (!signal || signal.aborted || inFlight.current) return;
    inFlight.current = true;
    const requestKey = `${source}:${programId}`;
    setBusy(requestKey);
    setError(null);
    let requestId = requests.current.get(requestKey);
    if (!requestId) { requestId = crypto.randomUUID(); requests.current.set(requestKey, requestId); }
    try {
      const result = await api<ProgramSession>(`/api/activity-programs/${source}/${encodeURIComponent(programId)}/sessions`, {
        method: "POST", body: { requestId }, signal,
        headers: { "X-Sidekick-Profile-Version": String(session?.version) },
      });
      if (!signal.aborted) router.push(`/kid/activity-preview/${encodeURIComponent(result.id)}`);
    } catch (caught) {
      if (!signal.aborted) setError(errorMessage(caught));
    } finally {
      inFlight.current = false;
      if (!signal.aborted) setBusy(null);
    }
  }

  return <AccountShell kind="kid" backHref="/kid">
    <section className="program-library">
      <div className="activity-title">
        <p className="account-eyebrow">A LITTLE LEARNING ADVENTURE</p>
        <h1>Make something. Discover something.</h1>
        <p>Try a learning adventure, or create one from your work. Your place is saved for {session?.activeKid?.firstName}.</p>
      </div>
      <section className="program-generated-history" aria-labelledby="program-benchmarks-title">
        <h2 id="program-benchmarks-title">AI-generated activities</h2>
        <p>These saved examples were created and checked by Sidekick. Pick one to try.</p>
        {!benchmarks && !benchmarkError ? <p role="status" className="program-loading"><LoaderCircle className="spinner" size={22} aria-hidden="true" /> Getting the activities ready…</p> : null}
        <div className="program-library-grid">{benchmarks?.map(program => <article className="program-library-card" data-benchmark-id={program.id} key={program.id}>
          <span className="program-library-icon" aria-hidden="true"><Sparkles size={24} /></span>
          <p>{program.subject === "math" ? "Math" : "ELA"} · AI-generated example</p>
          <h3>{program.title}</h3>
          <p>{program.description}</p>
          {program.available === false ? <p className="program-control-note">This activity is temporarily unavailable.</p> : program.sessionId ? <>
            <Link className="button primary" href={`/kid/activity-preview/${encodeURIComponent(program.sessionId)}`} prefetch={false}>{program.status === "completed" ? "Open completed activity" : "Continue activity"}<ArrowRight size={17} aria-hidden="true" /></Link>
            <button className="text-button" disabled={busy !== null} onClick={() => void start(program.id, "benchmarks")}>Start a fresh activity</button>
          </> : <button className="button primary" disabled={busy !== null} onClick={() => void start(program.id, "benchmarks")}>{busy === `benchmarks:${program.id}` ? "Opening…" : "Start activity"}<ArrowRight size={17} aria-hidden="true" /></button>}
        </article>)}</div>
        <FormError message={benchmarkError} />
        {benchmarkError ? <button className="text-button" onClick={() => setBenchmarkReload(value => value + 1)}>Reload activities</button> : null}
      </section>
      <section className="program-generated-history" aria-labelledby="program-generated-title">
        <h2 id="program-generated-title">Created from your work</h2>
        <p>Upload schoolwork to create an original activity around your learning goal.</p>
        <Link className="button primary" href="/kid/homework" prefetch={false}>Upload work<ArrowRight size={17} aria-hidden="true" /></Link>
        <div className="program-library-grid">{generations.map(job => <article className="program-library-card" key={job.id}>
          <h3>{job.title || "Your learning activity"}</h3>
          {job.targetSkill ? <p>{job.targetSkill.name}</p> : null}
          <p>{job.status === "processing" ? "Creating and checking your activity…" : job.status === "ready" ? "Your saved workspace is ready." : "This attempt needs another try."}</p>
          <Link className="button secondary" href={job.status === "ready" && job.sessionId ? `/kid/activity-preview/${encodeURIComponent(job.sessionId)}` : `/kid/activity-preview/generations/${encodeURIComponent(job.id)}`} prefetch={false}>{job.status === "processing" ? "Continue creating activity" : job.status === "ready" ? "Open saved activity" : "Review activity attempt"}<ArrowRight size={17} aria-hidden="true" /></Link>
        </article>)}</div>
        <FormError message={generationError} />
        {generationError ? <button className="text-button" onClick={() => setGenerationReload(value => value + 1)}>Reload saved activities</button> : null}
      </section>
      <h2 className="program-examples-title">Development examples</h2>
      <p className="program-preview-note">Hand-authored Sidekick contract examples</p>
      {!programs && !error ? <p role="status" className="program-loading"><LoaderCircle className="spinner" size={22} aria-hidden="true" /> Getting the workspaces ready…</p> : null}
      <div className="program-library-grid">{programs?.map((program) => <article className="program-library-card" key={program.id}>
        <span className="program-library-icon" aria-hidden="true"><Sparkles size={24} /></span>
        <h2>{program.title}</h2>
        <p>{program.description || "This workspace needs a control that is not available in this preview."}</p>
        {program.available === false ? <p className="program-control-note">Preview unavailable</p> : program.sessionId ? <><Link className="button primary" href={`/kid/activity-preview/${encodeURIComponent(program.sessionId)}`} prefetch={false}>Continue {program.title}<ArrowRight size={17} aria-hidden="true" /></Link><button className="text-button" disabled={busy !== null} onClick={() => void start(program.id)} aria-label={`Start again: ${program.title}`}>Start a new workspace</button></> : <button className="button primary" disabled={busy !== null} onClick={() => void start(program.id)}>{busy === `preview:${program.id}` ? "Opening…" : `Explore ${program.title}`}<ArrowRight size={17} aria-hidden="true" /></button>}
      </article>)}</div>
      <FormError message={error} />
    </section>
  </AccountShell>;
}

function ProfileLibrary() {
  const { session } = useAccountSession();
  return <LibraryContent key={`${session?.activeKidProfileId}:${session?.version}`} />;
}
export function ActivityProgramLibrary() {
  return <RequireMode mode="kid"><ProfileLibrary /></RequireMode>;
}
