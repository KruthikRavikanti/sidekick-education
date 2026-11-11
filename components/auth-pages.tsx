"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { api, errorMessage } from "@/lib/account-api";
import type { SessionView } from "@/lib/account-types";
import { useAccountSession } from "./account-session";
import { AccountShell, FormError } from "./account-ui";

export function AuthPage({ signup = false }: { signup?: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { accept } = useAccountSession();
  const router = useRouter();
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const session = await api<SessionView>(
        `/api/auth/${signup ? "signup" : "login"}`,
        { method: "POST", body: { email, password } },
      );
      accept(session, true);
      router.replace("/profiles");
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  }
  return (
    <AccountShell>
      <div className="auth-layout">
        <div className="auth-story">
          <p className="account-eyebrow">LITTLE STEPS. BIG POSSIBILITIES.</p>
          <h1>
            A sidekick for them.
            <br />
            <span>A clearer view for you.</span>
          </h1>
          <p>One parent account. A space for every little learner.</p>
          <img
            src="/sidekick-mascot.svg"
            width="180"
            height="180"
            alt="Two friendly puzzle pieces"
          />
        </div>
        <section className="account-card auth-card">
          <div className="account-section-icon">
            <ShieldCheck size={24} aria-hidden="true" />
          </div>
          <h2>{signup ? "Let’s get your family started." : "Welcome back."}</h2>
          <p>
            {signup
              ? "Create your parent account, then add your children."
              : "Log in to choose who’s learning today."}
          </p>
          <form onSubmit={submit}>
            <label htmlFor="account-email">Email</label>
            <input
              id="account-email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="account-password">Password</label>
            <input
              id="account-password"
              type="password"
              autoComplete={signup ? "new-password" : "current-password"}
              required
              maxLength={128}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {signup && (
              <p className="field-help">
                Use a long, unique password. You’ll create a separate PIN for
                parent mode.
              </p>
            )}
            <FormError message={error} />
            <button className="button primary" disabled={busy}>
              {busy ? "One moment…" : signup ? "Create account" : "Log in"}
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </form>
          {!signup && (
            <Link
              href="/forgot-password"
              className="account-link"
              prefetch={false}
            >
              Forgot password?
            </Link>
          )}
          <p className="auth-switch">
            {signup ? "Already have an account?" : "New to Sidekick?"}{" "}
            <Link href={signup ? "/login" : "/signup"} prefetch={false}>
              {signup ? "Log in" : "Create an account"}
            </Link>
          </p>
        </section>
      </div>
    </AccountShell>
  );
}

export function RecoveryPage() {
  return (
    <AccountShell backHref="/login">
      <section className="account-card narrow-card">
        <div className="account-section-icon">
          <LockKeyhole size={24} aria-hidden="true" />
        </div>
        <h1>Password recovery</h1>
        <p>
          Email recovery is coming in a future update. Sidekick can’t send a
          reset email yet.
        </p>
        <p className="field-help">
          TODO: add secure, time-limited recovery links and email delivery.
        </p>
        <Link
          className="button primary account-button-link"
          href="/login"
          prefetch={false}
        >
          Back to log in
        </Link>
      </section>
    </AccountShell>
  );
}
