"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, ArrowRight, Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/store/cart-store"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils"

export default function CartPage() {
  const { items, itemsPrice, shippingPrice, taxPrice, totalPrice } = useCart()
  const { removeItem, updateQuantity, clearCart } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 pt-32 pb-16">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
          <h1 className="mt-4 font-serif text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">
            Discover our collections and find something you love.
          </p>
          <Button asChild className="mt-6">
            <Link href="/products">
              Browse Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-8 lg:pt-36 lg:pb-16">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold tracking-tight">
          Shopping Cart
        </h1>
        <Button variant="ghost" size="sm" onClick={clearCart} className="text-muted-foreground">
          Clear All
        </Button>
      </div>
      <Separator className="my-6" />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-0">
          {items.map((item) => (
            <div key={`${item.productId}-${item.variantSku}`}>
              <div className="flex gap-4 py-6">
                <div className="relative h-28 w-24 flex-shrink-0 overflow-hidden rounded bg-muted sm:h-32 sm:w-28">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 96px, 112px"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-medium leading-tight hover:underline sm:text-lg"
                      >
                        {item.name}
                      </Link>
                      <span className="whitespace-nowrap font-medium sm:text-lg">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.size} / {item.color}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatPrice(item.price)} each
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 rounded-full border px-1">
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantSku, Math.max(1, item.quantity - 1))}
                        className="p-1.5 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-[2rem] text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantSku, Math.min(item.stock, item.quantity + 1))}
                        className="p-1.5 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.productId, item.variantSku)}
                    >
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Remove</span>
                    </Button>
                  </div>
                </div>
              </div>
              <Separator />
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div>
          <div className="sticky top-32 rounded-lg border p-4 sm:p-6">
            <h2 className="text-lg font-medium">Order Summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(itemsPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shippingPrice === 0 ? "Complimentary" : formatPrice(shippingPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Tax</span>
                <span>{formatPrice(taxPrice)}</span>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between text-base font-medium">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <Button asChild className="mt-6 w-full" size="lg">
              <Link href="/checkout">
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="link" className="mt-1 w-full text-muted-foreground">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
