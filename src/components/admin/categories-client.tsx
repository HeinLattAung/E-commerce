"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Plus,
  Pencil,
  Trash2,
  MoreHorizontal,
  Loader2,
  FolderTree,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/actions/admin.actions"
import { toast } from "sonner"
import type { Category } from "@prisma/client"

type CategoryWithMeta = Category & {
  _count: { products: number }
  parent: { id: string; name: string } | null
  children: { id: string; name: string }[]
}

interface Props {
  categories: CategoryWithMeta[]
}

export function CategoriesClient({ categories }: Props) {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editCategory, setEditCategory] = useState<CategoryWithMeta | null>(null)
  const [isPending, startTransition] = useTransition()

  // Form state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [parentId, setParentId] = useState<string>("")

  const openCreate = () => {
    setEditCategory(null)
    setName("")
    setDescription("")
    setImage("")
    setParentId("")
    setDialogOpen(true)
  }

  const openEdit = (cat: CategoryWithMeta) => {
    setEditCategory(cat)
    setName(cat.name)
    setDescription(cat.description || "")
    setImage(cat.image || "")
    setParentId(cat.parentId || "")
    setDialogOpen(true)
  }

  const handleDelete = (id: string, catName: string) => {
    if (!confirm(`Delete "${catName}"? This cannot be undone.`)) return
    startTransition(async () => {
      const result = await deleteCategory(id)
      if (result.success) {
        toast.success("Category deleted")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  const handleSubmit = () => {
    if (!name.trim()) return toast.error("Name is required")

    const data = {
      name: name.trim(),
      description: description.trim(),
      image: image.trim(),
      parentId: parentId || null,
    }

    startTransition(async () => {
      const result = editCategory
        ? await updateCategory(editCategory.id, data)
        : await createCategory(data)

      if (result.success) {
        toast.success(editCategory ? "Category updated" : "Category created")
        setDialogOpen(false)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium">Parent</th>
                  <th className="px-4 py-3 font-medium">Products</th>
                  <th className="px-4 py-3 font-medium">Subcategories</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      <FolderTree className="mx-auto h-8 w-8 text-muted-foreground/50" />
                      <p className="mt-2">No categories yet. Create one to get started.</p>
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr
                      key={cat.id}
                      className="border-b transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded bg-muted">
                            {cat.image ? (
                              <Image
                                src={cat.image}
                                alt={cat.name}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <FolderTree className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{cat.name}</p>
                            <p className="text-xs text-muted-foreground">/{cat.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="max-w-[200px] px-4 py-3">
                        <p className="truncate text-muted-foreground">
                          {cat.description || "—"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        {cat.parent ? (
                          <Badge variant="outline" className="text-xs">
                            {cat.parent.name}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="text-xs">
                          {cat._count.products}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {cat.children.length > 0
                          ? cat.children.map((c) => c.name).join(", ")
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(cat)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(cat.id, cat.name)}
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {editCategory ? "Edit Category" : "Create Category"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                className="mt-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Outerwear"
              />
            </div>
            <div>
              <Label>Description</Label>
              <textarea
                className="mt-1 flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Category description..."
              />
            </div>
            <div>
              <Label>Image URL</Label>
              <Input
                className="mt-1"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              {image && (
                <div className="relative mt-2 h-32 w-full overflow-hidden rounded-md bg-muted">
                  <Image
                    src={image}
                    alt="Preview"
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                </div>
              )}
            </div>
            <div>
              <Label>Parent Category (optional)</Label>
              <Select value={parentId} onValueChange={setParentId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="None (top-level)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (top-level)</SelectItem>
                  {categories
                    .filter((c) => c.id !== editCategory?.id)
                    .map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isPending}
                className="min-w-[100px]"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editCategory ? "Save" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
