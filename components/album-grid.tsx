"use client"

import { StickerSlot, type StickerData } from "./sticker-slot"

interface AlbumGridProps {
  stickers: StickerData[]
  readOnly?: boolean
  onTap?: (sticker: StickerData) => void
  onLongPress?: (sticker: StickerData) => void
}

export function AlbumGrid({ stickers, readOnly = false, onTap, onLongPress }: AlbumGridProps) {
  return (
    <div className="grid grid-cols-5 gap-2 md:grid-cols-6 lg:grid-cols-8">
      {stickers.map((sticker) => (
        <StickerSlot
          key={sticker.sticker_number}
          sticker={sticker}
          readOnly={readOnly}
          onTap={onTap}
          onLongPress={onLongPress}
        />
      ))}
    </div>
  )
}
