"use client"

import { Copy, CircleDashed } from "lucide-react"
import type { StickerData } from "@/components/sticker-slot"

interface ListsScreenProps {
  stickers: StickerData[]
}

export function ListsScreen({ stickers }: ListsScreenProps) {
  const needed = stickers
    .filter((s) => s.owned_count === 0)
    .sort((a, b) => a.sticker_number - b.sticker_number)

  const duplicates = stickers
    .filter((s) => s.owned_count > 1)
    .sort((a, b) => a.sticker_number - b.sticker_number)

  return (
    <div className="flex flex-col gap-6">
      {/* Needed section */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <CircleDashed className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-bold text-foreground">
            Needed
          </h2>
          <span className="ml-auto rounded-full bg-sticker-missing px-2.5 py-0.5 text-xs font-semibold text-sticker-missing-foreground">
            {needed.length}
          </span>
        </div>

        {needed.length === 0 ? (
          <div className="rounded-2xl bg-card p-8 text-center shadow-sm">
            <p className="text-muted-foreground">
              Album complete! You have every sticker.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {needed.map((s) => (
              <div
                key={s.sticker_number}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-sticker-missing text-xs font-semibold text-sticker-missing-foreground"
              >
                {s.sticker_number}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Duplicates section */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Copy className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-bold text-foreground">
            Duplicates
          </h2>
          <span className="ml-auto rounded-full bg-sticker-duplicate px-2.5 py-0.5 text-xs font-semibold text-sticker-duplicate-foreground">
            {duplicates.reduce((sum, d) => sum + (d.owned_count - 1), 0)}
          </span>
        </div>

        {duplicates.length === 0 ? (
          <div className="rounded-2xl bg-card p-8 text-center shadow-sm">
            <p className="text-muted-foreground">
              No duplicates yet. Keep collecting!
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {duplicates.map((s) => (
              <div
                key={s.sticker_number}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-sticker-duplicate text-xs font-semibold text-sticker-duplicate-foreground"
              >
                {s.sticker_number}
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[9px] font-bold text-background">
                  {s.owned_count - 1}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
