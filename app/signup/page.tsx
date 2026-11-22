import { AuthPage } from "@/components/auth-pages";
import { safeActivityReturn } from "@/lib/activity-return";
export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  return <AuthPage signup returnTo={safeActivityReturn((await searchParams).next)} />;
}
