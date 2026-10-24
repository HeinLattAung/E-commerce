"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
export function SearchBar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const router = useRouter()
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])
  function close() {
    setOpen(false)
    triggerRef.current?.focus()
  }
  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`)
      setQuery("")
      close()
    }
  }
  return (
    <>
      <Button
        ref={triggerRef}
        variant="ghost"
        size="icon"
        aria-label="Search products"
        aria-expanded={open}
        aria-controls="store-search"
        onClick={() => setOpen(!open)}
      >
        <Search strokeWidth={1.6} />
      </Button>
      {open && (
        <div
          id="store-search"
          className="search-panel glass-surface"
          onKeyDown={(e) => {
            if (e.key === "Escape") close()
          }}
        >
          <form
            onSubmit={submit}
            role="search"
            className="flex items-center gap-3"
          >
            <Search className="size-5 shrink-0 text-muted-foreground" />
            <label htmlFor="product-search" className="sr-only">
              Search the collection
            </label>
            <input
              ref={inputRef}
              id="product-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try a jacket, bag or watch…"
              className="min-w-0 flex-1 bg-transparent py-3 text-base outline-none"
            />
            <Button
              type="submit"
              size="icon"
              aria-label="Submit search"
              disabled={!query.trim()}
            >
              <ArrowRight />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close search"
              onClick={close}
            >
              <X />
            </Button>
          </form>
          <p className="mt-2 text-xs text-muted-foreground">
            A little less searching. A little more finding.
          </p>
        </div>
      )}
    </>
  )
}
