import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"

export function Hero() {
  return (
    <section className="store-shell home-hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="size-1.5 rounded-full bg-primary" /> The everyday
          edit / 2026
        </p>
        <h1 id="hero-title">
          Less, but
          <br />
          <span className="hero-serif">better.</span>
        </h1>
        <p className="hero-description">
          Good design belongs in your everyday.
          <br className="hidden sm:block" /> Discover clothing, bags and objects
          worth keeping.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-5">
          <Link href="/products" className="store-cta">
            Explore the collection <ArrowUpRight className="size-4" />
          </Link>
          <Link href="#collections" className="text-link">
            Find your everyday <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="hero-footnote">
          <span className="hero-footnote-line" />
          <span>Considered details. A fresh perspective.</span>
        </div>
      </div>
      <div className="hero-visual">
        <Image
          src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1400&q=85"
          alt="Terracotta jacket with considered everyday details"
          fill
          priority
          sizes="(max-width: 767px) 100vw, 55vw"
          className="object-cover"
        />
        <div className="hero-image-top">
          <span className="glass-tag">THE DAILY UNIFORM</span>
          <span className="text-xs text-white">01 / THE EDIT</span>
        </div>
        <Link href="/categories/outerwear" className="hero-image-caption">
          <div>
            <span className="block text-[10px] uppercase tracking-[0.16em] opacity-75">
              Easy layers, any day
            </span>
            <span className="mt-1 block text-xl font-medium">
              Made for the in-between.
            </span>
          </div>
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/40">
            <ArrowUpRight className="size-5" />
          </span>
        </Link>
      </div>
    </section>
  )
}
