import Link from "next/link"
import { Logo } from "@/components/shared/logo"
import { ArrowUpRight } from "lucide-react"
const collections = [
  { href: "/products", label: "Shop all" },
  { href: "/categories/outerwear", label: "Outerwear" },
  { href: "/categories/leather-goods", label: "Bags & leather" },
  { href: "/categories/footwear", label: "Footwear" },
  { href: "/categories/timepieces", label: "Timepieces" },
]
const account = [
  { href: "/login", label: "Sign in" },
  { href: "/register", label: "Create an account" },
  { href: "/wishlist", label: "Saved pieces" },
  { href: "/orders", label: "Your orders" },
  { href: "/cart", label: "Shopping bag" },
]
export function Footer() {
  return (
    <footer className="store-footer">
      <div className="store-shell">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:grid-cols-4 md:py-16">
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A considered collection for the way you live. Find your everyday,
              here.
            </p>
          </div>
          {[
            { title: "The collection", links: collections },
            { title: "Your space", links: account },
          ].map((group) => (
            <div key={group.title}>
              <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {group.title}
              </h2>
              <ul className="mt-5 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:underline underline-offset-4"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-2 md:col-span-1">
            <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Good to know
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Shipping is on us for orders over $100. Review your delivery total
              before checkout.
            </p>
            <Link href="/cart" className="text-link mt-5">
              Review your bag <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t py-6 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} LuxeStore</p>
          <p>Fewer things. More meaning.</p>
        </div>
      </div>
    </footer>
  )
}
