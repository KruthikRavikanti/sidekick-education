"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Plus, ShieldCheck } from "lucide-react";
import { api, errorMessage } from "@/lib/account-api";
import type { PickerProfile } from "@/lib/account-types";
import { AccountShell, Avatar, FormError, LogoutButton } from "./account-ui";
import { RequireMode, useAccountSession } from "./account-session";

function PickerContent() {
  const { session, chooseKid } = useAccountSession();
  const [profiles, setProfiles] = useState<PickerProfile[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    if (session?.mode !== "picker") return;
    const controller = new AbortController();
    let active = true;
    api<{ profiles: PickerProfile[] }>("/api/profiles", {
      signal: controller.signal,
    })
      .then((data) => {
        if (active) {
          setProfiles(data.profiles);
          setLoaded(true);
        }
      })
      .catch((error) => {
        if (active) setError(errorMessage(error));
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [session?.mode, session?.version]);
  async function pick(id: string) {
    setBusy(true);
    setError(null);
    try {
      await chooseKid(id);
    } catch (caught) {
      setError(errorMessage(caught));
      setBusy(false);
    }
  }
  return (
    <AccountShell>
      <section className="picker-intro">
        <p className="account-eyebrow">ONE FAMILY. EVERY LITTLE LEARNER.</p>
        <h1>Who’s learning today?</h1>
        <p>Pick a profile and take the next little step.</p>
      </section>
      <FormError message={error} />
      <div className="profile-grid">
        {profiles.map((profile) => (
          <button
            key={profile.id}
            className="profile-tile"
            disabled={busy}
            onClick={() => void pick(profile.id)}
          >
            <Avatar avatar={profile.avatarKey} size="large" />
            <span>{profile.firstName}</span>
            <small>Let’s learn</small>
          </button>
        ))}
        <button
          className="profile-tile parent-tile"
          disabled={busy}
          onClick={() => router.push("/parent/unlock")}
        >
          <span className="parent-avatar">
            <ShieldCheck size={39} aria-hidden="true" />
          </span>
          <span>Parent</span>
          <small>
            <LockKeyhole size={12} aria-hidden="true" />
            PIN protected
          </small>
        </button>
      </div>
      {loaded && profiles.length === 0 && (
        <div className="empty-family">
          <Plus size={19} aria-hidden="true" />
          <p>
            Start in <strong>Parent</strong> to set your PIN and add your first
            child.
          </p>
        </div>
      )}
      <div className="picker-logout">
        <LogoutButton />
      </div>
    </AccountShell>
  );
}

export function ProfilePicker() {
  return (
    <RequireMode mode="picker">
      <PickerContent />
    </RequireMode>
  );
}
