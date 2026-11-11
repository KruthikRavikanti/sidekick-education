"use client";

import Link from "next/link";
import { BookOpen, ChevronLeft, MessageCircle, Users } from "lucide-react";
import { AccountShell, Avatar } from "./account-ui";
import { RequireMode, useAccountSession } from "./account-session";
import { WorksheetReader } from "./worksheet-reader";

function KidContent() {
  const { session } = useAccountSession();
  const child = session!.activeKid!;
  return (
    <AccountShell kind="kid">
      <section className="kid-welcome">
        <Avatar avatar={child.avatarKey} size="large" />
        <p className="account-eyebrow">YOUR NEXT LITTLE STEP</p>
        <h1>Hey, {child.firstName}!</h1>
        <p>Let’s take a look at your homework.</p>
      </section>
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
      </section>
    </AccountShell>
  );
}
export function KidHome() {
  return (
    <RequireMode mode="kid">
      <KidContent />
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
