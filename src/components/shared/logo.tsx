import Link from "next/link"

export function Logo() {
  return (
    <Link
      href="/"
      aria-label="LuxeStore home"
      className="inline-flex items-baseline gap-1.5 whitespace-nowrap"
    >
      <span className="text-[25px] font-semibold leading-none tracking-[-0.08em]">
        luxe<span className="text-primary">.</span>
      </span>
      <span className="text-[9px] font-medium tracking-[0.18em] text-muted-foreground">
        STORE
      </span>
    </Link>
  )
}
