import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
const categories = [
  {
    name: "Outerwear",
    slug: "outerwear",
    detail: "Layers to live in",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
  },
  {
    name: "Bags & leather",
    slug: "leather-goods",
    detail: "Carry a little less",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
  },
  {
    name: "Footwear",
    slug: "footwear",
    detail: "Go your own way",
    image:
      "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&q=80",
  },
  {
    name: "Timepieces",
    slug: "timepieces",
    detail: "Make time for the details",
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
  },
]
export function CategoriesShowcase() {
  return (
    <section
      id="collections"
      className="store-shell section-space scroll-mt-32"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">A place for everything</p>
          <h2>Find your kind of everyday.</h2>
        </div>
        <Link href="/products" className="text-link">
          Shop all pieces <ArrowUpRight className="size-4" />
        </Link>
      </div>
      <div className="collection-grid">
        {categories.map((cat, index) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="collection-card group"
          >
            <div className="collection-image">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 639px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="collection-number">0{index + 1}</span>
              <span className="collection-arrow">
                <ArrowUpRight className="size-4" />
              </span>
            </div>
            <div className="pt-4">
              <h3 className="text-base font-medium tracking-tight">
                {cat.name}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {cat.detail}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <Link
        href="/categories/knitwear"
        className="mt-8 flex items-center justify-between gap-4 border-t py-5 text-sm"
      >
        <span>
          Looking for something softer?{" "}
          <span className="font-medium">Explore knitwear.</span>
        </span>
        <ArrowUpRight className="size-5 shrink-0" />
      </Link>
    </section>
  )
}
