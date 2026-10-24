import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { Logo } from "@/components/shared/logo"
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="auth-page">
      <header className="store-shell flex items-center justify-between gap-4 py-6">
        <Logo />
        <Link href="/products" className="text-link">
          <ArrowLeft className="size-4" /> Back to shopping
        </Link>
      </header>
      <main className="auth-layout store-shell">
        <div className="auth-form glass-surface">
          <div className="w-full max-w-sm">{children}</div>
        </div>
        <aside className="auth-image">
          <Image
            src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&q=85"
            alt="Everyday leather bag with understated details"
            fill
            sizes="50vw"
            className="object-cover"
          />
          <div className="auth-image-caption">
            <p className="eyebrow text-white/80">Your everyday, considered</p>
            <h2>
              Good things.
              <br />
              Worth coming back to.
            </h2>
            <Link href="/products" className="text-link mt-5 text-white">
              Meet the collection <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </aside>
      </main>
      <p className="py-6 text-center text-xs text-muted-foreground">
        A little less ordinary. A little more you.
      </p>
    </div>
  )
}
