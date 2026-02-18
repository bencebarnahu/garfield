import { createClient } from "@/lib/supabase/server"
import { ListsScreen } from "@/components/screens/lists-screen"

export default async function ListsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ data: stickers }, { data: profile }] = await Promise.all([
    supabase
      .from("user_stickers")
      .select("sticker_number, owned_count")
      .eq("user_id", user!.id)
      .order("sticker_number"),
    supabase
      .from("users")
      .select("username")
      .eq("id", user!.id)
      .single(),
  ])

  return <ListsScreen stickers={stickers ?? []} username={profile?.username ?? null} />
}
