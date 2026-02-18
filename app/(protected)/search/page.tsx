import { createClient } from "@/lib/supabase/server"
import { MatchesScreen } from "@/components/screens/matches-screen"

export default async function MatchesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: matches } = await supabase.rpc("find_matches", {
    p_user_id: user!.id,
  })

  return <MatchesScreen matches={matches ?? []} />
}
