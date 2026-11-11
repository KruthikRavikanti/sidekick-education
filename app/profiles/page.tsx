import { ProfilePicker } from "@/components/profile-picker";
import { requireAccount } from "@/lib/server-account";
export default async function ProfilesPage() {
  await requireAccount("picker");
  return <ProfilePicker />;
}
