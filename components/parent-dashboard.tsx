"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  Clock3,
  Flame,
  KeyRound,
  MessageCircle,
  Pencil,
  Plus,
  ShieldCheck,
  Target,
  Trash2,
  Users,
} from "lucide-react";
import { api, errorMessage } from "@/lib/account-api";
import type {
  AvatarKey,
  Conversation,
  DashboardData,
  Grade,
  KidProfile,
  SessionView,
} from "@/lib/account-types";
import { RequireMode, useAccountSession } from "./account-session";
import { GapInsights } from "./gap-insights";
import { HomeworkUploads } from "./homework-uploads";
import { AdultPractice } from "./adult-practice";
import {
  AccountShell,
  AVATARS,
  Avatar,
  FormError,
  LogoutButton,
} from "./account-ui";

type Tab =
  | "skills"
  | "analytics"
  | "conversations"
  | "profiles"
  | "settings"
  | "homework"
  | "together";
const tabs: { key: Tab; label: string }[] = [
  { key: "skills", label: "Skills" },
  { key: "analytics", label: "Analytics" },
  { key: "conversations", label: "Conversations" },
  { key: "homework", label: "Homework" },
  { key: "together", label: "Try this together" },
  { key: "profiles", label: "Children" },
  { key: "settings", label: "Settings" },
];

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

