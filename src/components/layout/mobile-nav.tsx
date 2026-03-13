"use client"

import { useState } from "react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Menu, ArrowRight } from "lucide-react"
import { Logo } from "@/components/shared/logo"

const menuLinks = [
  { href: "/products", label: "All Products" },
  { href: "/categories/outerwear", label: "Outerwear" },
  { href: "/categories/leather-goods", label: "Leather Goods" },
  { href: "/categories/footwear", label: "Footwear" },
  { href: "/categories/timepieces", label: "Timepieces" },
  { href: "/categories/knitwear", label: "Knitwear" },
]

const accountLinks = [
  { href: "/login", label: "Sign In" },
  { href: "/orders", label: "My Orders" },
  { href: "/profile", label: "Profile" },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" strokeWidth={1.5} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex h-full flex-col">
          <div className="flex items-center px-6 pt-6 pb-4">
            <Logo />
          </div>
          <Separator />
          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <p className="mb-3 px-2 text-xs font-medium tracking-luxury text-muted-foreground">
              COLLECTIONS
            </p>
            {menuLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="group flex items-center justify-between rounded-lg px-2 py-3 text-sm font-medium transition-colors hover:bg-accent"
              >
                {link.label}
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
              </Link>
            ))}

            <Separator className="my-6" />

            <p className="mb-3 px-2 text-xs font-medium tracking-luxury text-muted-foreground">
              ACCOUNT
            </p>
            {accountLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="group flex items-center justify-between rounded-lg px-2 py-3 text-sm font-medium transition-colors hover:bg-accent"
              >
                {link.label}
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
