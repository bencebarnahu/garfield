import { createClient } from "@/lib/supabase/server"
import { PublicAlbumScreen } from "@/components/screens/public-album-screen"
import { notFound } from "next/navigation"

export default async function CollectorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase.rpc("get_public_album", { p_user_id: id })

  if (!data || !data.user) {
    notFound()
  }

  return <PublicAlbumScreen data={data} />
}
