import Link from "next/link"
import { redirect } from "next/navigation"
import { Package, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getUserOrders } from "@/actions/order.actions"
import { auth } from "@/lib/auth"
import { formatPrice, formatDate } from "@/lib/utils"

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "outline",
  CONFIRMED: "secondary",
  PROCESSING: "secondary",
  SHIPPED: "default",
  DELIVERED: "default",
  CANCELLED: "destructive",
  REFUNDED: "destructive",
}

export default async function OrdersPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const orders = await getUserOrders()

  return (
    <div className="container mx-auto px-4 pt-32 pb-16">
      <h1 className="font-serif text-3xl font-bold tracking-tight">My Orders</h1>
      <p className="mt-1 text-muted-foreground">Track and manage your orders.</p>
      <Separator className="my-6" />

      {orders.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <Package className="h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-medium">No orders yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            When you place an order, it will appear here.
          </p>
          <Button asChild className="mt-6">
            <Link href="/products">
              Browse Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block rounded-lg border p-5 transition-colors hover:bg-muted/50"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{order.orderNumber}</span>
                    <Badge variant={statusVariant[order.status] ?? "outline"}>
                      {order.status}
                    </Badge>
                    {order.isPaid && (
                      <Badge variant="default" className="bg-emerald-600">
                        PAID
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(order.createdAt)} &middot; {order.items.length}{" "}
                    {order.items.length === 1 ? "item" : "items"}
                  </p>
                </div>
                <span className="text-lg font-medium">
                  {formatPrice(order.totalPrice)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
