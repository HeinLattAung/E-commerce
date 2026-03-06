"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `LXS-${timestamp}-${random}`
}

interface CreateOrderInput {
  items: {
    productId: string
    variantSku: string
    name: string
    slug: string
    image: string
    size: string
    color: string
    price: number
    quantity: number
  }[]
  shippingAddress: {
    fullName: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    phone: string
  }
  itemsPrice: number
  shippingPrice: number
  taxPrice: number
  totalPrice: number
}

/**
 * Creates a PENDING order and RESERVES stock.
 *
 * Stock flow:
 * 1. createOrder       → reservedStock += quantity (holds inventory)
 * 2. webhook (paid)    → reservedStock -= quantity, stock -= quantity (sold)
 * 3. webhook (expired) → reservedStock -= quantity (released)
 * 4. cancelOrder       → reservedStock -= quantity (released)
 *
 * The actual `stock` field is only decremented once payment is confirmed
 * via the Stripe webhook handler.
 */
export async function createOrder(data: CreateOrderInput) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  // ── Validate stock availability ───────────────────────

  for (const item of data.items) {
    const product = await db.product.findUnique({
      where: { id: item.productId },
      select: { variants: true, name: true },
    })

    if (!product) {
      return { success: false, error: `Product "${item.name}" no longer exists` }
    }

    const variant = product.variants.find((v) => v.sku === item.variantSku)
    if (!variant) {
      return {
        success: false,
        error: `Variant ${item.size}/${item.color} for "${item.name}" is no longer available`,
      }
    }

    const availableStock = variant.stock - variant.reservedStock
    if (availableStock < item.quantity) {
      return {
        success: false,
        error: `Only ${availableStock} units of "${item.name}" (${item.size}/${item.color}) available`,
      }
    }
  }

  // ── Reserve stock (increment reservedStock) ───────────

  for (const item of data.items) {
    const product = await db.product.findUnique({
      where: { id: item.productId },
      select: { variants: true },
    })

    if (!product) continue

    const updatedVariants = product.variants.map((v) => {
      if (v.sku === item.variantSku) {
        return { ...v, reservedStock: v.reservedStock + item.quantity }
      }
      return v
    })

    await db.product.update({
      where: { id: item.productId },
      data: { variants: { set: updatedVariants } },
    })
  }

  // ── Create the order ──────────────────────────────────

  const order = await db.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: session.user.id,
      items: data.items,
      shippingAddress: data.shippingAddress,
      itemsPrice: data.itemsPrice,
      shippingPrice: data.shippingPrice,
      taxPrice: data.taxPrice,
      totalPrice: data.totalPrice,
    },
  })

  return { success: true, orderId: order.id }
}

/**
 * Cancel a PENDING or CONFIRMED order.
 * Releases reserved stock if order was unpaid,
 * restores actual stock if order was already paid.
 */
export async function cancelOrder(orderId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  const order = await db.order.findFirst({
    where: {
      id: orderId,
      userId: session.user.id,
      status: { in: ["PENDING", "CONFIRMED"] },
    },
  })

  if (!order) {
    return { success: false, error: "Order not found or cannot be cancelled" }
  }

  for (const item of order.items) {
    const product = await db.product.findUnique({
      where: { id: item.productId },
      select: { variants: true },
    })

    if (!product) continue

    const updatedVariants = product.variants.map((v) => {
      if (v.sku === item.variantSku) {
        if (order.isPaid) {
          // Order was paid: restore actual stock, decrement totalSold
          return { ...v, stock: v.stock + item.quantity }
        } else {
          // Order was unpaid: release reservation only
          return { ...v, reservedStock: Math.max(0, v.reservedStock - item.quantity) }
        }
      }
      return v
    })

    await db.product.update({
      where: { id: item.productId },
      data: {
        variants: { set: updatedVariants },
        ...(order.isPaid && { totalSold: { decrement: item.quantity } }),
      },
    })
  }

  await db.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED" },
  })

  return { success: true }
}

export async function getOrderById(id: string) {
  const session = await auth()
  if (!session?.user?.id) return null

  return db.order.findFirst({
    where: {
      id,
      ...(session.user.role !== "ADMIN" && { userId: session.user.id }),
    },
    include: { user: { select: { name: true, email: true } } },
  })
}

export async function getOrderByStripeSession(sessionId: string) {
  const session = await auth()
  if (!session?.user?.id) return null

  return db.order.findFirst({
    where: {
      stripeSessionId: sessionId,
      userId: session.user.id,
    },
  })
}

export async function getUserOrders() {
  const session = await auth()
  if (!session?.user?.id) return []

  return db.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })
}
