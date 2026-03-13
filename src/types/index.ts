import type { User, Product, Category, Order, Review } from "@prisma/client"

export type SafeUser = Omit<User, "password" | "createdAt" | "updatedAt"> & {
  createdAt: string
  updatedAt: string
}

export type ProductWithCategory = Product & {
  category: Category
}

export type ProductWithReviews = Product & {
  category: Category
  reviews: (Review & { user: Pick<User, "name" | "image"> })[]
}

export type OrderWithUser = Order & {
  user: Pick<User, "name" | "email">
}

export interface SelectedVariant {
  sku: string
  size: string
  color: string
  price: number
  stock: number
}

declare module "next-auth" {
  interface User {
    role?: string
  }

  interface Session {
    user: {
      id: string
      role: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: string
    id?: string
  }
}
