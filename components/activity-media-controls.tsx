"use client";

import { Mic, RotateCcw, Square, Upload, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { apiFetch, clearCSRF } from "@/lib/account-api";

export type DrawingPoint = { x: number; y: number };
export type DrawingStroke = DrawingPoint[];

interface OralControlProps {
  sessionId: string;
  sceneId: string;
  mode: "read_aloud" | "say_sounds" | "listen_respond" | "perform";
  passage: string;
  listenText: string | null;
  disabled: boolean;
  recordingId?: string | null;
  onResponse: (response: { recordingId: string }, ready: boolean) => void;
}

export function OralControl({ sessionId, sceneId, mode, passage, listenText, disabled, recordingId, onResponse }: OralControlProps) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [clip, setClip] = useState<Blob | null>(null);
  const [clipUrl, setClipUrl] = useState<string | null>(null);
  const [savedId, setSavedId] = useState(recordingId ?? null);
  const [saving, setSaving] = useState(false);
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const saveRequest = useRef<AbortController | null>(null);
  const clipKey = useRef<string | null>(null);
  const disposed = useRef(false);

  useEffect(() => {
    disposed.current = false;
    return () => {
      disposed.current = true;
      saveRequest.current?.abort();
      if (recorder.current?.state === "recording") recorder.current.stop();
      stream.current?.getTracks().forEach(track => track.stop());
      window.speechSynthesis?.cancel();
    };
  }, []);

  useEffect(() => {
    if (!clip) { setClipUrl(null); return; }
    const url = URL.createObjectURL(clip);
    setClipUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [clip]);

  useEffect(() => {
    if (!recording) return;
    const clock = window.setInterval(() => setSeconds(value => value + 1), 1000);
    const limit = window.setTimeout(() => {
      if (recorder.current?.state === "recording") recorder.current.stop();
    }, 120_000);
    return () => { clearInterval(clock); clearTimeout(limit); };
  }, [recording]);

  function listen() {
    if (!("speechSynthesis" in window)) {
      setError("This browser cannot play the listening prompt. Try a browser with speech playback.");
      return;
    }
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(listenText || passage);
    speech.lang = "en-US";
    speech.rate = 0.85;
    window.speechSynthesis.speak(speech);
  }

  async function start() {
    if (disabled || saving || opening) return;
    setError(null);
    if (!window.isSecureContext) {
      setError("Recording needs a secure connection. Ask a parent to open Sidekick on HTTPS or localhost.");
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("Recording is unavailable in this browser. Open Sidekick in a browser with microphone support.");
      return;
    }
    try {
      setOpening(true);
      window.speechSynthesis?.cancel();
      const audio = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (disposed.current) { audio.getTracks().forEach(track => track.stop()); return; }
      stream.current = audio;
      const mime = ["audio/webm;codecs=opus", "audio/mp4", "audio/ogg;codecs=opus"].find(type => MediaRecorder.isTypeSupported(type));
      const device = new MediaRecorder(audio, { ...(mime ? { mimeType: mime } : {}), audioBitsPerSecond: 64_000 });
      recorder.current = device;
      const chunks: BlobPart[] = [];
      const started = performance.now();
      device.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      device.onerror = () => { audio.getTracks().forEach(track => track.stop()); if (!disposed.current) { setRecording(false); setError("Recording stopped unexpectedly. Please record again."); } };
      device.onstop = () => {
        audio.getTracks().forEach(track => track.stop());
        if (disposed.current) return;
        setRecording(false);
        const blob = new Blob(chunks, { type: device.mimeType || "audio/webm" });
        if (!blob.size || performance.now() - started < 500) {
          setError("Record a little more of your reading before saving.");
          return;
        }
        clipKey.current = crypto.randomUUID();
        setClip(blob);
      };
      setClip(null);
      clipKey.current = null;
      setSavedId(null);
      setSeconds(0);
      onResponse({ recordingId: "" }, false);
      device.start();
      setRecording(true);
    } catch (caught) {
      stream.current?.getTracks().forEach(track => track.stop());
      setError(caught instanceof DOMException && caught.name === "NotAllowedError"
        ? "Allow microphone access in your browser, then try recording again."
        : "Sidekick could not open your microphone. Check the microphone and try again.");
    } finally { if (!disposed.current) setOpening(false); }
  }

  async function upload() {
    if (!clip || disabled || saving) return;
    const controller = new AbortController();
    saveRequest.current = controller;
    setSaving(true);
    setError(null);
    try {
      const body = new FormData();
      const extension = clip.type.includes("mp4") ? "m4a" : clip.type.includes("ogg") ? "ogg" : "webm";
      body.append("file", clip, `reading.${extension}`);
      body.append("sceneId", sceneId);
      clipKey.current ??= crypto.randomUUID();
      body.append("idempotencyKey", clipKey.current);
      const response = await apiFetch(`/api/activities/kid/sessions/${encodeURIComponent(sessionId)}/recording`, {
        method: "POST", body, signal: controller.signal,
      });
      const data = await response.json().catch(() => null);
      if (response.status === 403 && data?.error?.code === "csrf_failed") clearCSRF();
      if (["unauthenticated", "parent_required", "kid_required", "profile_changed"].includes(data?.error?.code)) window.dispatchEvent(new Event("sidekick-auth-recheck"));
      if (!response.ok || typeof data?.recordingId !== "string") throw new Error(data?.error?.message || "Your recording could not be saved. Please try again.");
      if (controller.signal.aborted || disposed.current) return;
      setSavedId(data.recordingId);
      onResponse({ recordingId: data.recordingId }, true);
    } catch (caught) {
      if (!controller.signal.aborted && !disposed.current) setError(caught instanceof Error ? caught.message : "Please try saving the recording again.");
    } finally {
      if (!disposed.current) setSaving(false);
    }
  }

  return <section className="activity-family oral-studio" aria-label="Reading and speaking studio">
    {mode !== "listen_respond" && !(mode === "say_sounds" && listenText) ? <div className="oral-passage" aria-label={mode === "read_aloud" ? "Passage to read aloud" : "Speaking prompt"}>{passage}</div> : null}
    {listenText || mode === "listen_respond" ? <button type="button" className="family-secondary" disabled={disabled || recording} onClick={listen}><Volume2 size={18} aria-hidden="true" />Listen to the prompt</button> : null}
    <p className="family-note">Record your voice. A parent will listen and review this response.</p>
    <div className="family-actions">
      {recording ? <button type="button" className="family-primary" onClick={() => recorder.current?.stop()}><Square size={17} aria-hidden="true" />Stop recording</button>
        : <button type="button" className="family-primary" disabled={disabled || saving || opening} onClick={() => void start()}><Mic size={18} aria-hidden="true" />{opening ? "Opening microphone…" : clip || savedId ? "Record again" : "Start recording"}</button>}
      {recording ? <output className="oral-recording-clock" aria-live="polite">Recording · {seconds}s</output> : null}
    </div>
    {clipUrl ? <audio className="family-audio" controls src={clipUrl} aria-label="Preview your recording" /> : savedId ? <audio className="family-audio" controls src={`/api/activities/kid/sessions/${encodeURIComponent(sessionId)}/recordings/${encodeURIComponent(savedId)}`} aria-label="Your saved recording" /> : null}
    {clip && !savedId ? <button type="button" className="family-secondary" disabled={disabled || saving} onClick={() => void upload()}><Upload size={17} aria-hidden="true" />{saving ? "Saving recording…" : "Use this recording"}</button> : null}
    {savedId ? <p className="family-saved" role="status">Recording saved and ready to submit.</p> : null}
    {error ? <p className="family-error" role="alert">{error}</p> : null}
  </section>;
}

interface DrawingControlProps {
  sceneId: string;
  disabled: boolean;
  initialStrokes?: DrawingStroke[];
  guide?: string | null;
  onResponse: (response: { strokes: DrawingStroke[] }, ready: boolean) => void;
}

export function DrawingPreview({ strokes, label = "Saved drawing" }: { strokes: DrawingStroke[]; label?: string }) {
  return <svg viewBox="0 0 100 100" className="drawing-preview" role="img" aria-label={label}>
    {strokes.map((stroke, index) => <polyline key={index} points={stroke.map(point => `${point.x},${point.y}`).join(" ")} fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />)}
  </svg>;
}

export function DrawingControl({ sceneId, disabled, initialStrokes, guide, onResponse }: DrawingControlProps) {
  const [strokes, setStrokes] = useState<DrawingStroke[]>(initialStrokes ?? []);
  const [draft, setDraft] = useState<DrawingStroke>([]);
  const [pen, setPen] = useState<DrawingPoint>({ x: 50, y: 50 });
  const active = useRef<DrawingStroke | null>(null);
  function update(next: DrawingStroke[]) {
    active.current = null;
    setDraft([]);
    setStrokes(next);
    onResponse({ strokes: next }, next.some(stroke => stroke.reduce((length, point, index) => index ? length + Math.hypot(point.x - stroke[index - 1].x, point.y - stroke[index - 1].y) : length, 0) >= 1));
  }
  function point(event: React.PointerEvent<SVGSVGElement>): DrawingPoint {
    const bounds = event.currentTarget.getBoundingClientRect();
    return { x: Math.round(Math.max(0, Math.min(100, (event.clientX - bounds.left) / bounds.width * 100)) * 100) / 100,
      y: Math.round(Math.max(0, Math.min(100, (event.clientY - bounds.top) / bounds.height * 100)) * 100) / 100 };
  }
  function finish() {
    if (!active.current) return;
    const complete = active.current;
    active.current = null;
    setDraft([]);
    if (complete.length >= 2) update([...strokes, complete]);
  }
  return <section className="activity-family drawing-studio" aria-label="Drawing studio">
    {guide ? <p className="family-note">{guide}</p> : null}
    <p className="family-note" id={`drawing-instructions-${sceneId}`}>Draw with your finger, mouse, or pen. With a keyboard, use arrows to move the pen, Space to draw, and Enter to lift it.</p>
    <svg viewBox="0 0 100 100" className="drawing-surface" role="application" aria-label="Your drawing board" aria-describedby={`drawing-instructions-${sceneId}`} tabIndex={disabled ? -1 : 0}
      onPointerDown={event => { if (disabled || strokes.length >= 20 || strokes.reduce((total, stroke) => total + stroke.length, 0) >= 1999) return; event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); active.current = [point(event)]; setDraft(active.current); }}
      onPointerMove={event => { if (!active.current || disabled || active.current.length >= 200 || strokes.reduce((total, stroke) => total + stroke.length, active.current.length) >= 2000) return; const next = point(event); const previous = active.current.at(-1)!; if (Math.hypot(next.x - previous.x, next.y - previous.y) < 0.3) return; active.current = [...active.current, next]; setDraft(active.current); }}
      onPointerUp={finish} onPointerCancel={finish}
      onKeyDown={event => {
        if (disabled) return;
        if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
          event.preventDefault(); setPen(current => ({ x: Math.max(0, Math.min(100, current.x + (event.key === "ArrowRight" ? 2 : event.key === "ArrowLeft" ? -2 : 0))), y: Math.max(0, Math.min(100, current.y + (event.key === "ArrowDown" ? 2 : event.key === "ArrowUp" ? -2 : 0))) }));
        } else if (event.key === " " && strokes.length < 20 && strokes.reduce((total, stroke) => total + stroke.length, active.current?.length ?? 0) < 2000) {
          event.preventDefault(); active.current = [...(active.current ?? []), pen].slice(0, 200); setDraft(active.current);
        } else if (event.key === "Enter") { event.preventDefault(); finish(); }
      }}>
      <defs><pattern id={`drawing-grid-${sceneId}`} width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e6e9df" strokeWidth="0.35" /></pattern></defs>
      <rect width="100" height="100" fill={`url(#drawing-grid-${sceneId})`} />
      {[...strokes, ...(draft.length ? [draft] : [])].map((stroke, index) => <polyline key={index} points={stroke.map(value => `${value.x},${value.y}`).join(" ")} fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />)}
      <circle cx={pen.x} cy={pen.y} r="1" className="drawing-keyboard-pen" />
    </svg>
    <div className="family-actions">
      <button type="button" className="family-secondary" disabled={disabled || !strokes.length} onClick={() => update(strokes.slice(0, -1))}>Undo last stroke</button>
      <button type="button" className="family-secondary" disabled={disabled || !strokes.length} onClick={() => update([])}><RotateCcw size={16} aria-hidden="true" />Clear drawing</button>
    </div>
    <p className="family-note" aria-live="polite">{strokes.length} strokes saved. A parent will review your drawing.</p>
  </section>;
}
