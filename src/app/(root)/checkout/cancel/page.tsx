import Link from "next/link"
import { XCircle, ArrowRight, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CheckoutCancelPage() {
  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 pt-32 pb-16">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <XCircle className="h-8 w-8 text-muted-foreground" />
        </div>

        <h1 className="mt-6 font-serif text-3xl font-bold tracking-tight">
          Checkout Cancelled
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your payment was not processed. No charges have been made.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Your reserved items will be held for 30 minutes.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="outline">
            <Link href="/cart">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Return to Cart
            </Link>
          </Button>
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
