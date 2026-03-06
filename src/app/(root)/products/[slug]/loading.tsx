import { Separator } from "@/components/ui/separator"
import { ProductGallerySkeleton } from "@/components/product/product-gallery"
import { ProductInfoSkeleton } from "@/components/product/product-info"

export default function ProductLoading() {
  return (
    <div className="container mx-auto px-4 py-8 lg:py-16">
      {/* Breadcrumb skeleton */}
      <div className="mb-8 flex items-center gap-1.5">
        <div className="h-3 w-8 animate-pulse bg-muted" />
        <span className="text-xs text-muted-foreground">/</span>
        <div className="h-3 w-8 animate-pulse bg-muted" />
        <span className="text-xs text-muted-foreground">/</span>
        <div className="h-3 w-16 animate-pulse bg-muted" />
        <span className="text-xs text-muted-foreground">/</span>
        <div className="h-3 w-32 animate-pulse bg-muted" />
      </div>

      {/* Product layout skeleton */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
        <ProductGallerySkeleton />
        <ProductInfoSkeleton />
      </div>

      {/* Reviews skeleton */}
      <div className="mt-16 lg:mt-24">
        <div className="h-8 w-48 animate-pulse bg-muted" />
        <Separator className="my-6" />
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="h-24 w-24 animate-pulse bg-muted" />
          <div className="flex-1 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-2.5 animate-pulse bg-muted" style={{ width: `${80 - i * 12}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
