"use server"

import { stripe } from "@/lib/stripe"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

/**
 * Creates a Stripe Checkout Session for an existing PENDING order.
 *
 * Flow:
 * 1. Verify user owns the order
 * 2. Ensure order is still PENDING and unpaid
 * 3. Build Stripe line items from order items
 * 4. Create a Checkout Session with the order ID in metadata
 * 5. Store stripeSessionId on the order for idempotent webhook handling
 * 6. Return the session URL for client-side redirect
 */
export async function createCheckoutSession(orderId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false as const, error: "You must be signed in to checkout" }
  }

  // Fetch the order and verify ownership
  const order = await db.order.findFirst({
    where: {
      id: orderId,
      userId: session.user.id,
    },
  })

  if (!order) {
    return { success: false as const, error: "Order not found" }
  }

  if (order.isPaid) {
    return { success: false as const, error: "Order is already paid" }
  }

  if (order.status === "CANCELLED") {
    return { success: false as const, error: "Order has been cancelled" }
  }

  // If this order already has a session, retrieve it — don't create duplicates
  if (order.stripeSessionId) {
    try {
      const existingSession = await stripe.checkout.sessions.retrieve(
        order.stripeSessionId
      )
      // If the session is still open, reuse it
      if (existingSession.status === "open" && existingSession.url) {
        return { success: true as const, url: existingSession.url }
      }
      // Otherwise fall through and create a new one
    } catch {
      // Session expired or invalid, create a new one
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

  // Build Stripe line items from order items
  const lineItems = order.items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
        description: `${item.size} / ${item.color}`,
        images: item.image ? [item.image] : [],
      },
      unit_amount: Math.round(item.price * 100), // Stripe uses cents
    },
    quantity: item.quantity,
  }))

  // Add shipping as a line item if non-zero
  if (order.shippingPrice > 0) {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Shipping",
          description: "Standard shipping",
          images: [],
        },
        unit_amount: Math.round(order.shippingPrice * 100),
      },
      quantity: 1,
    })
  }

  // Add tax as a line item if non-zero
  if (order.taxPrice > 0) {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Tax",
          description: "Sales tax",
          images: [],
        },
        unit_amount: Math.round(order.taxPrice * 100),
      },
      quantity: 1,
    })
  }

  // Create the Checkout Session
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
    metadata: {
      orderId: order.id,
      orderNumber: order.orderNumber,
    },
    customer_email: session.user.email || undefined,
    success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/checkout/cancel?order_id=${order.id}`,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes
  })

  // Store session ID on order
  await db.order.update({
    where: { id: order.id },
    data: { stripeSessionId: checkoutSession.id },
  })

  return { success: true as const, url: checkoutSession.url }
}
