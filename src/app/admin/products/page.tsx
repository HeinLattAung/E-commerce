import { getAdminProducts } from "@/actions/admin.actions"
import { getCategories } from "@/actions/category.actions"
import { ProductsClient } from "@/components/admin/products-client"

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getAdminProducts(),
    getCategories(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground">
          Manage your product catalog ({products.length} products).
        </p>
      </div>
      <ProductsClient products={products} categories={categories} />
    </div>
  )
}
