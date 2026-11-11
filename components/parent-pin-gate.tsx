"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, LockKeyhole, ShieldCheck } from "lucide-react";
import { api, errorMessage } from "@/lib/account-api";
import type { PinGate, SessionView } from "@/lib/account-types";
import { RequireMode, useAccountSession } from "./account-session";
import { AccountShell, FormError, FormSuccess } from "./account-ui";

function PinContent() {
  const { session, accept } = useAccountSession();
  const router = useRouter();
  const [gate, setGate] = useState<PinGate | null>(null);
  const [reset, setReset] = useState(false);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    (async () => {
      if (session?.mode === "parent")
        accept(
          await api<SessionView>("/api/session/picker", {
            method: "POST",
            signal: controller.signal,
          }),
        );
      const next = await api<PinGate>("/api/parent/gate", {
        signal: controller.signal,
      });
      if (active) setGate(next);
    })().catch((caught) => {
      if (active) setError(errorMessage(caught));
    });
    return () => {
      active = false;
      controller.abort();
    };
  }, [accept]);

  const setup = gate?.pinSetupRequired || false;
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    if ((setup || reset) && pin !== confirmPin) {
      setError("The PINs don’t match.");
      setBusy(false);
      return;
    }
    try {
      const path = setup ? "setup" : reset ? "reset" : "verify";
      const next = await api<SessionView>(`/api/parent/pin/${path}`, {
        method: "POST",
        body: setup || reset ? { password, pin, confirmPin } : { pin },
      });
      accept(next);
      setPin("");
      setConfirmPin("");
      setPassword("");
      if (path === "verify") router.replace("/parent/dashboard");
      else {
        setGate(await api<PinGate>("/api/parent/gate"));
        setReset(false);
        setMessage("PIN saved. Enter your new PIN to open parent mode.");
      }
    } catch (caught) {
      setError(errorMessage(caught));
      const next = await api<PinGate>("/api/parent/gate").catch(() => null);
      if (next) setGate(next);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AccountShell backHref="/profiles">
      <section className="account-card pin-card">
        <div className="account-section-icon">
          <ShieldCheck size={26} aria-hidden="true" />
        </div>
        <p className="account-eyebrow">A SPACE JUST FOR PARENTS</p>
        <h1>
          {setup
            ? "Create your parent PIN."
            : reset
              ? "Reset your parent PIN."
              : "Welcome, parent."}
        </h1>
        <p>
          {setup
            ? "First, confirm your account password. Then choose a 4–6 digit PIN."
            : reset
              ? "Confirm your account password and choose a replacement PIN."
              : "Enter your PIN to see your family’s learning journey."}
        </p>
        {gate ? (
          <form onSubmit={submit}>
            {(setup || reset) && (
              <>
                <label htmlFor="pin-password">Account password</label>
                <input
                  id="pin-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  maxLength={128}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </>
            )}
            <label htmlFor="parent-pin">
              {setup || reset ? "New PIN" : "Parent PIN"}
            </label>
            <input
              id="parent-pin"
              className="pin-input"
              type="password"
              inputMode="numeric"
              autoComplete="off"
              pattern="[0-9]{4,6}"
              minLength={4}
              maxLength={6}
              required
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            />
            {(setup || reset) && (
              <>
                <label htmlFor="confirm-parent-pin">Confirm PIN</label>
                <input
                  id="confirm-parent-pin"
                  type="password"
                  inputMode="numeric"
                  autoComplete="off"
                  pattern="[0-9]{4,6}"
                  minLength={4}
                  maxLength={6}
                  required
                  value={confirmPin}
                  onChange={(e) =>
                    setConfirmPin(e.target.value.replace(/\D/g, ""))
                  }
                />
                <p className="field-help">
                  4–6 digits. Leading zeros are welcome.
                </p>
              </>
            )}
            <FormError message={error} />
            <FormSuccess message={message} />
            {gate.lockedUntil && gate.lockedUntil * 1000 > Date.now() && (
              <p className="account-error" role="status">
                PIN entry is locked until{" "}
                {new Date(gate.lockedUntil * 1000).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
                .
              </p>
            )}
            <button className="button primary" disabled={busy}>
              {busy
                ? "One moment…"
                : setup
                  ? "Save parent PIN"
                  : reset
                    ? "Reset PIN"
                    : "Enter parent mode"}
              <LockKeyhole size={17} aria-hidden="true" />
            </button>
          </form>
        ) : error ? (
          <FormError message={error} />
        ) : (
          <p role="status">Getting your parent gate ready…</p>
        )}
        {gate && !setup && (
          <button
            className="text-button"
            onClick={() => {
              setReset(!reset);
              setError(null);
              setMessage(null);
              setPin("");
              setConfirmPin("");
            }}
          >
            {reset ? (
              <>
                <ChevronLeft size={15} aria-hidden="true" />
                Back to PIN
              </>
            ) : (
              "Forgot PIN?"
            )}
          </button>
        )}
      </section>
    </AccountShell>
  );
}

export function ParentPinGate() {
  return (
    <RequireMode>
      <PinContent />
    </RequireMode>
  );
}
