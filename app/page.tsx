import { redirect } from "next/navigation";
import { serverSession } from "@/lib/server-account";

export default async function Home() {
  const session = await serverSession();
  redirect(!session ? "/login" : session.mode === "kid" ? "/kid" : "/profiles");
}
