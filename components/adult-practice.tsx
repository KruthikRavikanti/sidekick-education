"use client";
import { useCallback, useEffect, useState } from "react";
import { api, errorMessage } from "@/lib/account-api";
import { FormError } from "./account-ui";
import { ItemContext } from "./learning-practice";
interface AdultItem {
  assignmentItemId: string;
  assignmentId: string;
  purpose: string;
  question: string;
  context: unknown;
  expectedResponse: string;
  rubric: unknown;
  homeTip: string;
  readAloud: string | null;
}
export function AdultPractice({ kidId }: { kidId: string }) {
  const [items, setItems] = useState<AdultItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [independent, setIndependent] = useState(true);
  const [busy, setBusy] = useState(false);
  const load = useCallback(
    async (signal?: AbortSignal) => {
      const result = await api<{ items: AdultItem[] }>(
        `/api/learning/parent/${kidId}/adult`,
        { signal },
      );
      if (!signal?.aborted) {
        setItems(result.items);
        setLoaded(true);
      }
    },
    [kidId],
  );
  useEffect(() => {
    const c = new AbortController();
    void load(c.signal).catch((e) => {
      if (!c.signal.aborted) setError(errorMessage(e));
    });
    return () => c.abort();
  }, [load]);
  async function grade(item: AdultItem, correctness: string) {
    setBusy(true);
    setError(null);
    try {
      await api(`/api/learning/parent/${kidId}/adult/submit`, {
        method: "POST",
        body: {
          assignmentItemId: item.assignmentItemId,
          idempotencyKey: crypto.randomUUID(),
          correctness,
          independent,
          readAloud: !!item.readAloud,
        },
      });
      await load();
      setIndependent(true);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="dashboard-section">
      <h2>Try this together.</h2>
      <p>
        Some spoken, written, or hands-on responses need your observation. Read
        the full task and response guidance before recording what you saw.
      </p>
      <FormError message={error} />
      {!loaded && !error && <p role="status">Finding activities…</p>}
      {loaded && items.length === 0 && (
        <p>No activities are waiting for adult review.</p>
      )}
      {items.slice(0, 1).map((item) => (
        <article
          className="account-card adult-item"
          key={item.assignmentItemId}
        >
          {item.readAloud && (
            <p className="read-aloud-note">Read this aloud to your child.</p>
          )}
          <h3>{item.question}</h3>
          <ItemContext context={item.context} />
          <p>
            <strong>Expected response:</strong> {item.expectedResponse}
          </p>
          <p>
            <strong>What to look for:</strong>{" "}
            {typeof item.rubric === "string"
              ? item.rubric
              : String(
                  (item.rubric as Record<string, unknown>)?.rubric ||
                    "Compare the response with the expected response above. Mark unclear when you cannot confidently judge it.",
                )}
          </p>
          {item.homeTip && (
            <p>
              <strong>Home tip:</strong> {item.homeTip}
            </p>
          )}
          <label className="independence-check">
            <input
              type="checkbox"
              checked={independent}
              onChange={(e) => setIndependent(e.target.checked)}
            />
            My child answered independently. Reading the prompt aloud is okay.
          </label>
          <div className="adult-outcomes">
            <button
              className="button secondary"
              disabled={busy}
              onClick={() => void grade(item, "correct")}
            >
              Correct
            </button>
            <button
              className="button secondary"
              disabled={busy}
              onClick={() => void grade(item, "incorrect")}
            >
              Incorrect
            </button>
            <button
              className="text-button"
              disabled={busy}
              onClick={() => void grade(item, "ungraded")}
            >
              Unclear · keep pending
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}
