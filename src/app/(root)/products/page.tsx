import { getProducts } from "@/actions/product.actions"
import { getCategories } from "@/actions/category.actions"
import { ProductCard } from "@/components/product/product-card"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shop All",
  description: "Browse our full collection of premium goods",
}

interface Props {
  searchParams: Promise<{
    page?: string
    category?: string
    q?: string
    sort?: string
  }>
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const sort = params.sort || "featured"

  const [categories, { products, totalPages, currentPage }] = await Promise.all([
    getCategories(),
    getProducts({
      page,
      categoryId: params.category,
      query: params.q,
      sort,
    }),
  ])

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "newest", label: "Newest" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "best-selling", label: "Best Selling" },
  ]

  return (
    <div className="container mx-auto px-4 pt-32 pb-12 lg:pt-36 lg:pb-20">
      {/* Header */}
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium tracking-luxury text-muted-foreground">
          OUR COLLECTION
        </p>
        <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {params.q ? `Results for "${params.q}"` : "Shop All"}
        </h1>
      </div>

      {/* Filters bar */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        {/* Category filter */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/products"
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
              !params.category
                ? "border-foreground bg-foreground text-background"
                : "border-border hover:border-foreground"
            )}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.id}${params.sort ? `&sort=${params.sort}` : ""}`}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
                params.category === cat.id
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:border-foreground"
              )}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-muted-foreground sm:inline">Sort by:</span>
          <div className="flex flex-wrap gap-1">
            {sortOptions.map((opt) => (
              <Link
                key={opt.value}
                href={`/products?${params.category ? `category=${params.category}&` : ""}sort=${opt.value}`}
                className={cn(
                  "rounded-full px-3 py-1 text-xs transition-colors",
                  sort === opt.value
                    ? "bg-secondary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {opt.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="mt-6 text-sm text-muted-foreground">
        {products.length === 0
          ? "No products found"
          : `Showing ${products.length} ${products.length === 1 ? "piece" : "pieces"}`}
      </p>

      {/* Product grid */}
      {products.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/products?page=${p}${params.category ? `&category=${params.category}` : ""}${params.sort ? `&sort=${params.sort}` : ""}`}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full text-sm transition-colors",
                p === currentPage
                  ? "bg-foreground text-background"
                  : "border hover:border-foreground"
              )}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
