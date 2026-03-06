"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, ArrowRight, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useWishlist } from "@/hooks/use-wishlist"
import { getProductsByIds } from "@/actions/product.actions"
import { formatPrice } from "@/lib/utils"
import type { ProductWithCategory } from "@/types"

export default function WishlistPage() {
  const { items, removeItem } = useWishlist()
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      if (items.length === 0) {
        setProducts([])
        setLoading(false)
        return
      }
      const result = await getProductsByIds(items)
      setProducts(result)
      setLoading(false)
    }
    fetchProducts()
  }, [items])

  return (
    <div className="container mx-auto px-4 pt-32 pb-16">
      <h1 className="font-serif text-3xl font-bold tracking-tight">Wishlist</h1>
      <p className="mt-1 text-muted-foreground">
        {items.length} {items.length === 1 ? "item" : "items"} saved
      </p>
      <Separator className="my-6" />

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: items.length || 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] rounded bg-muted" />
              <div className="mt-4 h-4 w-2/3 rounded bg-muted" />
              <div className="mt-2 h-4 w-1/3 rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <Heart className="h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-medium">Your wishlist is empty</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Save items you love to your wishlist.
          </p>
          <Button asChild className="mt-6">
            <Link href="/products">
              Browse Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => {
            const primaryImage = product.images[0]
            const lowestVariant = product.variants.reduce(
              (min, v) => (v.price < min.price ? v : min),
              product.variants[0]
            )

            return (
              <div key={product.id} className="group relative">
                <Link href={`/products/${product.slug}`} className="block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                    <Image
                      src={primaryImage?.url || "/placeholder.svg"}
                      alt={primaryImage?.alt || product.name}
                      fill
                      className="object-cover transition-all duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="mt-4 space-y-1">
                    <p className="text-xs text-muted-foreground">
                      {product.category.name}
                    </p>
                    <h3 className="text-sm font-medium leading-snug">
                      {product.name}
                    </h3>
                    <span className="text-sm font-medium">
                      {formatPrice(lowestVariant?.price ?? product.basePrice)}
                    </span>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                  onClick={() => removeItem(product.id)}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
