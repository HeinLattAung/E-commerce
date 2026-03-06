"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import slugify from "slugify"

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }
  return session
}

// ─── Dashboard Stats ─────────────────────────────────────

export async function getDashboardStats() {
  await requireAdmin()

  const [totalRevenue, totalOrders, totalProducts, totalUsers, recentOrders] =
    await Promise.all([
      db.order.aggregate({
        where: { isPaid: true },
        _sum: { totalPrice: true },
      }),
      db.order.count(),
      db.product.count(),
      db.user.count(),
      db.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } } },
      }),
    ])

  return {
    totalRevenue: totalRevenue._sum.totalPrice || 0,
    totalOrders,
    totalProducts,
    totalUsers,
    recentOrders,
  }
}

// ─── Products ────────────────────────────────────────────

export async function getAdminProducts() {
  await requireAdmin()
  return db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  })
}

interface ProductInput {
  name: string
  description: string
  basePrice: number
  categoryId: string
  featured: boolean
  isActive: boolean
  tags: string[]
  images: { url: string; alt: string; position: number }[]
  variants: {
    sku: string
    size: string
    color: string
    price: number
    comparePrice?: number
    stock: number
  }[]
}

export async function createProduct(data: ProductInput) {
  await requireAdmin()

  const slug = slugify(data.name, { lower: true, strict: true })

  const existing = await db.product.findUnique({ where: { slug } })
  if (existing) {
    return { success: false, error: "A product with this name already exists" }
  }

  const product = await db.product.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      basePrice: data.basePrice,
      categoryId: data.categoryId,
      featured: data.featured,
      isActive: data.isActive,
      tags: data.tags,
      images: data.images,
      variants: data.variants.map((v) => ({
        ...v,
        comparePrice: v.comparePrice || 0,
        reservedStock: 0,
      })),
    },
  })

  revalidatePath("/admin/products")
  revalidatePath("/products")
  return { success: true, productId: product.id }
}

export async function updateProduct(id: string, data: ProductInput) {
  await requireAdmin()

  const slug = slugify(data.name, { lower: true, strict: true })

  const existing = await db.product.findFirst({
    where: { slug, id: { not: id } },
  })
  if (existing) {
    return { success: false, error: "A product with this name already exists" }
  }

  await db.product.update({
    where: { id },
    data: {
      name: data.name,
      slug,
      description: data.description,
      basePrice: data.basePrice,
      categoryId: data.categoryId,
      featured: data.featured,
      isActive: data.isActive,
      tags: data.tags,
      images: { set: data.images },
      variants: {
        set: data.variants.map((v) => ({
          ...v,
          comparePrice: v.comparePrice || 0,
          reservedStock: 0,
        })),
      },
    },
  })

  revalidatePath("/admin/products")
  revalidatePath("/products")
  return { success: true }
}

export async function deleteProduct(id: string) {
  await requireAdmin()

  await db.review.deleteMany({ where: { productId: id } })
  await db.product.delete({ where: { id } })

  revalidatePath("/admin/products")
  revalidatePath("/products")
  return { success: true }
}

// ─── Categories ──────────────────────────────────────────

export async function getAdminCategories() {
  await requireAdmin()
  return db.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { products: true } },
      parent: { select: { id: true, name: true } },
      children: { select: { id: true, name: true } },
    },
  })
}

interface CategoryInput {
  name: string
  description: string
  image: string
  parentId?: string | null
}

export async function createCategory(data: CategoryInput) {
  await requireAdmin()

  const slug = slugify(data.name, { lower: true, strict: true })

  const existing = await db.category.findUnique({ where: { slug } })
  if (existing) {
    return { success: false, error: "A category with this name already exists" }
  }

  await db.category.create({
    data: {
      name: data.name.trim(),
      slug,
      description: data.description.trim() || null,
      image: data.image.trim() || null,
      parentId: data.parentId || null,
    },
  })

  revalidatePath("/admin/categories")
  revalidatePath("/")
  return { success: true }
}

export async function updateCategory(id: string, data: CategoryInput) {
  await requireAdmin()

  const slug = slugify(data.name, { lower: true, strict: true })

  const existing = await db.category.findFirst({
    where: { slug, id: { not: id } },
  })
  if (existing) {
    return { success: false, error: "A category with this name already exists" }
  }

  await db.category.update({
    where: { id },
    data: {
      name: data.name.trim(),
      slug,
      description: data.description.trim() || null,
      image: data.image.trim() || null,
      parentId: data.parentId || null,
    },
  })

  revalidatePath("/admin/categories")
  revalidatePath("/")
  return { success: true }
}

export async function deleteCategory(id: string) {
  await requireAdmin()

  const category = await db.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true, children: true } } },
  })

  if (!category) return { success: false, error: "Category not found" }

  if (category._count.products > 0) {
    return { success: false, error: `Cannot delete: ${category._count.products} products are in this category` }
  }

  if (category._count.children > 0) {
    return { success: false, error: `Cannot delete: ${category._count.children} subcategories exist` }
  }

  await db.category.delete({ where: { id } })

  revalidatePath("/admin/categories")
  revalidatePath("/")
  return { success: true }
}

// ─── Orders ──────────────────────────────────────────────

export async function getAdminOrders() {
  await requireAdmin()
  return db.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true, image: true } } },
  })
}

export async function updateOrderStatus(
  orderId: string,
  status: string
) {
  await requireAdmin()

  const data: Record<string, unknown> = { status }

  if (status === "DELIVERED") {
    data.isDelivered = true
    data.deliveredAt = new Date()
  }

  await db.order.update({ where: { id: orderId }, data })

  revalidatePath("/admin/orders")
  return { success: true }
}

// ─── Users ───────────────────────────────────────────────

export async function getAdminUsers() {
  await requireAdmin()
  return db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      _count: { select: { orders: true, reviews: true } },
    },
  })
}
