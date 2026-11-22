"use client";

import Link from "next/link";
import { ArrowRight, LoaderCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api, errorMessage } from "@/lib/account-api";
import type { ProgramPreview, ProgramSession } from "@/lib/activity-program-types";
import { RequireMode, useAccountSession } from "./account-session";
import { AccountShell, FormError } from "./account-ui";

function LibraryContent() {
  const router = useRouter();
  const { session } = useAccountSession();
  const [programs, setPrograms] = useState<ProgramPreview[] | null>(null);
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

  async function start(programId: string) {
    const signal = controller.current?.signal;
    if (!signal || signal.aborted || inFlight.current) return;
    inFlight.current = true;
    setBusy(programId);
    setError(null);
    let requestId = requests.current.get(programId);
    if (!requestId) { requestId = crypto.randomUUID(); requests.current.set(programId, requestId); }
    try {
      const result = await api<ProgramSession>(`/api/activity-programs/preview/${encodeURIComponent(programId)}/sessions`, {
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
        <p>Choose a world to explore. Your work and your place are saved.</p>
      </div>
      <p className="program-preview-note">Development preview · Original Sidekick examples</p>
      {!programs && !error ? <p role="status" className="program-loading"><LoaderCircle className="spinner" size={22} aria-hidden="true" /> Getting the workspaces ready…</p> : null}
      <div className="program-library-grid">{programs?.map((program) => <article className="program-library-card" key={program.id}>
        <span className="program-library-icon" aria-hidden="true"><Sparkles size={24} /></span>
        <h2>{program.title}</h2>
        <p>{program.description || "This workspace needs a control that is not available in this preview."}</p>
        {program.available === false ? <p className="program-control-note">Preview unavailable</p> : program.sessionId ? <><Link className="button primary" href={`/kid/activity-preview/${encodeURIComponent(program.sessionId)}`} prefetch={false}>Continue {program.title}<ArrowRight size={17} aria-hidden="true" /></Link><button className="text-button" disabled={busy !== null} onClick={() => void start(program.id)} aria-label={`Start again: ${program.title}`}>Start a new workspace</button></> : <button className="button primary" disabled={busy !== null} onClick={() => void start(program.id)}>{busy === program.id ? "Opening…" : `Explore ${program.title}`}<ArrowRight size={17} aria-hidden="true" /></button>}
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
