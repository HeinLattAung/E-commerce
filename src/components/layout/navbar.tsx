"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/shared/logo"
import { SearchBar } from "@/components/shared/search-bar"
import { CartSheet } from "@/components/cart/cart-sheet"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Button } from "@/components/ui/button"
import { Heart, ArrowUpRight } from "lucide-react"
import { UserMenu } from "@/components/layout/user-menu"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { cn } from "@/lib/utils"

const links = [
  { href: "/products", label: "Shop all" },
  { href: "/categories/outerwear", label: "Clothing" },
  { href: "/categories/leather-goods", label: "Bags" },
  { href: "/categories/footwear", label: "Footwear" },
  { href: "/categories/timepieces", label: "Watches" },
]

export function Navbar() {
  const pathname = usePathname()
  return (
    <header className="store-header">
      <div className="store-announcement">
        <span>Thoughtful pieces. Everyday living.</span>
        <span className="hidden sm:inline">
          Free shipping on orders over $100{" "}
          <ArrowUpRight className="inline size-3" />
        </span>
      </div>
      <div className="store-nav glass-surface">
        <div className="flex shrink-0 items-center gap-1">
          <MobileNav />
          <Logo />
        </div>
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 lg:flex"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={cn(
                "nav-link",
                pathname === link.href && "nav-link-active",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-0 sm:gap-1">
          <SearchBar />
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex"
            asChild
          >
            <Link href="/wishlist" aria-label="Saved items">
              <Heart strokeWidth={1.6} />
            </Link>
          </Button>
          <span className="hidden md:inline-flex">
            <ThemeToggle />
          </span>
          <UserMenu />
          <CartSheet />
        </div>
      </div>
    </header>
  )
}
