"use client"

import { ProductCard } from "@/components/product/product-card"
import type { ProductWithCategory } from "@/types"

interface FeaturedProductsProps {
  products: ProductWithCategory[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (!products || products.length === 0) {
    return (
      <section className="container mx-auto px-4 py-20 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            Featured Pieces
          </h2>
          <p className="mt-3 text-muted-foreground">No products found.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-4 py-20 lg:py-28">
      {/* Section header */}
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium tracking-luxury text-muted-foreground">
          CURATED SELECTION
        </p>
        <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          Featured Pieces
        </h2>
        <p className="mt-3 text-muted-foreground">
          Handpicked by our editors for exceptional craft and timeless design.
        </p>
      </div>

      {/* Product grid */}
      <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <div key={product.id} className="fade-in-up">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}
