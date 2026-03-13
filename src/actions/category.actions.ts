"use server"

import { db } from "@/lib/db"

export async function getCategories() {
  return db.category.findMany({
    include: { children: true },
    orderBy: { name: "asc" },
  })
}

export async function getCategoryBySlug(slug: string) {
  return db.category.findUnique({
    where: { slug },
    include: {
      products: { include: { category: true } },
      children: true,
    },
  })
}
