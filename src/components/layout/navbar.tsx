"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/shared/logo"
import { SearchBar } from "@/components/shared/search-bar"
import { CartSheet } from "@/components/cart/cart-sheet"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { UserMenu } from "@/components/layout/user-menu"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/products", label: "Shop" },
  { href: "/categories/outerwear", label: "Outerwear" },
  { href: "/categories/leather-goods", label: "Leather" },
  { href: "/categories/footwear", label: "Footwear" },
  { href: "/categories/timepieces", label: "Timepieces" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === "/"

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // On the homepage, navbar overlays the hero with white text until scrolled
  const isTransparent = isHome && !scrolled

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isTransparent
          ? "bg-transparent"
          : "border-b bg-background/95 backdrop-blur-xl shadow-sm"
      )}
    >
      {/* Top announcement bar — hidden when transparent on home */}
      <div
        className={cn(
          "hidden md:block transition-all duration-300",
          isTransparent
            ? "bg-white/10 backdrop-blur-sm text-white"
            : "bg-primary text-primary-foreground"
        )}
      >
        <div className="container mx-auto flex h-8 items-center justify-center px-4">
          <p className="text-xs tracking-wide-luxury">
            COMPLIMENTARY SHIPPING ON ORDERS OVER $100
          </p>
        </div>
      </div>

      {/* Main nav */}
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 lg:h-20">
        <div className="flex items-center gap-2">
          <MobileNav />
          <Link href="/" className="flex items-baseline gap-1">
            <span
              className={cn(
                "font-serif text-xl font-bold tracking-tight transition-colors",
                isTransparent ? "text-white" : "text-foreground"
              )}
            >
              LUXE
            </span>
            <span
              className={cn(
                "text-[10px] font-medium tracking-luxury transition-colors",
                isTransparent ? "text-white/70" : "text-muted-foreground"
              )}
            >
              STORE
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative text-sm font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:transition-all hover:after:w-full",
                isTransparent
                  ? "text-white/80 hover:text-white after:bg-white"
                  : "text-muted-foreground hover:text-foreground after:bg-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <SearchBar />
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "hidden sm:inline-flex",
              isTransparent && "text-white hover:bg-white/10 hover:text-white"
            )}
            asChild
          >
            <Link href="/wishlist">
              <Heart className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </Link>
          </Button>
          <ThemeToggle
            className={cn(
              isTransparent && "text-white hover:bg-white/10 hover:text-white"
            )}
          />
          <UserMenu />
          <CartSheet />
        </div>
      </div>
    </header>
  )
}
