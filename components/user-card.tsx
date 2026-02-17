"use client"

import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MapPin, Eye } from "lucide-react"

export interface CollectorResult {
  id: string
  display_name: string
  avatar_url: string | null
  city: string | null
  country: string | null
  owned_count: number
  duplicate_count: number
}

interface UserCardProps {
  collector: CollectorResult
}

export function UserCard({ collector }: UserCardProps) {
  const completion = Math.round((collector.owned_count / 200) * 100)
  const initials = collector.display_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold text-foreground">{collector.display_name}</p>
          {collector.city && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {collector.city}{collector.country ? `, ${collector.country}` : ""}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Progress value={completion} className="h-2 flex-1" />
        <span className="text-xs font-medium text-muted-foreground">
          {completion}%
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {collector.duplicate_count} duplicates
        </span>
        <Button
          size="sm"
          className="gap-1.5 rounded-xl bg-primary text-primary-foreground"
          asChild
        >
          <Link href={`/collector/${collector.id}`}>
            <Eye className="h-3.5 w-3.5" />
            View Album
          </Link>
        </Button>
      </div>
    </div>
  )
}
