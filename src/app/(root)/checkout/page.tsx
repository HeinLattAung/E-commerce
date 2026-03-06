"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import { useCartStore } from "@/store/cart-store"
import { createOrder } from "@/actions/order.actions"
import { createCheckoutSession } from "@/actions/stripe.actions"
import { formatPrice } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { Loader2, Lock, ArrowLeft, MapPin, CreditCard, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, itemsPrice, shippingPrice, taxPrice, totalPrice } = useCart()
  const clearCart = useCartStore((s) => s.clearCart)
  const [isPending, startTransition] = useTransition()

  const [address, setAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  })

  const updateField = (field: string, value: string) =>
    setAddress((prev) => ({ ...prev, [field]: value }))

  const isAddressComplete = Object.values(address).every((v) => v.trim() !== "")

  const handleCheckout = () => {
    if (!isAddressComplete) {
      toast.error("Please fill in all shipping fields")
      return
    }

    if (items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    startTransition(async () => {
      // 1. Create the order (reserves stock)
      const orderResult = await createOrder({
        items: items.map((item) => ({
          productId: item.productId,
          variantSku: item.variantSku,
          name: item.name,
          slug: item.slug,
          image: item.image,
          size: item.size,
          color: item.color,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: address,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })

      if (!orderResult.success) {
        toast.error(orderResult.error)
        return
      }

      // 2. Create Stripe checkout session
      const stripeResult = await createCheckoutSession(orderResult.orderId!)

      if (!stripeResult.success) {
        toast.error(stripeResult.error)
        return
      }

      // 3. Clear cart and redirect to Stripe
      clearCart()

      if (stripeResult.url) {
        window.location.href = stripeResult.url
      }
    })
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 pt-32 pb-16">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">Add items before checking out.</p>
          <Button className="mt-6" onClick={() => router.push("/products")}>
            Browse Products
          </Button>
        </div>
      </div>
    )
  }

  const steps = [
    { label: "Shipping", icon: MapPin },
    { label: "Payment", icon: CreditCard },
    { label: "Confirmation", icon: CheckCircle2 },
  ]

  return (
    <div className="container mx-auto px-4 pt-32 pb-8 md:px-8 lg:pt-36 lg:pb-16">
      {/* Back to Cart */}
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2 gap-1.5 text-muted-foreground">
        <Link href="/cart">
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>
      </Button>

      <h1 className="font-serif text-3xl font-bold tracking-tight">Checkout</h1>

      {/* Stepper */}
      <div className="mt-6 flex items-center justify-center gap-0">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                  i === 0
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <step.icon className="h-4 w-4" />
              </div>
              <span
                className={cn(
                  "hidden text-sm sm:inline",
                  i === 0 ? "font-medium" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="mx-3 h-px w-8 bg-border sm:mx-4 sm:w-12" />
            )}
          </div>
        ))}
      </div>

      <Separator className="my-6" />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
        {/* Shipping form */}
        <div className="lg:col-span-3">
          <h2 className="text-lg font-medium">Shipping Information</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" className="mt-1" value={address.fullName}
                onChange={(e) => updateField("fullName", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="street">Street Address</Label>
              <Input id="street" className="mt-1" value={address.street}
                onChange={(e) => updateField("street", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" className="mt-1" value={address.city}
                onChange={(e) => updateField("city", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="state">State / Province</Label>
              <Input id="state" className="mt-1" value={address.state}
                onChange={(e) => updateField("state", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP / Postal Code</Label>
              <Input id="zipCode" className="mt-1" value={address.zipCode}
                onChange={(e) => updateField("zipCode", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input id="country" className="mt-1" value={address.country}
                onChange={(e) => updateField("country", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" className="mt-1" value={address.phone}
                onChange={(e) => updateField("phone", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border p-4 sm:p-6">
            <h2 className="text-lg font-medium">Order Summary</h2>
            <div className="mt-4 space-y-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantSku}`} className="flex gap-3">
                  <div className="relative h-16 w-14 flex-shrink-0 overflow-hidden bg-muted">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium leading-tight">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.size} / {item.color}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(itemsPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shippingPrice === 0 ? "Complimentary" : formatPrice(shippingPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatPrice(taxPrice)}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between text-base font-medium">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={isPending || !isAddressComplete}
              className="mt-6 w-full"
              size="lg"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Lock className="mr-2 h-4 w-4" />
              )}
              {isPending ? "Processing..." : "Pay with Stripe"}
            </Button>

            <p className="mt-3 text-center text-xs text-muted-foreground">
              You will be redirected to Stripe&apos;s secure checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
