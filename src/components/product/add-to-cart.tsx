"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart-store"
import { ShoppingBag, Check, Minus, Plus } from "lucide-react"
import type { Product, ProductVariant, ProductImage } from "@prisma/client"

interface AddToCartProps {
  product: Product & { images: ProductImage[] }
  variant: ProductVariant
  disabled?: boolean
}

export function AddToCart({ product, variant, disabled }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const maxQty = variant.stock - variant.reservedStock

  const handleAdd = () => {
    addItem({
      productId: product.id,
      variantSku: variant.sku,
      name: product.name,
      slug: product.slug,
      image: product.images[0]?.url || "/placeholder.svg",
      size: variant.size,
      color: variant.color,
      price: variant.price,
      quantity,
      stock: maxQty,
    })

    setIsAdded(true)
    setTimeout(() => {
      setIsAdded(false)
      setQuantity(1)
    }, 1800)
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {/* Quantity selector */}
      <div className="flex h-12 items-center border">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1 || disabled}
          className="flex h-full w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="flex h-full w-10 items-center justify-center border-x text-sm font-medium">
          {quantity}
        </span>
        <button
          onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
          disabled={quantity >= maxQty || disabled}
          className="flex h-full w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Add to cart button */}
      <Button
        onClick={handleAdd}
        disabled={disabled || isAdded}
        size="lg"
        className="relative h-12 flex-1 overflow-hidden rounded-none bg-black text-xs font-medium tracking-wide-luxury text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
      >
        <AnimatePresence mode="wait">
          {isAdded ? (
            <motion.span
              key="added"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
              >
                <Check className="h-4 w-4" />
              </motion.span>
              ADDED TO BAG
            </motion.span>
          ) : (
            <motion.span
              key="add"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              ADD TO BAG
            </motion.span>
          )}
        </AnimatePresence>

        {/* Ripple effect on add */}
        <AnimatePresence>
          {isAdded && (
            <motion.div
              initial={{ scale: 0, opacity: 0.3 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 m-auto h-full w-full rounded-full bg-white"
              style={{ originX: 0.5, originY: 0.5 }}
            />
          )}
        </AnimatePresence>
      </Button>
    </div>
  )
}
