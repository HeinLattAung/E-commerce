"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface CatalogControlsProps {
  categories: { id: string; name: string }[]
  category?: string
  query?: string
  sort: string
}
const sorts = [
  ["featured", "Recommended"],
  ["newest", "Newest first"],
  ["price-asc", "Price: low to high"],
  ["price-desc", "Price: high to low"],
  ["best-selling", "Best sellers"],
]
export function CatalogControls({
  categories,
  category,
  query,
  sort,
}: CatalogControlsProps) {
  const router = useRouter()
  function href(nextCategory: string | undefined, nextSort = sort) {
    const params = new URLSearchParams()
    if (nextCategory) params.set("category", nextCategory)
    if (query) params.set("q", query)
    if (nextSort !== "featured") params.set("sort", nextSort)
    return `/products${params.size ? `?${params}` : ""}`
  }
  return (
    <div className="catalog-controls glass-surface">
      <nav
        aria-label="Filter by collection"
        className="catalog-categories scrollbar-hide"
      >
        {[{ id: "", name: "All pieces" }, ...categories].map((item) => (
          <Link
            key={item.id}
            href={href(item.id || undefined)}
            aria-current={(category || "") === item.id ? "page" : undefined}
            className={cn(
              "catalog-filter",
              (category || "") === item.id && "catalog-filter-active",
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="flex shrink-0 items-center gap-2">
        <label htmlFor="catalog-sort" className="text-xs text-muted-foreground">
          Sort by
        </label>
        <select
          id="catalog-sort"
          value={sort}
          onChange={(e) => router.push(href(category, e.target.value))}
          className="min-h-11 max-w-full rounded-full border bg-background/70 px-3 text-xs outline-offset-4"
        >
          {sorts.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
