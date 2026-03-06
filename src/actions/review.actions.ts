"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { reviewSchema } from "@/lib/validators"

export async function createReview(
  productId: string,
  data: { rating: number; title: string; comment: string }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  const validated = reviewSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message }
  }

  const existing = await db.review.findFirst({
    where: { userId: session.user.id, productId },
  })
  if (existing) {
    return { success: false, error: "You already reviewed this product" }
  }

  await db.review.create({
    data: {
      userId: session.user.id,
      productId,
      ...validated.data,
    },
  })

  // Update product rating
  const reviews = await db.review.findMany({ where: { productId } })
  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

  await db.product.update({
    where: { id: productId },
    data: { rating: avgRating, numReviews: reviews.length },
  })

  return { success: true }
}
