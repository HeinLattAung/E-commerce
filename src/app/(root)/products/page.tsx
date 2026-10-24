import { getProducts } from "@/actions/product.actions"
import { getCategories } from "@/actions/category.actions"
import { ProductCard } from "@/components/product/product-card"
import { CatalogRetry } from "@/components/product/catalog-retry"
import { CatalogControls } from "@/components/product/catalog-controls"
import Link from "next/link"
import { ArrowLeft, ArrowRight, PackageOpen } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The collection",
  description:
    "Explore clothing, bags, footwear and everyday essentials at LuxeStore.",
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
  const page = Math.max(1, Math.floor(Number(params.page) || 1))
  const sort = params.sort || "featured"
  let categories: Awaited<ReturnType<typeof getCategories>> = []
  let catalog: Awaited<ReturnType<typeof getProducts>> = {
    products: [],
    totalPages: 0,
    currentPage: page,
  }
  let unavailable = false
  try {
    ;[categories, catalog] = await Promise.all([
      getCategories(),
      getProducts({ page, categoryId: params.category, query: params.q, sort }),
    ])
  } catch (error) {
    unavailable = true
    console.error("Collection unavailable", {
      type: error instanceof Error ? error.name : "UnknownError",
    })
  }
  const { products, totalPages, currentPage } = catalog
  function pageHref(nextPage: number) {
    const query = new URLSearchParams()
    query.set("page", String(nextPage))
    if (params.q) query.set("q", params.q)
    if (params.category) query.set("category", params.category)
    if (params.sort) query.set("sort", params.sort)
    return `/products?${query}`
  }
  return (
    <main className="store-shell catalog-page">
      <Link href="/" className="text-link text-muted-foreground">
        <ArrowLeft className="size-3.5" /> Back to home
      </Link>
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">Considered, from the start</p>
          <h1>{params.q ? `Results for “${params.q}”` : "The collection."}</h1>
        </div>
        <p>
          Everyday pieces. A lasting place
          <br className="hidden sm:block" /> in your wardrobe.
        </p>
      </div>
      {!unavailable && (
        <CatalogControls
          categories={categories}
          category={params.category}
          query={params.q}
          sort={sort}
        />
      )}
      {products.length > 0 ? (
        <>
          <p className="my-6 text-xs text-muted-foreground">
            Showing {products.length}{" "}
            {products.length === 1 ? "piece" : "pieces"}
            {params.q && (
              <>
                {" "}
                ·{" "}
                <Link href="/products" className="underline underline-offset-4">
                  Clear search
                </Link>
              </>
            )}
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      ) : (
        <div role="status" className="catalog-empty glass-surface mt-8">
          <PackageOpen
            className="size-8 shrink-0 text-muted-foreground"
            strokeWidth={1.2}
          />
          <div>
            <h2 className="text-lg font-medium">
              {unavailable
                ? "We can't reach the collection just yet."
                : "No pieces found, for now."}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {unavailable
                ? "Please try again in a moment. Your saved pieces and bag are still here."
                : "Try a different search or explore another collection."}
            </p>
          </div>
          {unavailable ? (
            <CatalogRetry />
          ) : (
            <Link href="/products?sort=newest" className="text-link">
              Explore all pieces <ArrowRight className="size-4" />
            </Link>
          )}
        </div>
      )}
      {totalPages > 1 && (
        <nav
          aria-label="Product pages"
          className="mt-12 flex flex-wrap items-center justify-center gap-2"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={pageHref(p)}
              aria-label={`Page ${p}`}
              aria-current={p === currentPage ? "page" : undefined}
              className={`flex size-11 items-center justify-center rounded-full border text-sm ${p === currentPage ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
            >
              {p}
            </Link>
          ))}
        </nav>
      )}
    </main>
  )
}
