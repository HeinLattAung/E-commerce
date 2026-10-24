import Link from "next/link"
import { ArrowUpRight, PackageOpen } from "lucide-react"
import { ProductCard } from "@/components/product/product-card"
import type { ProductWithCategory } from "@/types"
interface FeaturedProductsProps {
  products: ProductWithCategory[]
  unavailable?: boolean
}
export function FeaturedProducts({
  products,
  unavailable = false,
}: FeaturedProductsProps) {
  return (
    <section className="featured-section section-space">
      <div className="store-shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">On our radar</p>
            <h2>A few good finds.</h2>
          </div>
          <Link href="/products" className="text-link">
            View the collection <ArrowUpRight className="size-4" />
          </Link>
        </div>
        {products.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div role="status" className="catalog-empty glass-surface">
            <PackageOpen
              className="size-7 text-muted-foreground"
              strokeWidth={1.2}
            />
            <div>
              <h3 className="font-medium">
                {unavailable
                  ? "The edit is taking a moment."
                  : "Something good is on its way."}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {unavailable
                  ? "We couldn't load featured products right now. Please try again later."
                  : "There are no featured pieces right now. Explore the collections above."}
              </p>
            </div>
            <Link href="/#collections" className="text-link shrink-0">
              Explore collections <ArrowUpRight className="size-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
