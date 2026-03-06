import Link from "next/link"
import Image from "next/image"
import { redirect, notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getOrderById } from "@/actions/order.actions"
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

interface Props {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: Props) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const { id } = await params
  const order = await getOrderById(id)

  if (!order) notFound()

  return (
    <div className="container mx-auto px-4 pt-32 pb-16">
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/orders">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>
      </Button>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            {order.orderNumber}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusVariant[order.status] ?? "outline"}>
            {order.status}
          </Badge>
          {order.isPaid && (
            <Badge variant="default" className="bg-emerald-600">
              PAID
            </Badge>
          )}
        </div>
      </div>

      <Separator className="my-6" />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Order items */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-medium">Items</h2>
          <div className="mt-4 space-y-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-4 rounded-lg border p-4">
                <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded bg-muted">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-medium hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {item.size} / {item.color}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </span>
                    <span className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary sidebar */}
        <div className="space-y-6">
          {/* Price summary */}
          <div className="rounded-lg border p-5">
            <h2 className="text-lg font-medium">Order Summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.itemsPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {order.shippingPrice === 0
                    ? "Complimentary"
                    : formatPrice(order.shippingPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatPrice(order.taxPrice)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-base font-medium">
                <span>Total</span>
                <span>{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="rounded-lg border p-5">
            <h2 className="text-lg font-medium">Shipping Address</h2>
            <div className="mt-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">
                {order.shippingAddress.fullName}
              </p>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p className="mt-1">{order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Payment info */}
          {order.paymentResult && (
            <div className="rounded-lg border p-5">
              <h2 className="text-lg font-medium">Payment</h2>
              <div className="mt-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Method</span>
                  <span>{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="capitalize">{order.paymentResult.status}</span>
                </div>
                {order.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Paid on</span>
                    <span>{formatDate(order.paidAt)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
