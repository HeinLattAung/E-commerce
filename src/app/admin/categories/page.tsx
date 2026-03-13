import { getAdminCategories } from "@/actions/admin.actions"
import { CategoriesClient } from "@/components/admin/categories-client"

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground">
          Organize your product catalog ({categories.length} categories).
        </p>
      </div>
      <CategoriesClient categories={categories} />
    </div>
  )
}
