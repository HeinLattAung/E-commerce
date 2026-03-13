import { notFound } from "next/navigation"
import { Suspense } from "react"
import { Separator } from "@/components/ui/separator"
import { ProductGallery, ProductGallerySkeleton } from "@/components/product/product-gallery"
import { ProductInfo, ProductInfoSkeleton } from "@/components/product/product-info"
import { ProductReviews } from "@/components/product/product-reviews"
import { ProductCard } from "@/components/product/product-card"
import { getProductBySlug, getRelatedProducts } from "@/actions/product.actions"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: "Product Not Found" }

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      images: product.images[0]?.url ? [product.images[0].url] : [],
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const relatedProducts = await getRelatedProducts(product.id, product.categoryId)

  return (
    <div className="container mx-auto px-4 pt-32 pb-8 lg:pt-36 lg:pb-16">
      {/* Breadcrumb */}
      <nav className="mb-8 text-xs text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><a href="/" className="hover:text-foreground">Home</a></li>
          <li>/</li>
          <li><a href="/products" className="hover:text-foreground">Shop</a></li>
          <li>/</li>
          <li>
            <a href={`/categories/${product.category.slug}`} className="hover:text-foreground">
              {product.category.name}
            </a>
          </li>
          <li>/</li>
          <li className="text-foreground">{product.name}</li>
        </ol>
      </nav>

      {/* Main product layout */}
      <Suspense fallback={<ProductDetailSkeleton />}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} />
          <ProductInfo product={product} />
        </div>
      </Suspense>

      {/* Reviews */}
      <div className="mt-16 lg:mt-24">
        <h2 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">
          Customer Reviews
        </h2>
        <Separator className="my-6" />
        <ProductReviews
          reviews={product.reviews}
          rating={product.rating}
          numReviews={product.numReviews}
        />
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 lg:mt-24">
          <h2 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">
            You May Also Like
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
      <ProductGallerySkeleton />
      <ProductInfoSkeleton />
    </div>
  )
}