function LearningViews({ data, tab }: { data: DashboardData; tab: Tab }) {
  const [transcript, setTranscript] = useState<Conversation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);
  async function viewConversation(id: string) {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    setError(null);
    try {
      const next = await api<Conversation>(
        `/api/parent/conversations/${data.profile.id}/${id}`,
        { signal: controller.signal },
      );
      if (!controller.signal.aborted) setTranscript(next);
    } catch (caught) {
      if (!controller.signal.aborted) setError(errorMessage(caught));
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }
  if (tab === "skills")
    return <GapInsights skills={data.skills} kidId={data.profile.id} />;
  if (tab === "analytics") {
    const metrics = [
      {
        title: "Sessions this week",
        value: data.analytics.sessionsThisWeek,
        icon: <Flame size={20} />,
      },
      {
        title: "Time spent",
        value: `${data.analytics.timeSpentMinutes} min`,
        icon: <Clock3 size={20} />,
      },
      {
        title: "Problems attempted",
        value: data.analytics.problemsAttempted,
        icon: <Target size={20} />,
      },
      {
        title: "Problems correct",
        value: data.analytics.problemsCorrect,
        icon: <Check size={20} />,
      },
      {
        title: "Problems ungraded",
        value: data.analytics.problemsUngraded ?? 0,
        icon: <Clock3 size={20} />,
      },
    ];
    return (
      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>A little progress adds up.</h2>
            <p>
              {data.profile.firstName}’s sessions and active time this week.
              Problem totals cover all recorded practice, checks, and rechecks.
            </p>
          </div>
        </div>
        <div className="analytics-grid">
          {metrics.map((metric) => (
            <article key={metric.title} className="metric-card">
              <span aria-hidden="true">{metric.icon}</span>
              <strong>{metric.value}</strong>
              <p>{metric.title}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }
  if (tab === "conversations")
    return (
      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>Homework conversations</h2>
            <p>
              Homework uploads and practice don’t create tutoring chat.
              Conversations will appear when that milestone is available.
            </p>
          </div>
        </div>
        {data.conversations.length === 0 && (
          <p>No homework-help conversations yet.</p>
        )}
        <FormError message={error} />
        {transcript ? (
          <div className="transcript">
            <button className="text-button" onClick={() => setTranscript(null)}>
              <ChevronLeft size={15} aria-hidden="true" />
              All conversations
            </button>
            <h3>{transcript.title}</h3>
            <p className="conversation-time">
              {new Date(transcript.startedAt * 1000).toLocaleString()}
            </p>
            <div className="transcript-messages">
              {transcript.messages.map((message, index) => (
                <div
                  key={index}
                  className={`transcript-message message-${message.role}`}
                >
                  <strong>
                    {message.role === "student"
                      ? data.profile.firstName
                      : "Sidekick"}
                  </strong>
                  <p>{message.text}</p>
                  <time>
                    {new Date(message.timestamp * 1000).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="conversation-list">
            {data.conversations.map((conversation) => (
              <article className="conversation-card" key={conversation.id}>
                <span className="conversation-icon">
                  <MessageCircle size={21} aria-hidden="true" />
                </span>
                <div>
                  <h3>{conversation.title}</h3>
                  <time>
                    {new Date(conversation.startedAt * 1000).toLocaleString()}
                  </time>
                  <p>{conversation.preview}</p>
                  <button
                    className="text-button"
                    disabled={loading}
                    onClick={() => void viewConversation(conversation.id)}
                  >
                    View transcript
                    <span className="visually-hidden">
                      : {conversation.title}
                    </span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    );
  return null;
}

function ParentContent() {
  const { session, accept, activity } = useAccountSession();
  const [profiles, setProfiles] = useState<KidProfile[]>([]);
  const [selected, setSelected] = useState("");
  const [tab, setTab] = useState<Tab>("skills");
  const [data, setData] = useState<DashboardData | null>(null);
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
          if (!next.profiles.length) setTab("profiles");
          setLoaded(true);
        }
      })
      .catch((caught) => {
        if (active) setError(errorMessage(caught));
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [session?.version]);
  useEffect(() => {
    setData(null);
    setError(null);
    if (!selected || !["skills", "analytics", "conversations"].includes(tab))
      return;
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
  }, [selected, tab, session?.version]);
  const effectiveTab =
    loaded && profiles.length === 0 && tab !== "settings" ? "profiles" : tab;
  return (
    <AccountShell kind="parent">
      <div
        onPointerDown={(event) => {
          if (event.isTrusted) activity();
        }}
        onKeyDown={(event) => {
          if (event.isTrusted) activity();
        }}
      >
        <section className="dashboard-intro">
          <div>
            <p className="account-eyebrow">
              THEIR LITTLE STEPS. YOUR BIG PICTURE.
            </p>
            <h1>
              Your family’s learning,
              <br />a little clearer.
            </h1>
            <p>A place to notice progress and find the next bit of support.</p>
          </div>
          {profiles.length > 0 && (
            <label className="child-selector">
              Choose child
              <select
                value={selected}
                onChange={(event) => setSelected(event.target.value)}
              >
                {profiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.firstName}
                  </option>
                ))}
              </select>
            </label>
          )}
        </section>
        <nav className="dashboard-tabs" aria-label="Parent dashboard views">
          {tabs.map((item) => (
            <button
              key={item.key}
              className={effectiveTab === item.key ? "selected" : ""}
              aria-current={effectiveTab === item.key ? "page" : undefined}
              onClick={() => setTab(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <FormError message={error} />
        {effectiveTab === "profiles" ? (
          <ProfileManagement
            profiles={profiles}
            reload={async (id) => {
              if (session) accept(session);
              await reload(id);
            }}
          />
        ) : effectiveTab === "settings" ? (
          <ParentSettings />
        ) : effectiveTab === "homework" ? (
          selected ? (
            <HomeworkUploads key={selected} kidId={selected} />
          ) : null
        ) : effectiveTab === "together" ? (
          selected ? (
            <AdultPractice key={selected} kidId={selected} />
          ) : null
        ) : (
          <>
            <div className="sample-insights-label">
              <span>Learning activity</span>
              <p>
                Based on recorded homework and practice. Skills without enough
                eligible evidence remain unassessed.
              </p>
            </div>
            {data ? (
              <LearningViews key={`${selected}:${tab}`} data={data} tab={tab} />
            ) : (
              !error && (
                <p className="dashboard-loading" role="status">
                  Gathering the little details…
                </p>
              )
            )}
          </>
        )}
      </div>
    </AccountShell>
  );
}

export function ParentDashboard() {
  return (
    <RequireMode mode="parent">
      <ParentContent />
    </RequireMode>
  );
}
