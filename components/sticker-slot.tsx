"use client"

import { useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Check, Minus } from "lucide-react"

export interface StickerData {
  sticker_number: number
  owned_count: number
}

interface StickerSlotProps {
  sticker: StickerData
  readOnly?: boolean
  onTap?: (sticker: StickerData) => void
  onLongPress?: (sticker: StickerData) => void
}

export function StickerSlot({ sticker, readOnly, onTap, onLongPress }: StickerSlotProps) {
  const { sticker_number, owned_count } = sticker
  const state =
    owned_count === 0 ? "missing" : owned_count === 1 ? "owned" : "duplicate"

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isLongPress = useRef(false)

  const startPress = useCallback(() => {
    isLongPress.current = false
    timerRef.current = setTimeout(() => {
      isLongPress.current = true
      if (!readOnly && owned_count > 0) {
        onLongPress?.(sticker)
      }
    }, 500)
  }, [sticker, readOnly, owned_count, onLongPress])

  const endPress = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const handleClick = useCallback(() => {
    if (isLongPress.current) return
    onTap?.(sticker)
  }, [sticker, onTap])

  return (
    <button
      type="button"
      disabled={readOnly}
      onClick={handleClick}
      onPointerDown={readOnly ? undefined : startPress}
      onPointerUp={endPress}
      onPointerLeave={endPress}
      onContextMenu={(e) => e.preventDefault()}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl aspect-square text-sm font-semibold transition-all duration-150 select-none touch-manipulation",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        !readOnly && "active:scale-95 active:shadow-md",
        state === "missing" &&
          "bg-sticker-missing text-sticker-missing-foreground",
        state === "owned" &&
          "bg-sticker-owned text-sticker-owned-foreground shadow-sm",
        state === "duplicate" &&
          "bg-sticker-duplicate text-sticker-duplicate-foreground shadow-sm"
      )}
    >
      <span className="text-xs leading-none">{sticker_number}</span>
      {state === "owned" && (
        <Check className="mt-0.5 h-3 w-3" strokeWidth={3} />
      )}
      {state === "duplicate" && (
        <span className="mt-0.5 text-[10px] font-bold leading-none">
          {"x"}{owned_count}
        </span>
      )}
    </button>
  )
}
