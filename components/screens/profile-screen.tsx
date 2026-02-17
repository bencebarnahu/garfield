"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { LogOut, Save, Loader2 } from "lucide-react"

interface ProfileData {
  id: string
  display_name: string
  avatar_url: string | null
  city: string | null
  country: string | null
}

interface ProfileScreenProps {
  profile: ProfileData | null
  userId: string
  email: string
}

export function ProfileScreen({ profile, userId, email }: ProfileScreenProps) {
  const router = useRouter()
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "")
  const [city, setCity] = useState(profile?.city ?? "")
  const [country, setCountry] = useState(profile?.country ?? "")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?"

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)

    const supabase = createClient()
    await supabase
      .from("users")
      .update({
        display_name: displayName,
        city: city || null,
        country: country || null,
      })
      .eq("id", userId)

    setSaving(false)
    setSaved(true)
    router.refresh()
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSave} className="rounded-2xl bg-card p-4 shadow-sm">
        <h2 className="text-lg font-bold text-foreground">Profile</h2>

        <div className="mt-4 flex flex-col items-center gap-3">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-primary text-2xl font-semibold text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <div>
            <Label htmlFor="display-name" className="text-sm font-medium text-foreground">
              Display Name
            </Label>
            <Input
              id="display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1.5 rounded-xl"
              required
            />
          </div>
          <div>
            <Label htmlFor="city" className="text-sm font-medium text-foreground">City</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Sao Paulo"
              className="mt-1.5 rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="country" className="text-sm font-medium text-foreground">Country</Label>
            <Input
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. Brazil"
              className="mt-1.5 rounded-xl"
            />
          </div>

          <Button type="submit" className="w-full gap-2 rounded-xl" disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </Button>
          {saved && (
            <p className="text-center text-sm text-primary">Profile updated!</p>
          )}
        </div>
      </form>

      <Button
        variant="outline"
        className="w-full gap-2 rounded-2xl py-5 text-destructive hover:bg-destructive hover:text-destructive-foreground"
        onClick={handleSignOut}
      >
        <LogOut className="h-4 w-4" />
        Log Out
      </Button>
    </div>
  )
}
