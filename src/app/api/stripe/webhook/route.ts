import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { db } from "@/lib/db"
import type Stripe from "stripe"

/**
 * Stripe Webhook Handler
 *
 * Listens for:
 * - checkout.session.completed  → Mark order PAID, confirm stock deduction
 * - checkout.session.expired    → Release reserved stock, cancel order
 *
 * Security:
 * - Verifies webhook signature using STRIPE_WEBHOOK_SECRET
 * - Uses raw body (not parsed JSON) for signature verification
 * - Idempotent: checks isPaid before processing to prevent double-processing
 */

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    )
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured")
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    )
  }

  // ─── Verify signature ──────────────────────────────────

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error(`Webhook signature verification failed: ${message}`)
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    )
  }

  // ─── Handle events ─────────────────────────────────────

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        await handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session
        )
        break
      }

      case "checkout.session.expired": {
        await handleCheckoutExpired(
          event.data.object as Stripe.Checkout.Session
        )
        break
      }

      default:
        // Unhandled event type — acknowledge receipt
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error(`Error processing webhook ${event.type}: ${message}`)
    return NextResponse.json(
      { error: `Processing error: ${message}` },
      { status: 500 }
    )
  }
}

// ─── checkout.session.completed ────────────────────────────

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId
  if (!orderId) {
    console.error("No orderId in session metadata")
    return
  }

  const order = await db.order.findUnique({ where: { id: orderId } })
  if (!order) {
    console.error(`Order ${orderId} not found`)
    return
  }

  // Idempotency: skip if already paid
  if (order.isPaid) {
    console.log(`Order ${orderId} already marked as paid — skipping`)
    return
  }

  // Verify payment status
  if (session.payment_status !== "paid") {
    console.log(`Session ${session.id} payment_status is ${session.payment_status} — skipping`)
    return
  }

  // Retrieve payment details for the receipt
  const customerEmail =
    session.customer_details?.email ||
    session.customer_email ||
    ""

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id || session.id

  // ── Deduct stock (move from reserved → sold) ──────────

  for (const item of order.items) {
    const product = await db.product.findUnique({
      where: { id: item.productId },
      select: { variants: true },
    })

    if (!product) continue

    const updatedVariants = product.variants.map((v) => {
      if (v.sku === item.variantSku) {
        return {
          ...v,
          // Release reservation and deduct from actual stock
          reservedStock: Math.max(0, v.reservedStock - item.quantity),
          stock: v.stock - item.quantity,
        }
      }
      return v
    })

    await db.product.update({
      where: { id: item.productId },
      data: {
        variants: { set: updatedVariants },
        totalSold: { increment: item.quantity },
      },
    })
  }

  // ── Update order to PAID ──────────────────────────────

  await db.order.update({
    where: { id: orderId },
    data: {
      isPaid: true,
      paidAt: new Date(),
      status: "CONFIRMED",
      paymentMethod: "Stripe",
      paymentResult: {
        id: paymentIntentId,
        status: session.payment_status,
        emailAddress: customerEmail,
        pricePaid: (session.amount_total! / 100).toFixed(2),
      },
    },
  })

  console.log(`Order ${order.orderNumber} marked as PAID`)
}

// ─── checkout.session.expired ──────────────────────────────

async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId
  if (!orderId) return

  const order = await db.order.findUnique({ where: { id: orderId } })
  if (!order) return

  // Don't touch already-paid or already-cancelled orders
  if (order.isPaid || order.status === "CANCELLED") return

  // Release reserved stock
  for (const item of order.items) {
    const product = await db.product.findUnique({
      where: { id: item.productId },
      select: { variants: true },
    })

    if (!product) continue

    const updatedVariants = product.variants.map((v) => {
      if (v.sku === item.variantSku) {
        return {
          ...v,
          reservedStock: Math.max(0, v.reservedStock - item.quantity),
        }
      }
      return v
    })

    await db.product.update({
      where: { id: item.productId },
      data: { variants: { set: updatedVariants } },
    })
  }

  await db.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED", notes: "Checkout session expired" },
  })

  console.log(`Order ${order.orderNumber} cancelled — session expired`)
}
