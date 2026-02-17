import { createClient } from "@/lib/supabase/server"
import { DuplicatesScreen } from "@/components/screens/duplicates-screen"

export default async function DuplicatesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: duplicates } = await supabase
    .from("user_stickers")
    .select("sticker_number, owned_count")
    .eq("user_id", user!.id)
    .gte("owned_count", 2)
    .order("sticker_number")

  return <DuplicatesScreen duplicates={duplicates ?? []} />
}
