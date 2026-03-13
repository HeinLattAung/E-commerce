"use client"

import { useState, useMemo } from "react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { RatingStars } from "@/components/shared/rating-stars"
import { AddToCart } from "@/components/product/add-to-cart"
import { formatPrice } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { Truck, RotateCcw, Shield, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/hooks/use-wishlist"
import type { ProductWithReviews } from "@/types"

interface ProductInfoProps {
  product: ProductWithReviews
}

export function ProductInfo({ product }: ProductInfoProps) {
  const { isInWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlist()
  const wishlisted = isInWishlist(product.id)

  const colors = useMemo(
    () => [...new Set(product.variants.map((v) => v.color))],
    [product.variants]
  )
  const [selectedColor, setSelectedColor] = useState(colors[0] || "")

  const sizesForColor = useMemo(
    () => product.variants.filter((v) => v.color === selectedColor),
    [product.variants, selectedColor]
  )
  const [selectedSku, setSelectedSku] = useState(sizesForColor[0]?.sku || "")

  const activeVariant = product.variants.find((v) => v.sku === selectedSku) || sizesForColor[0]
  const price = activeVariant?.price ?? product.basePrice
  const comparePrice = activeVariant?.comparePrice
  const inStock = activeVariant ? activeVariant.stock - activeVariant.reservedStock > 0 : false
  const stockCount = activeVariant ? activeVariant.stock - activeVariant.reservedStock : 0

  // When color changes, select first available size
  const handleColorChange = (color: string) => {
    setSelectedColor(color)
    const firstForColor = product.variants.find((v) => v.color === color)
    if (firstForColor) setSelectedSku(firstForColor.sku)
  }

  return (
    <div className="space-y-6">
      {/* Category + rating */}
      <div>
        <p className="text-xs tracking-wide-luxury text-muted-foreground">
          {product.category.name.toUpperCase()}
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          {product.name}
        </h1>
        {product.numReviews > 0 && (
          <div className="mt-3 flex items-center gap-3">
            <RatingStars rating={product.rating} />
            <span className="text-sm text-muted-foreground">
              {product.numReviews} {product.numReviews === 1 ? "review" : "reviews"}
            </span>
          </div>
        )}
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-medium">{formatPrice(price)}</span>
        {comparePrice && comparePrice > price && (
          <>
            <span className="text-lg text-muted-foreground line-through">
              {formatPrice(comparePrice)}
            </span>
            <Badge variant="secondary" className="text-xs">
              {Math.round(((comparePrice - price) / comparePrice) * 100)}% off
            </Badge>
          </>
        )}
      </div>

      <Separator />

      {/* Color selector */}
      {colors.length > 1 && (
        <div>
          <p className="text-sm font-medium">
            Color: <span className="font-normal text-muted-foreground">{selectedColor}</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={cn(
                  "rounded-none border px-4 py-2 text-xs font-medium transition-all",
                  selectedColor === color
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:border-foreground"
                )}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size selector */}
      {sizesForColor.length > 0 && sizesForColor[0].size !== "One Size" && (
        <div>
          <p className="text-sm font-medium">
            Size: <span className="font-normal text-muted-foreground">{activeVariant?.size}</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {sizesForColor.map((variant) => {
              const available = variant.stock - variant.reservedStock > 0
              return (
                <button
                  key={variant.sku}
                  onClick={() => available && setSelectedSku(variant.sku)}
                  disabled={!available}
                  className={cn(
                    "relative min-w-[3rem] rounded-none border px-3 py-2 text-xs font-medium transition-all",
                    variant.sku === selectedSku
                      ? "border-foreground bg-foreground text-background"
                      : available
                      ? "border-border hover:border-foreground"
                      : "border-border text-muted-foreground/40 line-through cursor-not-allowed"
                  )}
                >
                  {variant.size}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Stock indicator */}
      <div className="text-sm">
        {inStock ? (
          <p className="text-emerald-600">
            {stockCount <= 5 ? `Only ${stockCount} left in stock` : "In stock"}
          </p>
        ) : (
          <p className="text-destructive">Out of stock</p>
        )}
      </div>

      {/* Add to cart + wishlist */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          {activeVariant && (
            <AddToCart
              product={product}
              variant={activeVariant}
              disabled={!inStock}
            />
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 flex-shrink-0"
          onClick={() =>
            wishlisted ? removeFromWishlist(product.id) : addToWishlist(product.id)
          }
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-colors",
              wishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"
            )}
          />
        </Button>
      </div>

      <Separator />

      {/* Trust badges */}
      <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Truck className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} />
          <span>Free shipping over $100</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <RotateCcw className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} />
          <span>30-day returns</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Shield className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} />
          <span>Authenticity guarantee</span>
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="text-sm font-medium">Description</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>
      </div>

      {/* Tags */}
      {product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="rounded-none text-xs font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

/* Skeleton for loading state */
export function ProductInfoSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-3 w-24 animate-pulse bg-muted" />
        <div className="mt-3 h-10 w-3/4 animate-pulse bg-muted" />
        <div className="mt-3 h-4 w-32 animate-pulse bg-muted" />
      </div>
      <div className="h-8 w-28 animate-pulse bg-muted" />
      <Separator />
      <div>
        <div className="h-4 w-16 animate-pulse bg-muted" />
        <div className="mt-3 flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 w-20 animate-pulse bg-muted" />
          ))}
        </div>
      </div>
      <div>
        <div className="h-4 w-16 animate-pulse bg-muted" />
        <div className="mt-3 flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 w-12 animate-pulse bg-muted" />
          ))}
        </div>
      </div>
      <div className="h-12 w-full animate-pulse bg-muted" />
    </div>
  )
}
