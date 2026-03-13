import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const categories = [
  {
    name: "Outerwear",
    slug: "outerwear",
    description: "Timeless layers",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
    span: "col-span-2 row-span-2 md:col-span-2 md:row-span-2",
  },
  {
    name: "Leather Goods",
    slug: "leather-goods",
    description: "Handcrafted heritage",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    span: "",
  },
  {
    name: "Footwear",
    slug: "footwear",
    description: "Artisan crafted",
    image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&q=80",
    span: "",
  },
  {
    name: "Timepieces",
    slug: "timepieces",
    description: "Precision & elegance",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
    span: "",
  },
  {
    name: "Knitwear",
    slug: "knitwear",
    description: "Cashmere essentials",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
    span: "",
  },
]

export function CategoriesShowcase() {
  return (
    <section className="bg-secondary/50 py-20 lg:py-28">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium tracking-luxury text-muted-foreground">
            EXPLORE
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            Shop by Collection
          </h2>
        </div>

        {/* Bento grid */}
        <div className="mt-14 grid auto-rows-[200px] grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:auto-rows-[220px]">
          {categories.map((cat) => (
            <div key={cat.slug} className={cat.span}>
              <Link
                href={`/categories/${cat.slug}`}
                className="group relative block h-full w-full overflow-hidden"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-colors group-hover:from-black/80" />

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-xs tracking-wide-luxury text-white/60">
                    {cat.description.toUpperCase()}
                  </p>
                  <h3 className="mt-1 font-serif text-xl font-bold text-white sm:text-2xl">
                    {cat.name}
                  </h3>
                  <div className="mt-3 flex items-center gap-2 text-xs font-medium text-white/80 transition-colors group-hover:text-white">
                    <span className="tracking-wide-luxury">SHOP NOW</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
