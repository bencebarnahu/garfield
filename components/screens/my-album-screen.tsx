"use client"

import { useCallback, useOptimistic, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { AlbumGrid } from "@/components/album-grid"
import { createClient } from "@/lib/supabase/client"
import type { StickerData } from "@/components/sticker-slot"
import { Copy } from "lucide-react"

interface Stats {
  total: number
  owned: number
  missing: number
  duplicates: number
}

interface MyAlbumScreenProps {
  userId: string
  stickers: StickerData[]
  stats: Stats
}

export function MyAlbumScreen({ userId, stickers, stats }: MyAlbumScreenProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [optimisticStickers, updateStickers] = useOptimistic(
    stickers,
    (current, updated: StickerData) =>
      current.map((s) =>
        s.sticker_number === updated.sticker_number ? updated : s
      )
  )

  const completionPercent = Math.round((stats.owned / stats.total) * 100)

  const handleTap = useCallback(
    async (sticker: StickerData) => {
      const newCount = sticker.owned_count + 1
      const updated = { ...sticker, owned_count: newCount }

      startTransition(() => {
        updateStickers(updated)
      })

      const supabase = createClient()
      await supabase
        .from("user_stickers")
        .update({ owned_count: newCount, updated_at: new Date().toISOString() })
        .eq("user_id", userId)
        .eq("sticker_number", sticker.sticker_number)

      router.refresh()
    },
    [userId, router, updateStickers]
  )

  const handleLongPress = useCallback(
    async (sticker: StickerData) => {
      if (sticker.owned_count <= 0) return
      const newCount = sticker.owned_count - 1
      const updated = { ...sticker, owned_count: newCount }

      startTransition(() => {
        updateStickers(updated)
      })

      const supabase = createClient()
      await supabase
        .from("user_stickers")
        .update({ owned_count: newCount, updated_at: new Date().toISOString() })
        .eq("user_id", userId)
        .eq("sticker_number", sticker.sticker_number)

      router.refresh()
    },
    [userId, router, updateStickers]
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">My Album</h2>
          <span className="text-sm font-medium text-muted-foreground">
            {stats.owned} / {stats.total}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <Progress value={completionPercent} className="h-3 flex-1" />
          <span className="text-sm font-bold text-primary">
            {completionPercent}%
          </span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Copy className="h-3.5 w-3.5 text-accent" />
          <span>
            Duplicates:{" "}
            <span className="font-semibold text-accent">{stats.duplicates}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-sticker-missing" />
          Missing
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-sticker-owned" />
          Owned
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-sticker-duplicate" />
          Duplicate
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Tap to add &middot; Long-press to remove
      </p>

      <AlbumGrid stickers={optimisticStickers} onTap={handleTap} onLongPress={handleLongPress} />
    </div>
  )
}
