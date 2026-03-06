import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[600px] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&q=80')",
          }}
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
        {/* Eyebrow */}
        <p className="text-xs font-medium tracking-luxury text-white/70">
          NEW COLLECTION 2026
        </p>

        {/* Main heading */}
        <h1 className="mt-6 font-serif text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          Elevate Your
          <br />
          <span className="gold-shimmer">Style</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
          Curated collections of premium goods, crafted by artisans
          who believe in the beauty of lasting quality.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="h-12 rounded-none bg-white px-8 text-sm font-medium tracking-wide-luxury text-black hover:bg-white/90"
          >
            <Link href="/products">
              SHOP COLLECTION
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 rounded-none border-white/30 bg-transparent px-8 text-sm font-medium tracking-wide-luxury text-white hover:bg-white/10"
          >
            <Link href="/categories/outerwear">EXPLORE</Link>
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] tracking-luxury text-white/40">SCROLL</span>
            <div className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
