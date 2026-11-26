"use client";

import Link from "next/link";
import { ChevronLeft, LogOut, ShieldCheck, Users } from "lucide-react";
import type { AvatarKey } from "@/lib/account-types";
import { useAccountSession } from "./account-session";
import { useState } from "react";
import { errorMessage } from "@/lib/account-api";

export const AVATARS: {
  key: AvatarKey;
  emoji: string;
  label: string;
  color: string;
}[] = [
  { key: "fox", emoji: "🦊", label: "Fox", color: "orange" },
  { key: "owl", emoji: "🦉", label: "Owl", color: "lime" },
  { key: "bear", emoji: "🐻", label: "Bear", color: "berry" },
  { key: "bunny", emoji: "🐰", label: "Bunny", color: "lime" },
  { key: "cat", emoji: "🐱", label: "Cat", color: "orange" },
  { key: "panda", emoji: "🐼", label: "Panda", color: "berry" },
];
export function Avatar({
  avatar,
  size = "normal",
}: {
  avatar: AvatarKey;
  size?: "small" | "normal" | "large";
}) {
  const preset = AVATARS.find((a) => a.key === avatar) || AVATARS[0];
  return (
    <span
      className={`kid-avatar avatar-${preset.color} avatar-${size}`}
      role="img"
      aria-label={preset.label}
    >
      {preset.emoji}
    </span>
  );
}

export function AccountShell({
  children,
  kind = "account",
  backHref,
}: {
  children: React.ReactNode;
  kind?: "account" | "kid" | "parent";
  backHref?: string;
}) {
  const { toPicker } = useAccountSession();
  const [error, setError] = useState<string | null>(null);
  return (
    <div className={`account-shell shell-${kind}`}>
      <header className="account-header">
        <Link href="/profiles" prefetch={false} aria-label="Sidekick home">
          <img
            src="/sidekick-logo.svg"
            width="164"
            height="49"
            alt="Sidekick"
          />
        </Link>
        <div className="account-header-actions">
          {kind === "parent" && (
            <span className="parent-mode-label">
              <ShieldCheck size={15} aria-hidden="true" />
              Parent mode
            </span>
          )}
          {kind !== "account" && (
            <button
              className="text-button"
              onClick={() =>
                void toPicker().catch((caught) =>
                  setError(errorMessage(caught)),
                )
              }
            >
              <Users size={16} aria-hidden="true" />
              Switch profile
            </button>
          )}
        </div>
      </header>
      <main className="account-main">
        {backHref && (
          <Link className="account-back" href={backHref} prefetch={false}>
            <ChevronLeft size={15} aria-hidden="true" />
            Back
          </Link>
        )}
        <FormError message={error} />
        {children}
      </main>
      <footer className="account-footer">
        A little support. A lot of possibility.
      </footer>
    </div>
  );
}

export function FormError({ message }: { message: string | null }) {
  return message ? (
    <p className="account-error" role="alert">
      {message}
    </p>
  ) : null;
}
export function FormSuccess({ message }: { message: string | null }) {
  return message ? (
    <p className="account-success" role="status">
      {message}
    </p>
  ) : null;
}
export function LogoutButton() {
  const { logout } = useAccountSession();
  const [error, setError] = useState<string | null>(null);
  return (
    <div>
      <button
        className="text-button"
        onClick={() =>
          void logout().catch((caught) => setError(errorMessage(caught)))
        }
      >
        <LogOut size={16} aria-hidden="true" />
        Log out
      </button>
      <FormError message={error} />
    </div>
  );
}
