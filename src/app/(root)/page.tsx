import { Hero } from "@/components/home/hero"
import { FeaturedProducts } from "@/components/home/featured-products"
import { CategoriesShowcase } from "@/components/home/categories-showcase"
import { ValueStrip } from "@/components/home/value-strip"
import { Newsletter } from "@/components/home/newsletter"
import { getFeaturedProducts } from "@/actions/product.actions"

export default async function HomePage() {
  const products = await getFeaturedProducts()

  return (
    <>
      <Hero />
      <ValueStrip />
      <FeaturedProducts products={products} />
      <CategoriesShowcase />
      <Newsletter />
    </>
  )
}
