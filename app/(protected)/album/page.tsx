import { createClient } from "@/lib/supabase/server"
import { MyAlbumScreen } from "@/components/screens/my-album-screen"

export default async function AlbumPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: stickers }, { data: stats }] = await Promise.all([
    supabase
      .from("user_stickers")
      .select("sticker_number, owned_count")
      .eq("user_id", user!.id)
      .order("sticker_number"),
    supabase.rpc("get_album_stats", { p_user_id: user!.id }),
  ])

  return (
    <MyAlbumScreen
      userId={user!.id}
      stickers={stickers ?? []}
      stats={stats ?? { total: 200, owned: 0, missing: 200, duplicates: 0 }}
    />
  )
}
