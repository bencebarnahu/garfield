"use client"

import { useState } from "react"
import { Users, ChevronDown, ChevronUp, MapPin } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

interface MatchUser {
  id: string
  display_name: string
  username: string | null
  avatar_url: string | null
  city: string | null
  country: string | null
  match_count: number
  matching_stickers: number[]
}

interface MatchesScreenProps {
  matches: MatchUser[]
}

export function MatchesScreen({ matches }: MatchesScreenProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const totalNeeded = matches.length > 0
    ? new Set(matches.flatMap((m) => m.matching_stickers)).size
    : 0

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold text-foreground">Find Matches</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {matches.length === 0
            ? "No collectors found with stickers you need."
            : `${matches.length} collector${matches.length !== 1 ? "s" : ""} can help you with ${totalNeeded} sticker${totalNeeded !== 1 ? "s" : ""} you need.`}
        </p>
      </div>

      {matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-card p-10 text-center shadow-sm">
          <Users className="h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            Either your album is complete, or no other collectors have your missing stickers as duplicates yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {matches.map((match) => {
            const isExpanded = expandedId === match.id
            const initials = match.display_name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()

            return (
              <div
                key={match.id}
                className="rounded-2xl bg-card shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  className="flex w-full items-center gap-3 p-4 text-left"
                  onClick={() => setExpandedId(isExpanded ? null : match.id)}
                >
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={match.avatar_url ?? undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground truncate">
                        {match.display_name}
                      </span>
                      {match.username && (
                        <span className="text-xs text-muted-foreground">
                          @{match.username}
                        </span>
                      )}
                    </div>
                    {(match.city || match.country) && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>
                          {[match.city, match.country].filter(Boolean).join(", ")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
                      {match.match_count}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-border px-4 pb-4 pt-3">
                    <p className="mb-2 text-xs font-medium text-muted-foreground">
                      Stickers they can give you:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {match.matching_stickers.map((num) => (
                        <span
                          key={num}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary"
                        >
                          {num}
                        </span>
                      ))}
                    </div>
                    {match.username && (
                      <Link
                        href={`/${match.username}`}
                        className="mt-3 block text-center text-xs font-medium text-primary hover:underline"
                      >
                        View full album
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
