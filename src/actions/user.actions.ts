"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function getCurrentUser() {
  const session = await auth()
  if (!session?.user?.id) return null

  return db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      addresses: true,
      wishlist: true,
    },
  })
}

export async function updateProfile(data: { name: string; image?: string }) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  await db.user.update({
    where: { id: session.user.id },
    data,
  })

  return { success: true }
}
