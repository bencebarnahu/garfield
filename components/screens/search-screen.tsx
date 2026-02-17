"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserCard, type CollectorResult } from "@/components/user-card"
import { createClient } from "@/lib/supabase/client"
import { Search, Loader2 } from "lucide-react"

export function SearchScreen() {
  const searchParams = useSearchParams()
  const prefilledSticker = searchParams.get("sticker") ?? ""

  const [stickerNumber, setStickerNumber] = useState(prefilledSticker)
  const [nameQuery, setNameQuery] = useState("")
  const [cityQuery, setCityQuery] = useState("")
  const [results, setResults] = useState<CollectorResult[]>([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSearched(true)

    const supabase = createClient()
    const params: Record<string, string | number | null> = {
      p_query: nameQuery || null,
      p_city: cityQuery || null,
      p_sticker_number: stickerNumber ? parseInt(stickerNumber, 10) : null,
    }

    const { data, error } = await supabase.rpc("search_collectors", params)

    if (!error && data) {
      setResults(data as CollectorResult[])
    } else {
      setResults([])
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSearch} className="rounded-2xl bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">
            Search Collectors
          </h2>
        </div>
        <div className="mt-4 flex flex-col gap-4">
          <div>
            <Label htmlFor="name-query" className="text-sm font-medium text-foreground">
              Collector Name
            </Label>
            <Input
              id="name-query"
              type="text"
              placeholder="e.g. John"
              value={nameQuery}
              onChange={(e) => setNameQuery(e.target.value)}
              className="mt-1.5 rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="sticker-number" className="text-sm font-medium text-foreground">
              Has Duplicate of Sticker #
            </Label>
            <Input
              id="sticker-number"
              type="number"
              placeholder="e.g. 42"
              min={1}
              max={200}
              value={stickerNumber}
              onChange={(e) => setStickerNumber(e.target.value)}
              className="mt-1.5 rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="city-query" className="text-sm font-medium text-foreground">
              City
            </Label>
            <Input
              id="city-query"
              type="text"
              placeholder="e.g. Sao Paulo"
              value={cityQuery}
              onChange={(e) => setCityQuery(e.target.value)}
              className="mt-1.5 rounded-xl"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full gap-2 rounded-xl bg-primary py-5 text-primary-foreground"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Search
          </Button>
        </div>
      </form>

      {searched && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-muted-foreground">
            {results.length} collector{results.length !== 1 ? "s" : ""} found
          </p>
          {results.length === 0 ? (
            <div className="rounded-2xl bg-card p-8 text-center shadow-sm">
              <p className="text-muted-foreground">No collectors match your search criteria.</p>
            </div>
          ) : (
            results.map((collector) => (
              <UserCard key={collector.id} collector={collector} />
            ))
          )}
        </div>
      )}
    </div>
  )
}
