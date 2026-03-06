import Link from "next/link"
import { redirect } from "next/navigation"
import { CheckCircle2, Package, ArrowRight } from "lucide-react"
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
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 pt-32 pb-16">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>

        <h1 className="mt-6 font-serif text-3xl font-bold tracking-tight">
          Thank You
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your order has been placed successfully.
        </p>

        {order && (
          <>
            <Separator className="my-6" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order number</span>
                <span className="font-medium">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="font-medium">{formatPrice(order.totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium">
                  {order.isPaid ? "Payment confirmed" : "Processing payment..."}
                </span>
              </div>
            </div>
            <Separator className="my-6" />
          </>
        )}

        <p className="text-sm text-muted-foreground">
          A confirmation email will be sent to your email address shortly.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {order && (
            <Button asChild variant="outline">
              <Link href={`/orders/${order.id}`}>
                <Package className="mr-2 h-4 w-4" />
                View Order
              </Link>
            </Button>
          )}
          <Button asChild>
            <Link href="/products">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
