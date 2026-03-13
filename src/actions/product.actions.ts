"use server"

import { db } from "@/lib/db"
import { ITEMS_PER_PAGE } from "@/lib/constants"

export async function getProducts({
  page = 1,
  categoryId,
  query,
  sort,
  minPrice,
  maxPrice,
}: {
  page?: number
  categoryId?: string
  query?: string
  sort?: string
  minPrice?: number
  maxPrice?: number
} = {}) {
  const where = {
    isActive: true,
    ...(categoryId && { categoryId }),
    ...(query && {
      OR: [
        { name: { contains: query, mode: "insensitive" as const } },
        { description: { contains: query, mode: "insensitive" as const } },
        { tags: { hasSome: [query.toLowerCase()] } },
      ],
    }),
    ...(minPrice !== undefined && { basePrice: { gte: minPrice } }),
    ...(maxPrice !== undefined && { basePrice: { ...( minPrice !== undefined ? { gte: minPrice } : {}), lte: maxPrice } }),
  }

  const orderBy = sort === "price-asc"
    ? { basePrice: "asc" as const }
    : sort === "price-desc"
    ? { basePrice: "desc" as const }
    : sort === "newest"
    ? { createdAt: "desc" as const }
    : sort === "best-selling"
    ? { totalSold: "desc" as const }
    : { featured: "desc" as const }

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      include: { category: true },
    }),
    db.product.count({ where }),
  ])

  return {
    products,
    totalPages: Math.ceil(total / ITEMS_PER_PAGE),
    currentPage: page,
  }
}

export async function getProductBySlug(slug: string) {
  return db.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  })
}

export async function getFeaturedProducts() {
  return db.product.findMany({
    where: { featured: true, isActive: true },
    take: 8,
    include: { category: true },
  })
}

export async function getProductsByIds(ids: string[]) {
  if (ids.length === 0) return []
  return db.product.findMany({
    where: { id: { in: ids }, isActive: true },
    include: { category: true },
  })
}

export async function getRelatedProducts(productId: string, categoryId: string) {
  return db.product.findMany({
    where: {
      categoryId,
      isActive: true,
      id: { not: productId },
    },
    take: 4,
    include: { category: true },
  })
}
