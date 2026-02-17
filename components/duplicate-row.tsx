"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"
import type { StickerData } from "./sticker-slot"

interface DuplicateRowProps {
  sticker: StickerData
}

export function DuplicateRow({ sticker }: DuplicateRowProps) {
  const extras = sticker.owned_count - 1
  return (
    <div className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sticker-duplicate font-bold text-sticker-duplicate-foreground">
          #{sticker.sticker_number}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            Sticker #{sticker.sticker_number}
          </p>
          <p className="text-xs text-muted-foreground">
            {extras} extra{extras > 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <Button size="sm" variant="outline" className="gap-1.5 rounded-xl" asChild>
        <Link href={`/search?sticker=${sticker.sticker_number}`}>
          <Users className="h-3.5 w-3.5" />
          Find Traders
        </Link>
      </Button>
    </div>
  )
}
