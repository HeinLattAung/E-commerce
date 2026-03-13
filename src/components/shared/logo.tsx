import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-1.5">
      <span className="font-serif text-2xl font-bold tracking-tight transition-colors group-hover:text-gold">
        LUXE
      </span>
      <span className="text-[10px] font-medium tracking-luxury text-muted-foreground transition-colors group-hover:text-foreground">
        STORE
      </span>
    </Link>
  )
}
