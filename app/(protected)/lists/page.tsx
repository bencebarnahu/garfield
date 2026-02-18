import { createClient } from "@/lib/supabase/server"
import { ListsScreen } from "@/components/screens/lists-screen"

export default async function ListsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: stickers } = await supabase
    .from("user_stickers")
    .select("sticker_number, owned_count")
    .eq("user_id", user!.id)
    .order("sticker_number")

  return <ListsScreen stickers={stickers ?? []} />
}
