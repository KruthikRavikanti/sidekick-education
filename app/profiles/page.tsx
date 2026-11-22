import { ProfilePicker } from "@/components/profile-picker";
import { requireAccount } from "@/lib/server-account";
import { safeActivityReturn } from "@/lib/activity-return";
export default async function ProfilesPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const target = safeActivityReturn((await searchParams).next);
  // A parent following an activity link explicitly locks into the picker on
  // the client; no parent data or unlock is granted by the navigation target.
  await requireAccount(target ? undefined : "picker", target);
  return <ProfilePicker returnTo={target} />;
}
