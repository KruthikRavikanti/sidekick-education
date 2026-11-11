"use client";

let csrf: string | null = null;
let csrfRequest: Promise<string> | null = null;
const pending = new Set<AbortController>();

export class APIError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

export function clearPrivateRequests() {
  for (const controller of pending) controller.abort();
  pending.clear();
}

export function clearCSRF() {
  csrf = null;
  csrfRequest = null;
}

async function csrfToken() {
  if (csrf) return csrf;
  if (!csrfRequest) {
    csrfRequest = fetch("/api/auth/csrf", {
      credentials: "same-origin",
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok)
          throw new APIError(
            response.status,
            "csrf_unavailable",
            "Sidekick couldn’t connect. Please try again.",
          );
        const data = await response.json();
        csrf = data.csrfToken;
        return data.csrfToken as string;
      })
      .finally(() => {
        csrfRequest = null;
      });
  }
  return csrfRequest;
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  const controller = new AbortController();
  const outerSignal = init.signal;
  // Keep the caller linked after response headers arrive: aborting a profile's
  // request must also abort a response body that is still streaming.
  const signal =
    outerSignal && typeof AbortSignal.any === "function"
      ? AbortSignal.any([controller.signal, outerSignal])
      : controller.signal;
  if (outerSignal && typeof AbortSignal.any !== "function") {
    const abort = () => controller.abort(outerSignal.reason);
    if (outerSignal.aborted) abort();
    else outerSignal.addEventListener("abort", abort, { once: true });
  }
  pending.add(controller);
  try {
    const headers = new Headers(init.headers);
    const method = (init.method || "GET").toUpperCase();
    if (!["GET", "HEAD", "OPTIONS"].includes(method))
      headers.set("X-CSRF-Token", await csrfToken());
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");
    return await fetch(path, {
      ...init,
      headers,
      credentials: "same-origin",
      cache: "no-store",
      signal,
    });
  } finally {
    pending.delete(controller);
  }
}

export async function api<T>(
  path: string,
  options: { method?: string; body?: unknown; signal?: AbortSignal } = {},
): Promise<T> {
  const response = await apiFetch(path, {
    method: options.method,
    signal: options.signal,
    ...(options.body !== undefined
      ? {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(options.body),
        }
      : {}),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    if (
      path !== "/api/auth/session" &&
      [
        "unauthenticated",
        "parent_required",
        "kid_required",
        "profile_changed",
      ].includes(data?.error?.code)
    ) {
      window.dispatchEvent(new Event("sidekick-auth-recheck"));
    }
    throw new APIError(
      response.status,
      data?.error?.code || "request_failed",
      data?.error?.message || "Something went wrong. Please try again.",
    );
  }
  return data as T;
}

export function errorMessage(error: unknown) {
  return error instanceof Error && error.name !== "AbortError"
    ? error.message
    : "Please try again.";
}
