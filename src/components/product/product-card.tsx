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
    <div className="group relative">
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          {/* Primary image */}
          <Image
            src={primaryImage?.url || "/placeholder.svg"}
            alt={primaryImage?.alt || product.name}
            fill
            className="object-cover transition-all duration-500 group-hover:opacity-0"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {/* Secondary image on hover */}
          {secondaryImage && (
            <Image
              src={secondaryImage.url}
              alt={secondaryImage.alt}
              fill
              className="object-cover opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          )}

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.featured && (
              <Badge variant="secondary" className="bg-white/90 text-xs font-normal backdrop-blur-sm">
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
        <div className="mt-4 space-y-1">
          <p className="text-xs text-muted-foreground">{product.category.name}</p>
          <h3 className="text-sm font-medium leading-snug">{product.name}</h3>
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-sm font-medium">
              {formatPrice(lowestVariant?.price ?? product.basePrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(lowestVariant.comparePrice!)}
              </span>
            )}
          </div>
          {/* Color count hint */}
          {product.variants.length > 1 && (
            <p className="text-xs text-muted-foreground">
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
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-all hover:bg-white hover:scale-110"
      >
        <Heart
          className={cn(
            "h-4 w-4 transition-colors",
            wishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"
          )}
        />
      </button>
    </div>
  )
}
