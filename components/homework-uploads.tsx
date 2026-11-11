"use client";
import { useCallback, useEffect, useState } from "react";
import { api, apiFetch, errorMessage } from "@/lib/account-api";
import type { UploadRecord } from "@/lib/learning-types";
import { FormError } from "./account-ui";
import { ExtractionResults } from "./extraction-results";

export function HomeworkUploads({ kidId }: { kidId: string }) {
  const [uploads, setUploads] = useState<UploadRecord[]>([]);
  const [selected, setSelected] = useState<UploadRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const base = `/api/learning/parent/${kidId}/uploads`;
  const selectedId = selected?.id;
  const sampleAnalysis =
    selected?.stage === "analysis_pending" &&
    selected?.extraction?.source === "fixture";
  const processing =
    (selected?.state === "pending" || selected?.state === "processing") &&
    !sampleAnalysis;
  const load = useCallback(
    async (signal?: AbortSignal) => {
      const result = await api<{ uploads: UploadRecord[] } | UploadRecord[]>(
        `/api/learning/parent/${kidId}/uploads`,
        { signal },
      );
      if (!signal?.aborted)
        setUploads(Array.isArray(result) ? result : result.uploads);
    },
    [kidId],
  );
  useEffect(() => {
    const c = new AbortController();
    setSelected(null);
    setUploads([]);
    void load(c.signal).catch((e) => {
      if (!c.signal.aborted) setError(errorMessage(e));
    });
    return () => c.abort();
  }, [load]);
  useEffect(() => {
    if (!selectedId || !processing) return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    async function poll() {
      try {
        const record = await api<UploadRecord>(`${base}/${selectedId}`, {
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        setSelected(record);
        await load(controller.signal);
        if (record.state === "pending" || record.state === "processing")
          timer = setTimeout(() => void poll(), 1500);
      } catch (caught) {
        if (!controller.signal.aborted) setError(errorMessage(caught));
      }
    }
    timer = setTimeout(() => void poll(), 1000);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [base, selectedId, processing, load]);
  async function upload(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await apiFetch(base, {
        method: "POST",
        body,
        headers: { "Idempotency-Key": crypto.randomUUID() },
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.error?.message || "The worksheet couldn’t be processed.",
        );
      setSelected(data);
      await load();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  async function show(id: string) {
    setError(null);
    try {
      setSelected(await api<UploadRecord>(`${base}/${id}`));
    } catch (e) {
      setError(errorMessage(e));
    }
  }
  async function retry(id: string) {
    setBusy(true);
    setError(null);
    try {
      setSelected(
        await api<UploadRecord>(`${base}/${id}/retry`, { method: "POST" }),
      );
      await load();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    if (!deleting) return;
    setBusy(true);
    try {
      await api(`${base}/${deleting}`, { method: "DELETE" });
      setSelected(null);
      setDeleting(null);
      await load();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="dashboard-section">
      <div className="section-heading">
        <div>
          <h2>Homework, in order.</h2>
          <p>
            Upload a photo or bounded PDF for this child. Original writing stays
            separate from grading and skill observations.
          </p>
        </div>
      </div>
      <label className="button secondary upload-file-label">
        {busy ? "Saving worksheet…" : "Upload homework"}
        <input
          className="visually-hidden"
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          disabled={busy}
          onChange={(e) => {
            void upload(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </label>
      <FormError message={error} />
      <div className="homework-history">
        {uploads.map((item) => (
          <article key={item.id}>
            <div>
              <strong>
                {item.createdAt
                  ? new Date(item.createdAt * 1000).toLocaleString()
                  : "Worksheet"}
              </strong>
              <p>
                {item.pageCount ?? item.pages ?? 0} pages · {item.state}
              </p>
            </div>
            <button className="text-button" onClick={() => void show(item.id)}>
              View worksheet
            </button>
            <button
              className="text-button"
              onClick={() => setDeleting(item.id)}
            >
              Delete upload
            </button>
          </article>
        ))}
      </div>
      {uploads.length === 0 && !busy && (
        <p>No homework has been uploaded for this child yet.</p>
      )}
      {deleting && (
        <div
          className="delete-confirmation"
          role="alertdialog"
          aria-label="Delete homework upload"
        >
          <h3>Delete this upload?</h3>
          <p>
            The private file and its linked homework records will be removed.
            Learning states will be recalculated from remaining evidence.
          </p>
          <button
            className="button danger"
            disabled={busy}
            onClick={() => void remove()}
          >
            Confirm delete upload
          </button>
          <button className="text-button" onClick={() => setDeleting(null)}>
            Cancel
          </button>
        </div>
      )}
      {selected && (
        <section className="homework-details">
          <h3>Worksheet processing</h3>
          <p role="status" aria-live="polite">
            {selected.state} · {selected.stage}
            {processing ? " · Reading continues in the background…" : ""}
          </p>
          {selected.error && (
            <p>
              {typeof selected.error === "string"
                ? selected.error
                : selected.error.message}
            </p>
          )}
          <a
            className="account-link"
            href={`${base}/${selected.id}/file`}
            target="_blank"
            rel="noreferrer"
          >
            Open private original
          </a>
          {selected.state !== "completed" && !sampleAnalysis && (
            <button
              className="text-button"
              disabled={busy}
              onClick={() => void retry(selected.id)}
            >
              Retry processing
            </button>
          )}
          {selected.problems?.map((problem, i) => (
            <div className="homework-observation" key={problem.id}>
              <strong>Problem {i + 1}</strong>
              <p>
                {problem.grading?.correctness || "ungraded"}:{" "}
                {problem.grading?.explanation || "No confident grade yet."}
              </p>
              {problem.teacherConflict && (
                <p className="teacher-suggestion">
                  A visible teacher mark disagrees with the automatic check.
                  Please review this problem; it is excluded from assessment
                  evidence.
                </p>
              )}
            </div>
          ))}
          {selected.extraction && (
            <ExtractionResults
              result={selected.extraction}
              onReset={() => setSelected(null)}
            />
          )}
        </section>
      )}
    </section>
  );
}
