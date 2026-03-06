"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function SearchBar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`)
      setQuery("")
      setOpen(false)
    }
  }

  return (
    <div className="relative flex items-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        className={cn(open && "hidden")}
      >
        <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
      </Button>

      {open && (
        <form onSubmit={handleSubmit} className="flex items-center gap-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              autoFocus
              className="h-8 w-32 pl-8 text-sm sm:w-40 md:w-56"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => { setOpen(false); setQuery("") }}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </form>
      )}
    </div>
  )
}
