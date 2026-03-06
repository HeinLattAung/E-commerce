import Link from "next/link"
import { Logo } from "@/components/shared/logo"
import { Separator } from "@/components/ui/separator"

const collections = [
  { href: "/categories/outerwear", label: "Outerwear" },
  { href: "/categories/leather-goods", label: "Leather Goods" },
  { href: "/categories/footwear", label: "Footwear" },
  { href: "/categories/timepieces", label: "Timepieces" },
  { href: "/categories/knitwear", label: "Knitwear" },
]

const company = [
  { href: "#", label: "About Us" },
  { href: "#", label: "Craftsmanship" },
  { href: "#", label: "Sustainability" },
  { href: "#", label: "Careers" },
]

const support = [
  { href: "#", label: "Contact" },
  { href: "#", label: "Shipping & Returns" },
  { href: "#", label: "Size Guide" },
  { href: "#", label: "FAQ" },
]

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="text-xs font-medium tracking-luxury text-muted-foreground">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Curated collections of premium goods, crafted by artisans who believe
              in the beauty of lasting quality.
            </p>
          </div>

          <FooterColumn title="COLLECTIONS" links={collections} />
          <FooterColumn title="COMPANY" links={company} />
          <FooterColumn title="SUPPORT" links={support} />
        </div>

        <Separator className="my-12" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} LuxeStore. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground">Privacy</Link>
            <Link href="#" className="hover:text-foreground">Terms</Link>
            <Link href="#" className="hover:text-foreground">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
