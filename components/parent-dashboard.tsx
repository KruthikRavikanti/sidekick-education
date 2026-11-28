"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  Check,
  KeyRound,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import { api, errorMessage } from "@/lib/account-api";
import type {
  AvatarKey,
  DashboardData,
  Grade,
  KidProfile,
  SessionView,
} from "@/lib/account-types";
import type { GameHistoryItem } from "@/lib/game-types";
import { RequireMode, useAccountSession } from "./account-session";
import { HomeworkUploads } from "./homework-uploads";
import { ParentGameHistory } from "./game-history";
import { SkillMap } from "./skill-map";
import { AVATARS, Avatar, FormError, LogoutButton } from "./account-ui";

function ChildEditor({
  profile,
  onSaved,
  onCancel,
}: {
  profile: KidProfile | null;
  onSaved: (id?: string) => Promise<void>;
  onCancel: () => void;
}) {
  const [firstName, setFirstName] = useState(profile?.firstName || "");
  const [grade, setGrade] = useState<Grade>(profile?.grade || "K");
  const [avatarKey, setAvatarKey] = useState<AvatarKey>(
    profile?.avatarKey || "fox",
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const child = await api<KidProfile>(
        `/api/parent/profiles${profile ? `/${profile.id}` : ""}`,
        {
          method: profile ? "PATCH" : "POST",
          body: { firstName: firstName.trim(), grade, avatarKey },
        },
      );
      await onSaved(child.id);
      onCancel();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="child-editor" onSubmit={submit}>
      <h3>
        {profile
          ? `Edit ${profile.firstName}’s profile`
          : "Add a little learner"}
      </h3>
      <label htmlFor="child-first-name">First name or nickname</label>
      <input
        id="child-first-name"
        required
        maxLength={40}
        value={firstName}
        autoComplete="off"
        onChange={(e) => setFirstName(e.target.value)}
      />
      <label htmlFor="child-grade">Grade</label>
      <select
        id="child-grade"
        value={grade}
        onChange={(e) => setGrade(e.target.value as Grade)}
      >
        {["K", "1", "2", "3", "4", "5"].map((value) => (
          <option key={value} value={value}>
            {value === "K" ? "Kindergarten" : `Grade ${value}`}
          </option>
        ))}
      </select>
      <fieldset className="avatar-fieldset">
        <legend>Choose an avatar</legend>
        <div
          className="avatar-options"
          role="radiogroup"
          aria-label="Choose an avatar"
        >
          {AVATARS.map((avatar) => (
            <button
              key={avatar.key}
              type="button"
              role="radio"
              aria-checked={avatarKey === avatar.key}
              aria-label={avatar.label}
              onClick={() => setAvatarKey(avatar.key)}
            >
              <Avatar avatar={avatar.key} size="small" />
              {avatarKey === avatar.key && (
                <Check size={13} aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      </fieldset>
      <FormError message={error} />
      <div className="form-actions">
        <button className="button primary" disabled={busy}>
          {busy ? "Saving…" : profile ? "Save changes" : "Add child"}
        </button>
        <button
          type="button"
          className="text-button"
          onClick={onCancel}
          disabled={busy}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function ProfileManagement({
  profiles,
  reload,
}: {
  profiles: KidProfile[];
  reload: (id?: string) => Promise<void>;
}) {
  const [editor, setEditor] = useState<KidProfile | "new" | null>(null);
  const [deleting, setDeleting] = useState<KidProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function remove() {
    if (!deleting) return;
    setBusy(true);
    setError(null);
    try {
      await api(`/api/parent/profiles/${deleting.id}`, { method: "DELETE" });
      setDeleting(null);
      await reload();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="dashboard-section">
      <div className="section-heading">
        <div>
          <h2>Your little learners</h2>
          <p>
            {profiles.length} of 6 profiles · First names or nicknames only.
          </p>
        </div>
        {!editor && (
          <button
            className="button secondary"
            disabled={profiles.length >= 6}
            onClick={() => setEditor("new")}
          >
            <Plus size={16} aria-hidden="true" />
            Add child
          </button>
        )}
      </div>
      <FormError message={error} />
      {editor && (
        <ChildEditor
          key={editor === "new" ? "new" : editor.id}
          profile={editor === "new" ? null : editor}
          onSaved={reload}
          onCancel={() => setEditor(null)}
        />
      )}
      {profiles.length === 0 && !editor && (
        <div className="dashboard-empty">
          <Users size={30} aria-hidden="true" />
          <h3>Room for your first learner.</h3>
          <p>Add a child to give them a home of their own.</p>
        </div>
      )}
      <div className="managed-profiles">
        {profiles.map((profile) => (
          <article key={profile.id} className="managed-profile">
            <Avatar avatar={profile.avatarKey} size="small" />
            <div>
              <h3>{profile.firstName}</h3>
              <p>
                {profile.grade === "K"
                  ? "Kindergarten"
                  : `Grade ${profile.grade}`}
              </p>
            </div>
            <button
              className="icon-button"
              aria-label={`Edit ${profile.firstName}`}
              onClick={() => setEditor(profile)}
            >
              <Pencil size={15} />
            </button>
            <button
              className="icon-button"
              aria-label={`Delete ${profile.firstName}`}
              onClick={() => setDeleting(profile)}
            >
              <Trash2 size={15} />
            </button>
          </article>
        ))}
      </div>
      {deleting && (
        <div
          className="delete-confirmation"
          role="alertdialog"
          aria-labelledby="delete-child-title"
        >
          <h3 id="delete-child-title">
            Delete {deleting.firstName}’s profile?
          </h3>
          <p>
            This removes the profile and closes sessions using it. You can’t
            undo this.
          </p>
          <div className="form-actions">
            <button
              className="button danger"
              onClick={() => void remove()}
              disabled={busy}
            >
              {busy ? "Deleting…" : "Confirm delete"}
            </button>
            <button
              className="text-button"
              onClick={() => setDeleting(null)}
              disabled={busy}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function ParentSettings() {
  const { accept } = useAccountSession();
  const [email, setEmail] = useState("");
  const [currentPin, setCurrentPin] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    api<{ email: string }>("/api/parent/settings", {
      signal: controller.signal,
    })
      .then((data) => setEmail(data.email))
      .catch((caught) => {
        if (!controller.signal.aborted) setError(errorMessage(caught));
      });
    return () => controller.abort();
  }, []);
  async function changePin(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    if (pin !== confirmPin) {
      setError("The PINs don’t match.");
      setBusy(false);
      return;
    }
    try {
      accept(
        await api<SessionView>("/api/parent/pin/change", {
          method: "POST",
          body: { currentPin, pin, confirmPin },
        }),
        false,
        "/parent/unlock",
      );
    } catch (caught) {
      setError(errorMessage(caught));
      setBusy(false);
    }
  }
  async function changePassword(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      accept(
        await api<SessionView>("/api/auth/password", {
          method: "POST",
          body: { currentPassword, newPassword },
        }),
        true,
        "/profiles",
      );
    } catch (caught) {
      setError(errorMessage(caught));
      setBusy(false);
    }
  }
  return (
    <section className="dashboard-section">
      <div className="section-heading">
        <div>
          <h2>Parent settings</h2>
          <p>{email}</p>
        </div>
        <LogoutButton />
      </div>
      <FormError message={error} />
      <div className="settings-grid">
        <form className="settings-form" onSubmit={changePin}>
          <h3>
            <KeyRound size={19} aria-hidden="true" />
            Change your PIN
          </h3>
          <p>A new PIN locks parent mode on every session.</p>
          <label htmlFor="current-pin">Current PIN</label>
          <input
            id="current-pin"
            type="password"
            inputMode="numeric"
            pattern="[0-9]{4,6}"
            minLength={4}
            maxLength={6}
            autoComplete="off"
            required
            value={currentPin}
            onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ""))}
          />
          <label htmlFor="settings-new-pin">New PIN</label>
          <input
            id="settings-new-pin"
            type="password"
            inputMode="numeric"
            pattern="[0-9]{4,6}"
            minLength={4}
            maxLength={6}
            autoComplete="off"
            required
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          />
          <label htmlFor="settings-confirm-pin">Confirm new PIN</label>
          <input
            id="settings-confirm-pin"
            type="password"
            inputMode="numeric"
            pattern="[0-9]{4,6}"
            minLength={4}
            maxLength={6}
            autoComplete="off"
            required
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
          />
          <button className="button primary" disabled={busy}>
            Change PIN
          </button>
        </form>
        <form className="settings-form" onSubmit={changePassword}>
          <h3>
            <ShieldCheck size={19} aria-hidden="true" />
            Change your password
          </h3>
          <p>This signs out other sessions and returns you to the picker.</p>
          <label htmlFor="current-password">Current password</label>
          <input
            id="current-password"
            type="password"
            autoComplete="current-password"
            required
            maxLength={128}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <label htmlFor="new-password">New password</label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            required
            maxLength={128}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button className="button primary" disabled={busy}>
            Change password
          </button>
        </form>
      </div>
    </section>
  );
}

type View = "map" | "work" | "games" | "family";
const views: { key: View; label: string }[] = [
  { key: "map", label: "Skill map" },
  { key: "work", label: "Work" },
  { key: "games", label: "Games" },
  { key: "family", label: "Family and settings" },
];

function gradeLabel(grade: Grade) {
  return grade === "K" ? "Kindergarten" : `Grade ${grade}`;
}

function WorkSummary({ data }: { data: DashboardData }) {
  const name = data.profile.firstName;
  const stats = [
    { label: "Questions read", value: data.analytics.problemsAttempted },
    { label: "Correct answers", value: data.analytics.problemsCorrect },
    { label: "Not graded yet", value: data.analytics.problemsUngraded ?? 0 },
  ];
  return (
    <section className="portal-hero portal-hero-lime">
      <div>
        <p className="portal-eyebrow">
          {name} · {gradeLabel(data.profile.grade)}
        </p>
        <h1>{name}’s work.</h1>
        <p>
          Each distinct question is counted once. Blank or unclear responses
          stay ungraded and never count for or against a skill.
        </p>
      </div>
      <dl className="portal-stats" aria-label="Uploaded work so far">
        {stats.map((stat) => (
          <div className="portal-stat" key={stat.label}>
            <dt>{stat.label}</dt>
            <dd>{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function ParentContent() {
  const { session, accept, activity, toPicker } = useAccountSession();
  const [profiles, setProfiles] = useState<KidProfile[]>([]);
  const [selected, setSelected] = useState("");
  const [view, setView] = useState<View>("map");
  const [data, setData] = useState<DashboardData | null>(null);
  const [games, setGames] = useState<GameHistoryItem[]>([]);
  const [review, setReview] = useState<{
    reviewer: boolean;
    waiting?: number;
  } | null>(null);
  const [stamp, setStamp] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reload = useCallback(async (id?: string) => {
    const next = await api<{ profiles: KidProfile[] }>("/api/parent/profiles");
    setProfiles(next.profiles);
    setSelected(
      (previous) =>
        id ||
        (next.profiles.some((p) => p.id === previous)
          ? previous
          : next.profiles[0]?.id || ""),
    );
    setLoaded(true);
  }, []);
  const refresh = useCallback(() => setStamp((value) => value + 1), []);
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    api<{ profiles: KidProfile[] }>("/api/parent/profiles", {
      signal: controller.signal,
    })
      .then((next) => {
        if (active) {
          setProfiles(next.profiles);
          setSelected(next.profiles[0]?.id || "");
          if (!next.profiles.length) setView("family");
          setLoaded(true);
        }
      })
      .catch((caught) => {
        if (active) setError(errorMessage(caught));
      });
    // Reviewers get a way into the review page from every screen of the portal.
    api<{ reviewer: boolean; waiting?: number }>("/api/games/review/me", {
      signal: controller.signal,
    })
      .then((next) => {
        if (active) setReview(next);
      })
      .catch(() => undefined);
    return () => {
      active = false;
      controller.abort();
    };
  }, [session?.version]);
  // Read the child's picture again whenever the child or the page changes, and after an upload changes.
  useEffect(() => {
    setData(null);
    setError(null);
  }, [selected, view]);
  useEffect(() => {
    if (!selected || (view !== "map" && view !== "work")) return;
    let active = true;
    const controller = new AbortController();
    api<DashboardData>(`/api/parent/dashboard/${selected}`, {
      signal: controller.signal,
    })
      .then((next) => {
        if (active) setData(next);
      })
      .catch((caught) => {
        if (active) setError(errorMessage(caught));
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [selected, view, stamp, session?.version]);
  useEffect(() => {
    setGames([]);
    if (!selected || view !== "map") return;
    const controller = new AbortController();
    // The map shows which game was played for a skill. Without it the map still works.
    api<{ runs: GameHistoryItem[] }>(
      `/api/games/parent/${encodeURIComponent(selected)}/history`,
      { signal: controller.signal },
    )
      .then((next) => {
        if (!controller.signal.aborted) setGames(next.runs);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [selected, view, session?.version]);
  const shown: View = loaded && profiles.length === 0 ? "family" : view;
  const loading = !error && (
    <p className="dashboard-loading" role="status">
      Gathering the little details…
    </p>
  );
  return (
    <div
      className="account-shell shell-parent portal"
      onPointerDown={(event) => {
        if (event.isTrusted) activity();
      }}
      onKeyDown={(event) => {
        if (event.isTrusted) activity();
      }}
    >
      <aside className="portal-side">
        <Link
          className="portal-logo"
          href="/profiles"
          prefetch={false}
          aria-label="Sidekick home"
        >
          <img
            src="/sidekick-logo.svg"
            width="164"
            height="49"
            alt="Sidekick"
          />
        </Link>
        {profiles.length > 0 && (
          <div className="portal-children" role="group" aria-label="Children">
            <p className="portal-label">Children</p>
            {profiles.map((profile) => (
              <button
                type="button"
                key={profile.id}
                className="portal-child"
                aria-pressed={profile.id === selected}
                onClick={() => setSelected(profile.id)}
              >
                <span aria-hidden="true">
                  <Avatar avatar={profile.avatarKey} size="small" />
                </span>
                <span>
                  {profile.firstName}
                  <small>{gradeLabel(profile.grade)}</small>
                </span>
              </button>
            ))}
          </div>
        )}
        <nav className="portal-nav" aria-label="Parent portal">
          {views.map((item) => (
            <button
              type="button"
              key={item.key}
              className={shown === item.key ? "selected" : ""}
              aria-current={shown === item.key ? "page" : undefined}
              onClick={() => setView(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        {review?.reviewer && (
          <Link className="portal-review" href="/parent/games" prefetch={false}>
            Review games
            <small>
              {review.waiting
                ? `${review.waiting} waiting for you`
                : "Nothing waiting right now"}
            </small>
          </Link>
        )}
        <div className="portal-session">
          <span className="parent-mode-label">
            <ShieldCheck size={15} aria-hidden="true" />
            Parent mode
          </span>
          <button
            type="button"
            className="text-button"
            onClick={() =>
              void toPicker().catch((caught) => setError(errorMessage(caught)))
            }
          >
            <Users size={16} aria-hidden="true" />
            Switch profile
          </button>
        </div>
      </aside>
      <main className="portal-main">
        <FormError message={error} />
        {shown === "family" ? (
          <>
            <ProfileManagement
              profiles={profiles}
              reload={async (id) => {
                if (session) accept(session);
                await reload(id);
              }}
            />
            <ParentSettings />
          </>
        ) : shown === "games" ? (
          selected ? (
            <ParentGameHistory
              key={`games:${selected}`}
              kidId={selected}
              profile={profiles.find((profile) => profile.id === selected)}
            />
          ) : null
        ) : shown === "work" ? (
          selected ? (
            <>
              {data ? <WorkSummary data={data} /> : loading}
              <HomeworkUploads
                key={selected}
                kidId={selected}
                onChange={refresh}
              />
            </>
          ) : null
        ) : data ? (
          <SkillMap
            key={selected}
            profile={data.profile}
            skills={data.skills}
            games={games}
            onUpload={() => setView("work")}
          />
        ) : (
          loading
        )}
      </main>
    </div>
  );
}

export function ParentDashboard() {
  return (
    <RequireMode mode="parent">
      <ParentContent />
    </RequireMode>
  );
}
