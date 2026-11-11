"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, Check, Volume2 } from "lucide-react";
import { api, errorMessage } from "@/lib/account-api";
import type { PracticeItem, PracticeSession } from "@/lib/learning-types";
import { AccountShell, FormError } from "./account-ui";
import { RequireMode } from "./account-session";

export function ItemContext({ context }: { context: unknown }) {
  if (
    !context ||
    (typeof context === "object" && Object.keys(context).length === 0)
  )
    return null;
  if (typeof context === "string")
    return <div className="practice-context">{context}</div>;
  const data = context as Record<string, unknown>;
  const text = (value: unknown): string => {
    if (typeof value === "string") return value;
    if (value && typeof value === "object") {
      const row = value as Record<string, unknown>;
      return text(row.text || row.content || row.description || row.passage);
    }
    return "";
  };
  const pieces = Object.entries(data)
    .filter(([key]) => !["missing", "dependencies"].includes(key))
    .flatMap(([, value]) =>
      Array.isArray(value) ? value.map(text) : [text(value)],
    )
    .filter(Boolean);
  return pieces.length ? (
    <div className="practice-context">
      {pieces.map((piece, i) => (
        <p key={i}>{piece}</p>
      ))}
    </div>
  ) : null;
}

function optionsFor(spec: Record<string, unknown>) {
  const source = spec.options || spec.items || [];
  return Array.isArray(source)
    ? source.map((option, i) =>
        typeof option === "string"
          ? { id: option, label: option }
          : {
              id: String(option.id ?? i),
              label: String(option.label ?? option.text ?? option.id ?? i),
            },
      )
    : [];
}

