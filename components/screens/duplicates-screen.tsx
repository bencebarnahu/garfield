"use client"

import { DuplicateRow } from "@/components/duplicate-row"
import type { StickerData } from "@/components/sticker-slot"
import { Copy } from "lucide-react"

interface DuplicatesScreenProps {
  duplicates: StickerData[]
}

export function DuplicatesScreen({ duplicates }: DuplicatesScreenProps) {
  const totalExtras = duplicates.reduce((sum, d) => sum + (d.owned_count - 1), 0)

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Copy className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-bold text-foreground">My Duplicates</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          You have{" "}
          <span className="font-semibold text-accent">{totalExtras}</span>{" "}
          extra stickers across{" "}
          <span className="font-semibold text-accent">{duplicates.length}</span>{" "}
          numbers
        </p>
      </div>

      {duplicates.length === 0 ? (
        <div className="rounded-2xl bg-card p-8 text-center shadow-sm">
          <p className="text-muted-foreground">No duplicates yet. Keep collecting!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {duplicates.map((sticker) => (
            <DuplicateRow key={sticker.sticker_number} sticker={sticker} />
          ))}
        </div>
      )}
    </div>
  )
}
