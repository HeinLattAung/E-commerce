"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  MoreHorizontal,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { deleteProduct } from "@/actions/admin.actions"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"
import { ProductForm } from "@/components/admin/product-form"
import type { ProductWithCategory } from "@/types"
import type { Category } from "@prisma/client"

interface Props {
  products: ProductWithCategory[]
  categories: Category[]
}

export function ProductsClient({ products, categories }: Props) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<ProductWithCategory | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    startTransition(async () => {
      const result = await deleteProduct(id)
      if (result.success) {
        toast.success("Product deleted")
        router.refresh()
      }
    })
  }

  const handleEdit = (product: ProductWithCategory) => {
    setEditProduct(product)
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setEditProduct(null)
    setDialogOpen(true)
  }

  const handleFormSuccess = () => {
    setDialogOpen(false)
    setEditProduct(null)
    router.refresh()
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((product) => {
                    const totalStock = product.variants.reduce(
                      (sum, v) => sum + v.stock,
                      0
                    )
                    return (
                      <tr
                        key={product.id}
                        className="border-b transition-colors hover:bg-muted/30"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded bg-muted">
                              {product.images[0] ? (
                                <Image
                                  src={product.images[0].url}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                  N/A
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {product.variants.length} variant
                                {product.variants.length !== 1 && "s"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {product.category.name}
                        </td>
                        <td className="px-4 py-3">
                          {formatPrice(product.basePrice)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={
                              totalStock === 0
                                ? "text-destructive"
                                : totalStock <= 10
                                ? "text-amber-600"
                                : ""
                            }
                          >
                            {totalStock}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            {product.isActive ? (
                              <Badge variant="default" className="bg-emerald-600 text-xs">
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                Draft
                              </Badge>
                            )}
                            {product.featured && (
                              <Badge variant="outline" className="text-xs">
                                Featured
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(product)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(product.id, product.name)}
                                className="text-destructive focus:text-destructive"
                                disabled={isPending}
                              >
                                {isPending ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="mr-2 h-4 w-4" />
                                )}
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {editProduct ? "Edit Product" : "Create Product"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            categories={categories}
            product={editProduct}
            onSuccess={handleFormSuccess}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