function ResponseInput({
  item,
  value,
  setValue,
}: {
  item: PracticeItem;
  value: unknown;
  setValue: (value: unknown) => void;
}) {
  const spec = item.responseSpec;
  const kind = String(spec.kind || spec.type || "short_text");
  const options = optionsFor(spec);
  if (
    kind === "number" &&
    Array.isArray(spec.fields) &&
    (spec.fields.length > 1 || spec.fields.some((field) => field.unit))
  ) {
    const fields = spec.fields as {
      id: string;
      label: string;
      unit?: string;
    }[];
    const values = Array.isArray(value)
      ? (value as { value: string; unit?: string }[])
      : fields.map(() => ({ value: "", unit: "" }));
    return (
      <div className="practice-number-fields">
        {fields.map((field, i) => (
          <div key={field.id}>
            <label>
              {field.label}
              <input
                required
                inputMode="text"
                maxLength={200}
                value={values[i]?.value || ""}
                onChange={(event) => {
                  const next = [...values];
                  next[i] = { ...next[i], value: event.target.value };
                  setValue(next);
                }}
              />
            </label>
            {field.unit && (
              <label>
                Unit
                <input
                  required
                  maxLength={60}
                  value={values[i]?.unit || ""}
                  onChange={(event) => {
                    const next = [...values];
                    next[i] = { ...next[i], unit: event.target.value };
                    setValue(next);
                  }}
                />
              </label>
            )}
          </div>
        ))}
      </div>
    );
  }
  if (kind === "choice")
    return (
      <fieldset className="practice-choices">
        <legend>Your answer</legend>
        {options.map((option) => (
          <label key={option.id}>
            <input
              type="radio"
              name="practice-choice"
              checked={value === option.id}
              onChange={() => setValue(option.id)}
            />
            {option.label}
          </label>
        ))}
      </fieldset>
    );
  if (kind === "ordering") {
    const order = Array.isArray(value)
      ? (value as string[])
      : options.map((option) => option.id);
    const move = (index: number, direction: number) => {
      const next = [...order];
      [next[index], next[index + direction]] = [
        next[index + direction],
        next[index],
      ];
      setValue(next);
    };
    return (
      <div>
        <p>Put these in order, then submit.</p>
        <ol className="practice-order">
          {order.map((id, i) => (
            <li key={id}>
              <span>
                {options.find((option) => option.id === id)?.label || id}
              </span>
              <button
                type="button"
                className="icon-button"
                aria-label={`Move ${id} up`}
                disabled={i === 0}
                onClick={() => move(i, -1)}
              >
                <ArrowUp size={16} />
              </button>
              <button
                type="button"
                className="icon-button"
                aria-label={`Move ${id} down`}
                disabled={i === order.length - 1}
                onClick={() => move(i, 1)}
              >
                <ArrowDown size={16} />
              </button>
            </li>
          ))}
        </ol>
        <button
          type="button"
          className="text-button"
          onClick={() => setValue(order)}
        >
          Keep this order
        </button>
      </div>
    );
  }
  if (kind === "matching") {
    const left = Array.isArray(spec.left)
      ? (spec.left as { id: string; label: string }[])
      : [];
    const right = Array.isArray(spec.right)
      ? (spec.right as { id: string; label: string }[])
      : [];
    const matches =
      value && typeof value === "object"
        ? (value as Record<string, string>)
        : {};
    return (
      <div className="practice-matching">
        {left.map((option) => (
          <label key={option.id}>
            {option.label}
            <select
              value={matches[option.id] || ""}
              onChange={(event) =>
                setValue({ ...matches, [option.id]: event.target.value })
              }
            >
              <option value="">Choose a match</option>
              {right.map((match) => (
                <option key={match.id} value={match.id}>
                  {match.label}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
    );
  }
  if (kind === "number_line") {
    const graph = (spec.graph || {}) as Record<string, unknown>;
    const numeric = (n: unknown) => {
      const parts = String(n).split("/");
      return parts.length === 2
        ? Number(parts[0]) / Number(parts[1])
        : Number(n);
    };
    const point =
      value && typeof value === "object"
        ? (value as { value: string }).value
        : String(graph.min ?? 0);
    return (
      <div>
        <label>
          Your point on the number line
          <input
            type="range"
            min={numeric(graph.min ?? 0)}
            max={numeric(graph.max ?? 10)}
            step={numeric(graph.step ?? 1)}
            value={point}
            onChange={(event) => setValue({ value: event.target.value })}
          />
          <output>{point}</output>
        </label>
        <button
          type="button"
          className="text-button"
          onClick={() => setValue({ value: point })}
        >
          Use this point
        </button>
      </div>
    );
  }
  if (kind === "graph") {
    const graph = (spec.graph || {}) as { pointCount?: number };
    const points =
      value && typeof value === "object"
        ? (value as { points?: string[][] }).points || []
        : [];
    return (
      <div className="practice-coordinates">
        <p>
          Enter the coordinates of your point
          {Number(graph.pointCount) > 1 ? "s" : ""}.
        </p>
        {Array.from(
          { length: Math.max(1, Math.min(8, Number(graph.pointCount) || 1)) },
          (_, i) => (
            <div key={i}>
              {["x", "y"].map((axis, j) => (
                <label key={axis}>
                  {axis} coordinate {i + 1}
                  <input
                    required
                    inputMode="decimal"
                    value={points[i]?.[j] || ""}
                    onChange={(event) => {
                      const next = points.map((p) => [...p]);
                      while (next.length <= i) next.push(["", ""]);
                      next[i][j] = event.target.value;
                      setValue({ points: next });
                    }}
                  />
                </label>
              ))}
            </div>
          ),
        )}
        <svg viewBox="0 0 120 120" role="img" aria-label="Coordinate grid">
          <path d="M10 60H110M60 10V110" stroke="currentColor" />
          {points.map((point, i) =>
            point[0] &&
            point[1] &&
            Number.isFinite(Number(point[0])) &&
            Number.isFinite(Number(point[1])) ? (
              <circle
                key={i}
                cx={60 + Number(point[0]) * 5}
                cy={60 - Number(point[1]) * 5}
                r="3"
                fill="currentColor"
              />
            ) : null,
          )}
        </svg>
      </div>
    );
  }
  return (
    <label htmlFor="practice-response">
      Your answer
      {kind === "short_text" ? (
        <textarea
          id="practice-response"
          required
          maxLength={4000}
          value={typeof value === "string" ? value : ""}
          onChange={(event) => setValue(event.target.value)}
        />
      ) : (
        <input
          id="practice-response"
          required
          inputMode="text"
          autoComplete="off"
          maxLength={300}
          placeholder="Fractions, decimals, or units are welcome"
          value={typeof value === "string" ? value : ""}
          onChange={(event) => setValue(event.target.value)}
        />
      )}
    </label>
  );
}

function PracticeContent() {
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [value, setValue] = useState<unknown>("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [help, setHelp] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [readAloud, setReadAloud] = useState(false);
  const requestKey = useRef(crypto.randomUUID());
  const timing = useRef({ previous: 0, seconds: 0, flushed: Date.now() });
  const load = useCallback(async (signal?: AbortSignal) => {
    const next = await api<PracticeSession>("/api/learning/kid/next", {
      method: "POST",
      signal,
    });
    if (!signal?.aborted) setSession(next);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal).catch((caught) => {
      if (!controller.signal.aborted) setError(errorMessage(caught));
    });
    return () => controller.abort();
  }, [load]);
  const item = session?.items[0];
  async function activity(finished = false) {
    if (!session?.sessionId) return;
    const seconds = Math.min(120, Math.floor(timing.current.seconds));
    timing.current.seconds -= seconds;
    timing.current.flushed = Date.now();
    await api(`/api/learning/kid/session/${session.sessionId}/activity`, {
      method: "POST",
      body: { activeSeconds: seconds, finished },
    }).catch(() => {});
  }
  function interact() {
    const now = Date.now();
    const elapsed = (now - timing.current.previous) / 1000;
    if (elapsed > 0 && elapsed < 30) timing.current.seconds += elapsed;
    timing.current.previous = now;
    if (now - timing.current.flushed > 15000) void activity();
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!item || busy) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const outcome = await api<{
        correctness: string;
        message: string;
        assignmentComplete: boolean;
      }>("/api/learning/kid/submit", {
        method: "POST",
        body: {
          assignmentItemId: item.assignmentItemId,
          idempotencyKey: requestKey.current,
          response: value,
          assistance: { hintUsed: help, answerRevealed: revealed, readAloud },
        },
      });
      setMessage(
        outcome.message ||
          (outcome.correctness === "correct"
            ? "Nice work. One little step at a time."
            : outcome.correctness === "ungraded"
              ? "A grown-up can help review this one."
              : "Thanks for trying. Let’s keep learning."),
      );
      if (outcome.correctness !== "ungraded") {
        await activity();
        await load();
        setValue("");
        setHelp(false);
        setRevealed(false);
        setReadAloud(false);
      }
      requestKey.current = crypto.randomUUID();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  }
  function speak() {
    if (!item) return;
    setReadAloud(true);
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      speechSynthesis.speak(new SpeechSynthesisUtterance(item.question));
    }
  }
  return (
    <AccountShell kind="kid">
      <section className="kid-welcome">
        <p className="account-eyebrow">ONE LITTLE STEP AT A TIME</p>
        <h1>Let’s practice.</h1>
        <p>Try your best. You can always ask a grown-up for support.</p>
      </section>
      <FormError message={error} />
      {message && (
        <p className="account-success" role="status">
          {message}
        </p>
      )}
      {!session && !error ? (
        <p role="status">Finding your next little step…</p>
      ) : item ? (
        <form
          className="account-card learning-item"
          onSubmit={submit}
          onPointerDown={(event) => {
            if (event.isTrusted) interact();
          }}
          onKeyDown={(event) => {
            if (event.isTrusted) interact();
          }}
        >
          <div className="section-heading">
            <span>{session?.items.length} steps in this session</span>
            <button type="button" className="text-button" onClick={speak}>
              <Volume2 size={17} aria-hidden="true" />
              Read aloud
            </button>
          </div>
          {item.readAloud && (
            <p className="read-aloud-note">Read this aloud to your child.</p>
          )}
          <h2>{item.question}</h2>
          <ItemContext context={item.context} />
          <ResponseInput
            key={item.assignmentItemId}
            item={item}
            value={value}
            setValue={setValue}
          />
          <div className="practice-assistance">
            <label>
              <input
                type="checkbox"
                checked={help}
                onChange={(event) => setHelp(event.target.checked)}
              />
              I got help working it out
            </label>
            <label>
              <input
                type="checkbox"
                checked={revealed}
                onChange={(event) => setRevealed(event.target.checked)}
              />
              I was shown the answer
            </label>
          </div>
          <button className="button primary" disabled={busy || value === ""}>
            {busy ? "Checking your response…" : "Submit answer"}
            <Check size={17} aria-hidden="true" />
          </button>
        </form>
      ) : (
        <section className="account-card">
          <h2>A little pause.</h2>
          <p>
            {session?.message ||
              "There’s no practice waiting right now. Start with your homework, or ask a grown-up to check your next step."}
          </p>
          <button
            className="text-button"
            onClick={() => {
              setError(null);
              void load().catch((caught) => setError(errorMessage(caught)));
            }}
          >
            Check again
          </button>
        </section>
      )}
      <Link
        className="text-button account-button-link"
        href="/kid"
        prefetch={false}
        onClick={() => void activity(true)}
      >
        Back home
      </Link>
    </AccountShell>
  );
}
export function LearningPractice() {
  return (
    <RequireMode mode="kid">
      <PracticeContent />
    </RequireMode>
  );
}
