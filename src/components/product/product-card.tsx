"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { useWishlist } from "@/hooks/use-wishlist"
import type { ProductWithCategory } from "@/types"

interface ProductCardProps {
  product: ProductWithCategory
}

export function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, addItem, removeItem } = useWishlist()
  const wishlisted = isInWishlist(product.id)

  const primaryImage = product.images[0]
  const secondaryImage = product.images[1]
  const lowestVariant = product.variants.reduce((min, v) =>
    v.price < min.price ? v : min
  , product.variants[0])
  const hasDiscount = lowestVariant?.comparePrice && lowestVariant.comparePrice > lowestVariant.price

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-white shadow-sm transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
      <Link href={`/products/${product.slug}`} className="block" scroll>
        {/* Image container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          {/* Primary image */}
          <Image
            src={primaryImage?.url || "/placeholder.svg"}
            alt={primaryImage?.alt || product.name}
            fill
            className="object-cover transition-all duration-500 group-hover:opacity-0"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {/* Secondary image on hover */}
          {secondaryImage && (
            <Image
              src={secondaryImage.url}
              alt={secondaryImage.alt}
              fill
              className="object-cover opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}

          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1.5 sm:left-3 sm:top-3">
            {product.featured && (
              <Badge variant="secondary" className="bg-neutral-100 text-xs font-normal text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">
                Featured
              </Badge>
            )}
            {hasDiscount && (
              <Badge className="bg-black text-xs font-normal text-white">
                Sale
              </Badge>
            )}
          </div>

          {/* Quick view overlay */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-black/80 py-3 text-center transition-transform duration-300 group-hover:translate-y-0">
            <span className="text-xs font-medium tracking-wide-luxury text-white">
              VIEW DETAILS
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 sm:p-4">
          <p className="text-[10px] text-muted-foreground sm:text-xs">{product.category.name}</p>
          <h3 className="mt-0.5 text-xs font-medium leading-snug sm:text-sm">{product.name}</h3>
          <div className="mt-1 flex items-center gap-1.5 sm:gap-2">
            <span className="text-xs font-medium sm:text-sm">
              {formatPrice(lowestVariant?.price ?? product.basePrice)}
            </span>
            {hasDiscount && (
              <span className="text-[10px] text-muted-foreground line-through sm:text-xs">
                {formatPrice(lowestVariant.comparePrice!)}
              </span>
            )}
          </div>
          {/* Color count hint */}
          {product.variants.length > 1 && (
            <p className="mt-0.5 text-[10px] text-muted-foreground sm:text-xs">
              {new Set(product.variants.map((v) => v.color)).size} colors available
            </p>
          )}
        </div>
      </Link>

      {/* Wishlist button */}
      <button
        onClick={(e) => {
          e.preventDefault()
          wishlisted ? removeItem(product.id) : addItem(product.id)
        }}
        className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-all hover:bg-white hover:scale-110 sm:right-3 sm:top-3 sm:h-8 sm:w-8"
      >
        <Heart
          className={cn(
            "h-3.5 w-3.5 transition-colors sm:h-4 sm:w-4",
            wishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"
          )}
        />
      </button>
    </div>
  )
}
