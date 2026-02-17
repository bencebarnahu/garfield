import { createClient } from "@/lib/supabase/server"
import { ProfileScreen } from "@/components/screens/profile-screen"

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user!.id)
    .single()

  return <ProfileScreen profile={profile} userId={user!.id} email={user!.email ?? ""} />
}
