"use client";

import Link from "next/link";
import {
  BookOpen,
  ChevronLeft,
  MessageCircle,
  Sparkles,
  Users,
} from "lucide-react";
import { AccountShell, Avatar } from "./account-ui";
import { RequireMode, useAccountSession } from "./account-session";
import { WorksheetReader } from "./worksheet-reader";

function KidContent({ practice = false }: { practice?: boolean }) {
  const { session } = useAccountSession();
  const child = session!.activeKid!;
  return (
    <AccountShell kind="kid">
      <section className="kid-welcome">
        <Avatar avatar={child.avatarKey} size="large" />
        <p className="account-eyebrow">YOUR NEXT LITTLE STEP</p>
        <h1>
          {practice
            ? `Practice time, ${child.firstName}.`
            : `Hey, ${child.firstName}!`}
        </h1>
        <p>
          {practice
            ? "A little practice makes a big difference."
            : "What shall we work on today?"}
        </p>
      </section>
      {practice ? (
        <>
          <div className="practice-grid">
            <article className="account-card practice-card">
              <BookOpen size={29} aria-hidden="true" />
              <h2>Math practice</h2>
              <p>Personalized practice is coming soon.</p>
              <span className="coming-soon">Coming soon</span>
            </article>
            <article className="account-card practice-card">
              <Sparkles size={29} aria-hidden="true" />
              <h2>Reading & writing</h2>
              <p>New ways to build your ELA skills are on the way.</p>
              <span className="coming-soon">Coming soon</span>
            </article>
          </div>
          <p className="todo-note">
            TODO: generated practice and real skill mapping.
          </p>
          <Link
            className="text-button account-button-link"
            href="/kid"
            prefetch={false}
          >
            <ChevronLeft size={16} aria-hidden="true" />
            Back home
          </Link>
        </>
      ) : (
        <>
          <div className="kid-actions">
            <Link
              className="kid-action-card homework-action"
              href="/kid/homework"
              prefetch={false}
            >
              <span className="kid-action-icon">
                <BookOpen size={29} aria-hidden="true" />
              </span>
              <h2>Get help with my homework</h2>
              <p>Take a photo. Let’s read your worksheet.</p>
              <span className="kid-action-arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
            <Link
              className="kid-action-card practice-action"
              href="/kid/practice"
              prefetch={false}
            >
              <span className="kid-action-icon">
                <Sparkles size={29} aria-hidden="true" />
              </span>
              <h2>Practice my skills</h2>
              <p>A little more practice is coming soon.</p>
              <span className="coming-soon">Coming soon</span>
            </Link>
          </div>
          <section className="kid-chat-placeholder">
            <MessageCircle size={20} aria-hidden="true" />
            <div>
              <h2>Your homework chat is on its way.</h2>
              <p>For now, start by reading your worksheet.</p>
            </div>
            <input
              aria-label="Homework chat coming soon"
              disabled
              placeholder="Chat is coming soon"
            />
            <span className="todo-note">TODO: AI homework chat.</span>
          </section>
        </>
      )}
    </AccountShell>
  );
}
export function KidHome({ practice = false }: { practice?: boolean }) {
  return (
    <RequireMode mode="kid">
      <KidContent practice={practice} />
    </RequireMode>
  );
}

function HomeworkContent() {
  const { session, toPicker } = useAccountSession();
  return (
    <>
      <nav className="kid-reader-toolbar" aria-label="Homework navigation">
        <Link href="/kid" prefetch={false}>
          <ChevronLeft size={16} aria-hidden="true" />
          {session!.activeKid!.firstName}’s home
        </Link>
        <button
          className="text-button"
          onClick={() => void toPicker().catch(() => {})}
        >
          <Users size={16} aria-hidden="true" />
          Switch profile
        </button>
      </nav>
      <WorksheetReader key={session!.activeKidProfileId} />
    </>
  );
}
export function KidHomework() {
  return (
    <RequireMode mode="kid">
      <HomeworkContent />
    </RequireMode>
  );
}
