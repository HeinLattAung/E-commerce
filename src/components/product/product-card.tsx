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
  const lowestVariant = product.variants.reduce(
    (min, v) => (v.price < min.price ? v : min),
    product.variants[0],
  )
  const hasDiscount =
    lowestVariant?.comparePrice &&
    lowestVariant.comparePrice > lowestVariant.price

  return (
    <div className="product-tile group relative">
      <Link href={`/products/${product.slug}`} className="block" scroll>
        {/* Image container */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
          {/* Primary image */}
          <Image
            src={primaryImage?.url || "/placeholder.svg"}
            alt={primaryImage?.alt || product.name}
            fill
            className={cn(
              "object-cover transition-all duration-500",
              secondaryImage && "group-hover:opacity-0",
            )}
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
              <Badge
                variant="secondary"
                className="bg-neutral-100 text-xs font-normal text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
              >
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
          <div className="absolute inset-x-3 bottom-3 hidden translate-y-16 rounded-xl bg-background/90 py-3 text-center backdrop-blur-md transition-transform duration-300 group-hover:translate-y-0 group-focus-within:translate-y-0 sm:block">
            <span className="text-xs font-medium tracking-wide-luxury text-foreground">
              VIEW DETAILS
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="px-0.5 py-4">
          <p className="text-[10px] text-muted-foreground sm:text-xs">
            {product.category.name}
          </p>
          <h3 className="mt-0.5 text-xs font-medium leading-snug sm:text-sm">
            {product.name}
          </h3>
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
              {new Set(product.variants.map((v) => v.color)).size} colors
              available
            </p>
          )}
        </div>
      </Link>

      {/* Wishlist button */}
      <button
        onClick={(e) => {
          e.preventDefault()
          if (wishlisted) removeItem(product.id)
          else addItem(product.id)
        }}
        aria-label={`${wishlisted ? "Remove" : "Save"} ${product.name} ${wishlisted ? "from" : "to"} wishlist`}
        aria-pressed={wishlisted}
        className="absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-background/85 backdrop-blur-md transition-colors hover:bg-background"
      >
        <Heart
          className={cn(
            "h-3.5 w-3.5 transition-colors sm:h-4 sm:w-4",
            wishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground",
          )}
        />
      </button>
    </div>
  )
}
