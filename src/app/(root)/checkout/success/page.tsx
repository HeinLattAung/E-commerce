import Link from "next/link"
import { redirect } from "next/navigation"
import {
  CheckCircle2,
  Package,
  ArrowRight,
  ShieldCheck,
  Truck,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getOrderByStripeSession } from "@/actions/order.actions"
import { formatPrice } from "@/lib/utils"

interface Props {
  searchParams: Promise<{ session_id?: string }>
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams

  if (!session_id) redirect("/")

  const order = await getOrderByStripeSession(session_id)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero confirmation banner */}
      <div className="relative overflow-hidden bg-primary pt-32 pb-16 sm:pb-20 lg:pb-24">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 25% 50%, white 1px, transparent 1px), radial-gradient(circle at 75% 50%, white 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="container relative mx-auto px-4 text-center">
          {/* Animated check icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm sm:h-24 sm:w-24">
            <CheckCircle2 className="h-10 w-10 text-white sm:h-12 sm:w-12" />
          </div>

          <p className="mt-6 text-xs tracking-luxury text-white/60 uppercase sm:text-sm">
            Order Confirmed
          </p>
          <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Thank You for Your Purchase
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-white/70 sm:text-base">
            Your order has been placed successfully and is being prepared with
            care.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-2xl">
          {/* Order details card */}
          {order && (
            <div className="fade-in-up -mt-14 rounded-xl border bg-card p-6 shadow-lg sm:-mt-16 sm:p-8 lg:-mt-20 lg:p-10">
              {/* Order number header */}
              <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
                <div>
                  <p className="text-xs tracking-luxury text-muted-foreground uppercase">
                    Order Number
                  </p>
                  <p className="mt-1 font-serif text-lg font-semibold tracking-tight sm:text-xl">
                    {order.orderNumber}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0 sm:text-right">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                      order.isPaid
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                        : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        order.isPaid ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                    {order.isPaid ? "Payment Confirmed" : "Processing Payment"}
                  </span>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Order summary rows */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Subtotal
                  </span>
                  <span className="text-sm font-medium">
                    {formatPrice(order.itemsPrice)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Shipping
                  </span>
                  <span className="text-sm font-medium">
                    {order.shippingPrice > 0
                      ? formatPrice(order.shippingPrice)
                      : "Free"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tax</span>
                  <span className="text-sm font-medium">
                    {formatPrice(order.taxPrice)}
                  </span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="font-serif text-base font-semibold">
                    Total
                  </span>
                  <span className="font-serif text-lg font-bold">
                    {formatPrice(order.totalPrice)}
                  </span>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Action buttons */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 gap-2 sm:flex-none"
                >
                  <Link href={`/orders/${order.id}`}>
                    <Package className="h-4 w-4" />
                    View Order Details
                  </Link>
                </Button>
                <Button asChild className="flex-1 gap-2 sm:flex-none">
                  <Link href="/products">
                    Continue Shopping
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* If no order found, show minimal success */}
          {!order && (
            <div className="fade-in-up -mt-14 rounded-xl border bg-card p-6 text-center shadow-lg sm:-mt-16 sm:p-8 lg:-mt-20 lg:p-10">
              <p className="text-muted-foreground">
                Your payment is being processed. You will receive a confirmation
                shortly.
              </p>
              <Button asChild className="mt-6 gap-2">
                <Link href="/products">
                  Continue Shopping
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}

          {/* Trust signals */}
          <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-3 sm:gap-8">
            <div className="fade-in-up flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="mt-3 text-sm font-medium">
                Confirmation Email
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                A detailed receipt will be sent to your email shortly.
              </p>
            </div>

            <div className="fade-in-up flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Truck className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="mt-3 text-sm font-medium">
                Fast Shipping
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Your order will be carefully packaged and shipped promptly.
              </p>
            </div>

            <div className="fade-in-up flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="mt-3 text-sm font-medium">
                Secure Payment
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Your payment was processed securely through Stripe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
