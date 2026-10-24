import { Hero } from "@/components/home/hero"
import { FeaturedProducts } from "@/components/home/featured-products"
import { CategoriesShowcase } from "@/components/home/categories-showcase"
import { ValueStrip } from "@/components/home/value-strip"
import { Newsletter } from "@/components/home/newsletter"
import { getFeaturedProducts } from "@/actions/product.actions"

// Products must be queried at request time, not while building the deployment.
export const dynamic = "force-dynamic"

export default async function HomePage() {
  let products: Awaited<ReturnType<typeof getFeaturedProducts>> = []
  let unavailable = false
  try {
    products = await getFeaturedProducts()
  } catch (error) {
    unavailable = true
    console.error("Featured products unavailable", {
      type: error instanceof Error ? error.name : "UnknownError",
    })
  }

  return (
    <>
      <Hero />
      <ValueStrip />
      <CategoriesShowcase />
      <FeaturedProducts products={products} unavailable={unavailable} />
      <Newsletter />
    </>
  )
}
