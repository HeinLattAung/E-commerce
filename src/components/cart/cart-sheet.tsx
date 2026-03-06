"use client"

import Image from "next/image"
import Link from "next/link"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, Minus, Plus, X, ArrowRight } from "lucide-react"
import { useCartStore, type CartItem } from "@/store/cart-store"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

function CartItemRow({ item }: { item: CartItem }) {
  const { removeItem, updateQuantity } = useCartStore()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
      className="flex gap-4 py-4"
    >
      <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/products/${item.slug}`}
              className="text-sm font-medium leading-tight hover:underline"
            >
              {item.name}
            </Link>
            <button
              onClick={() => removeItem(item.productId, item.variantSku)}
              className="mt-0.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {item.size} / {item.color}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full border px-1">
            <button
              onClick={() => updateQuantity(item.productId, item.variantSku, Math.max(1, item.quantity - 1))}
              className="p-1 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="min-w-[1.5rem] text-center text-xs font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.productId, item.variantSku, Math.min(item.stock, item.quantity + 1))}
              className="p-1 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
              disabled={item.quantity >= item.stock}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
        </div>
      </div>
    </motion.div>
  )
}

export function CartSheet() {
  const { items, totalItems, itemsPrice, shippingPrice, totalPrice } = useCart()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
          {totalItems() > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {totalItems()}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-serif text-xl">
            Your Bag ({totalItems()})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/40" strokeWidth={1} />
            <div>
              <p className="font-medium">Your bag is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Explore our collections and find something you love.
              </p>
            </div>
            <Button asChild variant="outline" className="mt-2">
              <Link href="/products">
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.variantSku}`}>
                    <CartItemRow item={item} />
                    <Separator />
                  </div>
                ))}
              </AnimatePresence>
            </div>

            <div className="border-t pt-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(itemsPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shippingPrice === 0 ? "Complimentary" : formatPrice(shippingPrice)}</span>
                </div>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <Button asChild className="mt-4 w-full" size="lg">
                <Link href="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="link" className="mt-1 w-full text-muted-foreground">
                <Link href="/cart">View Full Cart</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
