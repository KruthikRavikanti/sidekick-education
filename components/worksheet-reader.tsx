"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Camera,
  Check,
  ChevronLeft,
  FileImage,
  ImagePlus,
  LoaderCircle,
  ScanLine,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  X,
} from "lucide-react";
import type { Extraction } from "@/lib/extraction";
import { ExtractionResults } from "./extraction-results";
import { apiFetch } from "@/lib/account-api";
import { useAccountSession } from "./account-session";
import type { UploadRecord } from "@/lib/learning-types";
import { ActivitySuggestion } from "./activity-suggestion";

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp,application/pdf";
type Phase = "upload" | "reading" | "results";

export function WorksheetReader() {
  const { refresh } = useAccountSession();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("upload");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Extraction | null>(null);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [fixtureMode, setFixtureMode] = useState(false);
  const [sampleLoading, setSampleLoading] = useState(false);
  const [limits, setLimits] = useState({ maxBytes: MAX_BYTES, maxPages: 6 });
  const uploadRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const readRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/health", { signal: controller.signal, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setFixtureMode(data?.mode === "fixture"))
      .catch(() => {});
    apiFetch("/api/learning/upload-limits", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.maxBytes && data?.maxPages) setLimits(data);
      })
      .catch(() => {});
    return () => {
      controller.abort();
      controllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (phase === "results") document.getElementById("results-title")?.focus();
  }, [phase]);

  function selectFile(next: File | undefined) {
    if (!next) return;
    controllerRef.current?.abort();
    setError(null);
    setResult(null);
    setUploadId(null);
    setPhase("upload");
    if (next.size > limits.maxBytes) {
      setFile(null);
      setError(
        `That file is too large. Choose a file smaller than ${limits.maxBytes / 1024 / 1024} MB.`,
      );
      return;
    }
    if (next.type && !ACCEPT.split(",").includes(next.type)) {
      setFile(null);
      setError(
        "Choose a JPG, PNG, or WebP image, or a PDF. Other file types can’t be read yet.",
      );
      return;
    }
    if (next.size === 0) {
      setFile(null);
      setError("That file is empty. Try another photo.");
      return;
    }
    setFile(next);
    setTimeout(() => readRef.current?.focus(), 0);
  }

  function reset() {
    controllerRef.current?.abort();
    setPhase("upload");
    setFile(null);
    setResult(null);
    setUploadId(null);
    setError(null);
    if (uploadRef.current) uploadRef.current.value = "";
    if (cameraRef.current) cameraRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "instant" });
    setTimeout(() => headingRef.current?.focus(), 0);
  }

  async function loadSample(subject: "math" | "ela") {
    setSampleLoading(true);
    setError(null);
    try {
      const response = await fetch(`/samples/${subject}-worksheet.png`);
      if (!response.ok) throw new Error();
      selectFile(
        new File([await response.blob()], `${subject}-worksheet.png`, {
          type: "image/png",
        }),
      );
    } catch {
      setError("The sample couldn’t be loaded. Please try again.");
    } finally {
      setSampleLoading(false);
    }
  }

  async function readWorksheet() {
    if (!file || phase === "reading") return;
    const controller = new AbortController();
    controllerRef.current = controller;
    setPhase("reading");
    setError(null);
    const isPDF = file.type === "application/pdf";
    const timeout = setTimeout(
      () => controller.abort("timeout"),
      isPDF ? 600000 : 90000,
    );
    try {
      const body = new FormData();
      body.append("file", file);
      let response = await apiFetch(
        isPDF ? "/api/learning/kid/uploads" : "/api/extract",
        {
          method: "POST",
          body,
          signal: controller.signal,
        },
      );
      let data = await response.json().catch(() => null);
      let savedId = response.headers.get("X-Sidekick-Upload-Id");
      if (isPDF && response.ok && data?.id) {
        savedId = data.id;
        while (
          !data.extraction &&
          ["pending", "processing"].includes(data.state)
        ) {
          await new Promise<void>((resolve, reject) => {
            const abort = () => {
              clearTimeout(timer);
              reject(new DOMException("Aborted", "AbortError"));
            };
            const timer = setTimeout(() => {
              controller.signal.removeEventListener("abort", abort);
              resolve();
            }, 1500);
            if (controller.signal.aborted) abort();
            else
              controller.signal.addEventListener("abort", abort, {
                once: true,
              });
          });
          response = await apiFetch(`/api/learning/kid/uploads/${savedId}`, {
            signal: controller.signal,
          });
          data = await response.json().catch(() => null);
          if (!response.ok) break;
        }
        if (response.ok) {
          const record = data as UploadRecord;
          if (!record.extraction)
            throw new Error(
              typeof record.error === "object"
                ? record.error?.message
                : "The page couldn’t be read. Please retry.",
            );
          data = record.extraction;
        }
      }
      if (controller.signal.aborted || controllerRef.current !== controller)
        return;
      if (
        response.status === 401 ||
        response.status === 403 ||
        (response.status === 409 && data?.error?.code === "profile_changed")
      ) {
        await refresh(false);
        return;
      }
      if (!response.ok)
        throw new Error(
          data?.error?.message ||
            "We couldn’t read that page. Please try again or take a clearer photo.",
        );
      if (
        !data?.worksheet ||
        !Array.isArray(data.problems) ||
        !data.problems.length
      )
        throw new Error(
          "No problems could be read. Try a clearer photo with the whole page in view.",
        );
      setResult(data as Extraction);
      setUploadId(savedId);
      setPhase("results");
      window.scrollTo({ top: 0, behavior: "instant" });
    } catch (caught) {
      if (
        controllerRef.current !== controller ||
        (controller.signal.aborted && controller.signal.reason !== "timeout")
      )
        return;
      setError(
        controller.signal.reason === "timeout"
          ? "Reading took too long. Please retry or take a clearer photo."
          : caught instanceof Error && caught.message !== "Failed to fetch"
            ? caught.message
            : "Sidekick couldn’t connect. Check your connection and try again.",
      );
      setPhase("upload");
    } finally {
      clearTimeout(timeout);
    }
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a href="/" aria-label="Sidekick home">
          <img
            src="/sidekick-logo.svg"
            width="164"
            height="49"
            alt="Sidekick"
          />
        </a>
        <span className="header-note">
          <Sparkles size={15} aria-hidden="true" />
          Your learning sidekick
        </span>
        {fixtureMode && <span className="demo-tag">Sample mode</span>}
      </header>
      <main className={phase === "results" ? "main-results" : "main-upload"}>
        {phase === "results" && result ? (
          <div>
            <ExtractionResults
              result={result}
              onReset={reset}
              activity={
                uploadId ? (
                  <ActivitySuggestion key={uploadId} uploadId={uploadId} />
                ) : undefined
              }
            />
            {uploadId && (
              <p className="results-footnote">
                Your work is saved privately for your family. A parent can
                review or delete it from Student work.
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="upload-intro">
              <div className="little-label">
                <span className="tiny-spark">✳</span>LET’S MAKE SENSE OF IT
              </div>
              <h1 ref={headingRef} tabIndex={-1}>
                Big page.
                <br />
                <span>Little first step.</span>
              </h1>
              <p>
                Upload your Math or ELA work—a worksheet, quiz, or test.
                <br />
                We’ll read the questions and the work you’ve done.
              </p>
              <img
                className="intro-mascot"
                src="/sidekick-mascot.svg"
                width="154"
                height="154"
                alt=""
              />
            </div>
            <section
              className={`upload-card ${file ? "has-photo" : ""}`}
              aria-label="Upload work"
            >
              <div className="card-topline">
                <span className="step-dot">1</span>
                <span>
                  {phase === "reading"
                    ? "A little reading magic"
                    : file
                      ? "Looking good?"
                      : "Start with your work"}
                </span>
                <span className="page-label">PHOTO OR PDF</span>
              </div>
              {phase === "reading" ? (
                <div className="reading-state" role="status" aria-live="polite">
                  <div className="reading-picture">
                    {preview && file?.type !== "application/pdf" && (
                      <img src={preview} alt="Work being read" />
                    )}
                    <div className="scan-beam" />
                    <div className="reading-icon">
                      <ScanLine size={29} aria-hidden="true" />
                    </div>
                  </div>
                  <h2>Reading your work…</h2>
                  <p>
                    Finding the questions, answers,
                    <br />
                    and every little step.
                  </p>
                  <div className="reading-caption">
                    <LoaderCircle
                      size={16}
                      className="spinner"
                      aria-hidden="true"
                    />
                    This can take a moment
                  </div>
                  <button
                    className="text-button"
                    onClick={() => {
                      controllerRef.current?.abort();
                      setPhase("upload");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  {file && preview ? (
                    <div className="preview-area">
                      <div className="preview-toolbar">
                        <span>
                          <Check size={15} aria-hidden="true" />
                          {file.type === "application/pdf"
                            ? "PDF ready"
                            : "Photo ready"}
                        </span>
                        <button
                          className="icon-button"
                          onClick={reset}
                          aria-label="Remove photo"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      {file.type === "application/pdf" ? (
                        <div className="pdf-preview">
                          <strong>PDF</strong>
                          <p>
                            {file.name}
                            <br />
                            Up to {limits.maxPages} pages. Questions will stay
                            in page order.
                          </p>
                        </div>
                      ) : (
                        <img
                          className="worksheet-preview"
                          src={preview}
                          alt="Preview of your selected work"
                          onError={() => {
                            setFile(null);
                            setError(
                              "That image couldn’t be opened. Choose another photo.",
                            );
                          }}
                        />
                      )}
                      <p className="file-caption">
                        {file.name} · {(file.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                  ) : (
                    <div
                      className="upload-dropzone"
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => {
                        event.preventDefault();
                        if (!sampleLoading)
                          selectFile(event.dataTransfer.files[0]);
                      }}
                    >
                      <div
                        className="worksheet-illustration"
                        aria-hidden="true"
                      >
                        <div className="paper">
                          <span />
                          <span />
                          <div className="paper-equation">½ + ⅓</div>
                          <span />
                        </div>
                        <div className="camera-bubble">
                          <Camera size={24} strokeWidth={2} />
                        </div>
                        <span className="illustration-spark">✳</span>
                      </div>
                      <h2>A photo is all it takes.</h2>
                      <p>
                        Keep the whole page in view
                        <br />
                        and your writing nice and clear.
                      </p>
                      <span className="drop-hint">
                        You can drop an image here, too.
                      </span>
                    </div>
                  )}
                  {error && (
                    <div className="error-message" role="alert">
                      <TriangleAlert size={19} aria-hidden="true" />
                      <div>
                        <strong>Let’s try that again.</strong>
                        <p>{error}</p>
                      </div>
                    </div>
                  )}
                  <div className="upload-actions">
                    {file ? (
                      <>
                        <button
                          ref={readRef}
                          className="button primary"
                          onClick={readWorksheet}
                          disabled={sampleLoading}
                        >
                          Read my work
                          <ArrowRight size={20} aria-hidden="true" />
                        </button>
                        <div className="secondary-actions">
                          <button
                            className="text-button"
                            onClick={() => cameraRef.current?.click()}
                          >
                            <Camera size={17} aria-hidden="true" />
                            Retake photo
                          </button>
                          <button
                            className="text-button"
                            onClick={() => uploadRef.current?.click()}
                          >
                            <ImagePlus size={17} aria-hidden="true" />
                            Change image
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <button
                          className="button primary"
                          onClick={() => uploadRef.current?.click()}
                          disabled={sampleLoading}
                        >
                          <ImagePlus size={20} aria-hidden="true" />
                          Choose an image
                          <ArrowRight size={19} aria-hidden="true" />
                        </button>
                        <button
                          className="text-button camera-action"
                          onClick={() => cameraRef.current?.click()}
                          disabled={sampleLoading}
                        >
                          <Camera size={18} aria-hidden="true" />
                          Take a photo
                        </button>
                        <p className="file-types">
                          JPG, PNG, WebP, or PDF · Up to{" "}
                          {limits.maxBytes / 1024 / 1024} MB
                        </p>
                      </>
                    )}
                  </div>
                </>
              )}
              <input
                ref={uploadRef}
                className="visually-hidden"
                type="file"
                accept={ACCEPT}
                tabIndex={-1}
                disabled={phase === "reading" || sampleLoading}
                aria-label="Choose work image"
                onChange={(event) => {
                  selectFile(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
              <input
                ref={cameraRef}
                className="visually-hidden"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                capture="environment"
                tabIndex={-1}
                disabled={phase === "reading" || sampleLoading}
                aria-label="Take work photo"
                onChange={(event) => {
                  selectFile(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
            </section>
            <div className="below-card">
              <p className="privacy-note">
                <ShieldCheck size={16} aria-hidden="true" />
                Stored privately. A parent can delete uploads.
              </p>
              {phase !== "reading" && !file && (
                <div className="sample-section">
                  <span>Just taking a look? Try a sample.</span>
                  <div>
                    <button
                      onClick={() => loadSample("math")}
                      disabled={sampleLoading}
                      className="sample-button"
                    >
                      <FileImage size={15} aria-hidden="true" />
                      Fractions
                      <ArrowRight size={14} aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => loadSample("ela")}
                      disabled={sampleLoading}
                      className="sample-button"
                    >
                      <FileImage size={15} aria-hidden="true" />
                      Reading
                      <ArrowRight size={14} aria-hidden="true" />
                    </button>
                  </div>
                  {fixtureMode && (
                    <p className="sample-mode-note">
                      Sample mode uses pre-written results for these two images.
                    </p>
                  )}
                </div>
              )}
              {file && phase !== "reading" && (
                <button className="text-button back-button" onClick={reset}>
                  <ChevronLeft size={16} aria-hidden="true" />
                  Start over
                </button>
              )}
            </div>
          </>
        )}
      </main>
      <footer className="site-footer">
        <span className="footer-spark" aria-hidden="true">
          ✳
        </span>
        A little support. A lot of possibility.
      </footer>
    </div>
  );
}
