"use client"

import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlbumGrid } from "@/components/album-grid"
import { ArrowLeft, MapPin } from "lucide-react"

interface PublicAlbumData {
  user: {
    id: string
    display_name: string
    avatar_url: string | null
    city: string | null
    country: string | null
  }
  stickers: { sticker_number: number; owned: boolean }[]
  stats: {
    total: number
    owned: number
    completion: number
  }
}

interface PublicAlbumScreenProps {
  data: PublicAlbumData
}

export function PublicAlbumScreen({ data }: PublicAlbumScreenProps) {
  const { user, stickers, stats } = data

  const initials = user.display_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const gridStickers = stickers.map((s) => ({
    sticker_number: s.sticker_number,
    owned_count: s.owned ? 1 : 0,
  }))

  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="ghost"
        size="sm"
        className="w-fit gap-1.5 rounded-xl text-muted-foreground"
        asChild
      >
        <Link href="/search">
          <ArrowLeft className="h-4 w-4" />
          Back to Search
        </Link>
      </Button>

      <div className="rounded-2xl bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-primary text-lg font-semibold text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-foreground">
              {user.display_name}
            </h2>
            {user.city && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {user.city}{user.country ? `, ${user.country}` : ""}
              </div>
            )}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Progress value={stats.completion} className="h-2.5 flex-1" />
          <span className="text-sm font-bold text-primary">
            {stats.completion}%
          </span>
        </div>
        <div className="mt-3 flex gap-4">
          <div className="flex-1 rounded-xl bg-secondary p-3 text-center">
            <p className="text-lg font-bold text-foreground">
              {stats.total - stats.owned}
            </p>
            <p className="text-xs text-muted-foreground">Missing</p>
          </div>
          <div className="flex-1 rounded-xl bg-secondary p-3 text-center">
            <p className="text-lg font-bold text-primary">{stats.owned}</p>
            <p className="text-xs text-muted-foreground">Owned</p>
          </div>
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
      </div>

      <AlbumGrid stickers={gridStickers} readOnly />
    </div>
  )
}
