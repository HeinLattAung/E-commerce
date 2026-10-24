import { notFound } from "next/navigation"
import { getCategoryBySlug } from "@/actions/category.actions"
import { ProductCard } from "@/components/product/product-card"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return { title: "Category Not Found" }
  return {
    title: category.name,
    description: category.description || `Shop ${category.name} collection`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) notFound()

  const products = category.products.filter((p) => p.isActive)

  return (
    <div className="store-shell catalog-page">
      {/* Header */}
      <div className="catalog-heading">
        <p className="text-xs font-medium tracking-luxury text-muted-foreground">
          COLLECTION
        </p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight sm:text-5xl">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-4 text-muted-foreground">{category.description}</p>
        )}
      </div>

      {/* Products */}
      {products.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">
          No products in this collection yet.
        </p>
      ) : (
        <>
          <p className="mt-10 text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
