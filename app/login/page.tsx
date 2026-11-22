import { AuthPage } from "@/components/auth-pages";
import { safeActivityReturn } from "@/lib/activity-return";
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  return <AuthPage returnTo={safeActivityReturn((await searchParams).next)} />;
}
