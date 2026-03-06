"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { Plus, X, Loader2, Upload, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createProduct, updateProduct } from "@/actions/admin.actions"
import { toast } from "sonner"
import type { ProductWithCategory } from "@/types"
import type { Category } from "@prisma/client"

interface Props {
  categories: Category[]
  product?: ProductWithCategory | null
  onSuccess: () => void
}

interface VariantRow {
  sku: string
  size: string
  color: string
  price: number
  comparePrice: number
  stock: number
}

interface ImageRow {
  url: string
  alt: string
  position: number
}

export function ProductForm({ categories, product, onSuccess }: Props) {
  const [isPending, startTransition] = useTransition()

  const [name, setName] = useState(product?.name || "")
  const [description, setDescription] = useState(product?.description || "")
  const [basePrice, setBasePrice] = useState(product?.basePrice || 0)
  const [categoryId, setCategoryId] = useState(product?.categoryId || "")
  const [featured, setFeatured] = useState(product?.featured || false)
  const [isActive, setIsActive] = useState(product?.isActive ?? true)
  const [tags, setTags] = useState(product?.tags?.join(", ") || "")
  const [images, setImages] = useState<ImageRow[]>(
    product?.images?.map((img, i) => ({
      url: img.url,
      alt: img.alt,
      position: img.position ?? i,
    })) || []
  )
  const [variants, setVariants] = useState<VariantRow[]>(
    product?.variants?.map((v) => ({
      sku: v.sku,
      size: v.size,
      color: v.color,
      price: v.price,
      comparePrice: v.comparePrice || 0,
      stock: v.stock,
    })) || [{ sku: "", size: "", color: "", price: 0, comparePrice: 0, stock: 0 }]
  )

  const addVariant = () =>
    setVariants([
      ...variants,
      { sku: "", size: "", color: "", price: 0, comparePrice: 0, stock: 0 },
    ])

  const removeVariant = (i: number) =>
    setVariants(variants.filter((_, idx) => idx !== i))

  const updateVariant = (i: number, field: keyof VariantRow, value: string | number) =>
    setVariants(
      variants.map((v, idx) => (idx === i ? { ...v, [field]: value } : v))
    )

  const removeImage = (i: number) =>
    setImages(images.filter((_, idx) => idx !== i))

  const handleSubmit = () => {
    if (!name.trim()) return toast.error("Name is required")
    if (!categoryId) return toast.error("Category is required")
    if (variants.length === 0) return toast.error("At least one variant is required")
    if (variants.some((v) => !v.sku.trim())) return toast.error("All variants need a SKU")

    const data = {
      name: name.trim(),
      description: description.trim(),
      basePrice,
      categoryId,
      featured,
      isActive,
      tags: tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
      images,
      variants: variants.map((v) => ({
        sku: v.sku.trim(),
        size: v.size.trim(),
        color: v.color.trim(),
        price: Number(v.price),
        comparePrice: Number(v.comparePrice) || undefined,
        stock: Number(v.stock),
      })),
    }

    startTransition(async () => {
      const result = product
        ? await updateProduct(product.id, data)
        : await createProduct(data)

      if (result.success) {
        toast.success(product ? "Product updated" : "Product created")
        onSuccess()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Basic info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label>Product Name</Label>
          <Input
            className="mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Titanium Diver Watch"
          />
        </div>
        <div className="sm:col-span-2">
          <Label>Description</Label>
          <textarea
            className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Product description..."
          />
        </div>
        <div>
          <Label>Base Price ($)</Label>
          <Input
            className="mt-1"
            type="number"
            step="0.01"
            value={basePrice}
            onChange={(e) => setBasePrice(Number(e.target.value))}
          />
        </div>
        <div>
          <Label>Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Label>Tags (comma-separated)</Label>
          <Input
            className="mt-1"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="luxury, watch, titanium"
          />
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Checkbox
              id="featured"
              checked={featured}
              onCheckedChange={(v) => setFeatured(!!v)}
            />
            <Label htmlFor="featured" className="cursor-pointer">
              Featured
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="active"
              checked={isActive}
              onCheckedChange={(v) => setIsActive(!!v)}
            />
            <Label htmlFor="active" className="cursor-pointer">
              Active
            </Label>
          </div>
        </div>
      </div>

      <Separator />

      {/* Images */}
      <div>
        <Label className="text-base">Images</Label>
        <div className="mt-3 flex flex-wrap gap-3">
          {images.map((img, i) => (
            <div key={i} className="group relative h-24 w-24 overflow-hidden rounded-md border bg-muted">
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="96px"
              />
              <button
                onClick={() => removeImage(i)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          <ImageUploadButton
            name={name}
            onAdd={(url) =>
              setImages((prev) => [
                ...prev,
                { url, alt: name || "Product image", position: prev.length },
              ])
            }
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
            ? "Upload images via Cloudinary (first image is primary)."
            : "Add image URLs (first image is primary)."}
        </p>
      </div>

      <Separator />

      {/* Variants */}
      <div>
        <div className="flex items-center justify-between">
          <Label className="text-base">Variants</Label>
          <Button type="button" variant="outline" size="sm" onClick={addVariant}>
            <Plus className="mr-1 h-3 w-3" />
            Add Variant
          </Button>
        </div>
        <div className="mt-3 space-y-3">
          {variants.map((v, i) => (
            <div
              key={i}
              className="grid grid-cols-2 gap-2 rounded-lg border p-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7"
            >
              <div>
                <Label className="text-xs">SKU</Label>
                <Input
                  className="mt-0.5"
                  value={v.sku}
                  onChange={(e) => updateVariant(i, "sku", e.target.value)}
                  placeholder="SKU-001"
                />
              </div>
              <div>
                <Label className="text-xs">Size</Label>
                <Input
                  className="mt-0.5"
                  value={v.size}
                  onChange={(e) => updateVariant(i, "size", e.target.value)}
                  placeholder="M"
                />
              </div>
              <div>
                <Label className="text-xs">Color</Label>
                <Input
                  className="mt-0.5"
                  value={v.color}
                  onChange={(e) => updateVariant(i, "color", e.target.value)}
                  placeholder="Black"
                />
              </div>
              <div>
                <Label className="text-xs">Price</Label>
                <Input
                  className="mt-0.5"
                  type="number"
                  step="0.01"
                  value={v.price}
                  onChange={(e) => updateVariant(i, "price", Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs">Compare</Label>
                <Input
                  className="mt-0.5"
                  type="number"
                  step="0.01"
                  value={v.comparePrice}
                  onChange={(e) =>
                    updateVariant(i, "comparePrice", Number(e.target.value))
                  }
                />
              </div>
              <div>
                <Label className="text-xs">Stock</Label>
                <Input
                  className="mt-0.5"
                  type="number"
                  value={v.stock}
                  onChange={(e) => updateVariant(i, "stock", Number(e.target.value))}
                />
              </div>
              <div className="flex items-end">
                {variants.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-destructive"
                    onClick={() => removeVariant(i)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Button
          onClick={handleSubmit}
          disabled={isPending}
          className="min-w-[120px]"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {product ? "Save Changes" : "Create Product"}
        </Button>
      </div>
    </div>
  )
}

// ─── Image Upload Button (Cloudinary or URL fallback) ────

function ImageUploadButton({
  name,
  onAdd,
}: {
  name: string
  onAdd: (url: string) => void
}) {
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlValue, setUrlValue] = useState("")
  const hasCloudinary = !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  if (hasCloudinary) {
    // Dynamically import to avoid error when env is not set
    const CloudinaryUpload = require("next-cloudinary").CldUploadWidget
    return (
      <CloudinaryUpload
        uploadPreset="luxestore"
        options={{ multiple: true, maxFiles: 10 }}
        onSuccess={(result: { info: { secure_url?: string } }) => {
          if (typeof result.info === "object" && result.info.secure_url) {
            onAdd(result.info.secure_url)
          }
        }}
      >
        {({ open }: { open: () => void }) => (
          <button
            type="button"
            onClick={() => open()}
            className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
          >
            <Upload className="h-5 w-5" />
            <span className="text-[10px]">Upload</span>
          </button>
        )}
      </CloudinaryUpload>
    )
  }

  // Fallback: URL input
  if (showUrlInput) {
    return (
      <div className="flex h-24 flex-col justify-center gap-2">
        <div className="flex gap-2">
          <Input
            placeholder="https://example.com/image.jpg"
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            className="h-8 text-xs"
            onKeyDown={(e) => {
              if (e.key === "Enter" && urlValue.trim()) {
                onAdd(urlValue.trim())
                setUrlValue("")
                setShowUrlInput(false)
              }
            }}
          />
          <Button
            type="button"
            size="sm"
            className="h-8"
            disabled={!urlValue.trim()}
            onClick={() => {
              onAdd(urlValue.trim())
              setUrlValue("")
              setShowUrlInput(false)
            }}
          >
            Add
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={() => {
              setShowUrlInput(false)
              setUrlValue("")
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setShowUrlInput(true)}
      className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
    >
      <Link2 className="h-5 w-5" />
      <span className="text-[10px]">Add URL</span>
    </button>
  )
}
