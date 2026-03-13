"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import type { ProductImage } from "@prisma/client"

interface ProductGalleryProps {
  images: ProductImage[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0)
  const sorted = [...images].sort((a, b) => a.position - b.position)

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      {/* Thumbnail strip */}
      <div className="flex gap-2 md:flex-col">
        {sorted.map((image, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={cn(
              "relative h-14 w-14 flex-shrink-0 overflow-hidden border transition-all sm:h-16 sm:w-16 md:h-20 md:w-20",
              i === selected
                ? "border-foreground"
                : "border-transparent opacity-60 hover:opacity-100"
            )}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="relative flex-1 aspect-[3/4] overflow-hidden bg-muted">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative h-full w-full"
          >
            <Image
              src={sorted[selected]?.url || "/placeholder.svg"}
              alt={sorted[selected]?.alt || "Product image"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* Skeleton for loading state */
export function ProductGallerySkeleton() {
  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      <div className="flex gap-2 md:flex-col">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-14 w-14 animate-pulse bg-muted sm:h-16 sm:w-16 md:h-20 md:w-20" />
        ))}
      </div>
      <div className="flex-1 aspect-[3/4] animate-pulse bg-muted" />
    </div>
  )
}
