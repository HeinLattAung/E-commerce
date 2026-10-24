import Link from "next/link"
import { ArrowUpRight, Heart } from "lucide-react"
export function Newsletter() {
  return (
    <section className="store-shell section-space">
      <div className="member-panel">
        <div className="member-symbol">
          <Heart className="size-10" strokeWidth={1} />
        </div>
        <div className="max-w-xl">
          <p className="eyebrow">Make yourself at home</p>
          <h2>A store that feels a little more you.</h2>
          <p className="mt-4 text-sm leading-relaxed opacity-80">
            Save the pieces you love, keep your orders in one place, and pick up
            where you left off.
          </p>
        </div>
        <Link href="/register" className="store-cta member-cta">
          Create your account <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </section>
  )
}
