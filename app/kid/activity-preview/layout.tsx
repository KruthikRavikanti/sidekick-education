import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { requireAccount } from "@/lib/server-account";
import "./preview.css";

export default async function ActivityPreviewLayout({ children }: { children: React.ReactNode }) {
  await requireAccount("kid");
  // The backend owns the development flag. No public build-time flag can enable it.
  const response = await fetch(
    `${process.env.BACKEND_URL || "http://127.0.0.1:8000"}/api/activity-programs/capabilities`,
    { headers: { Cookie: (await cookies()).toString() }, cache: "no-store" },
  );
  if (response.status === 404) notFound();
  if (!response.ok) throw new Error("The activity preview is unavailable.");
  return children;
}
