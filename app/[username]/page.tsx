import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Sticker } from "lucide-react"

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  return {
    title: `${username}'s Sticker Lists - Sticker Exchange`,
    description: `View ${username}'s needed and duplicate stickers.`,
  }
}

export default async function PublicListsPage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const supabase = await createClient()

  const { data } = await supabase.rpc("get_public_lists", {
    p_username: username.toLowerCase(),
  })

  if (!data || !data.user) {
    notFound()
  }

  const { user, needed, duplicates } = data as {
    user: { display_name: string; username: string; city: string | null; country: string | null }
    needed: number[]
    duplicates: { sticker_number: number; extra: number }[]
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-card px-4 py-4">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Sticker className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">{user.display_name}</h1>
            {user.city && (
              <p className="text-sm text-muted-foreground">
                {user.city}{user.country ? `, ${user.country}` : ""}
              </p>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-6 p-4">
        {/* Needed section */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Needed</h2>
            <span className="rounded-full bg-sticker-missing px-2.5 py-0.5 text-xs font-medium text-sticker-missing-foreground">
              {needed.length}
            </span>
          </div>
          {needed.length === 0 ? (
            <p className="text-sm text-muted-foreground">No stickers needed - album complete!</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {needed.map((num) => (
                <span
                  key={num}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-sticker-missing text-xs font-semibold text-sticker-missing-foreground"
                >
                  {num}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Duplicates section */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Duplicates</h2>
            <span className="rounded-full bg-sticker-duplicate px-2.5 py-0.5 text-xs font-medium text-sticker-duplicate-foreground">
              {duplicates.length}
            </span>
          </div>
          {duplicates.length === 0 ? (
            <p className="text-sm text-muted-foreground">No duplicate stickers to trade.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {duplicates.map(({ sticker_number, extra }) => (
                <span
                  key={sticker_number}
                  className="relative flex h-9 min-w-9 items-center justify-center rounded-lg bg-sticker-duplicate px-1.5 text-xs font-semibold text-sticker-duplicate-foreground"
                >
                  {sticker_number}
                  {extra > 1 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-0.5 text-[10px] font-bold text-background">
                      {extra}
                    </span>
                  )}
                </span>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
