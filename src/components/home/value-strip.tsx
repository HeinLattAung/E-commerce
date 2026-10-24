import { Truck, RotateCcw, ShoppingBag } from "lucide-react"
const values = [
  {
    icon: Truck,
    label: "A little extra, on us",
    detail: "Free shipping over $100",
  },
  {
    icon: RotateCcw,
    label: "Room to change your mind",
    detail: "30-day returns",
  },
  {
    icon: ShoppingBag,
    label: "Keep your favorites close",
    detail: "Save pieces to your wishlist",
  },
]
export function ValueStrip() {
  return (
    <section aria-label="Shopping benefits" className="store-shell">
      <div className="benefits-strip">
        {values.map((item) => (
          <div key={item.label} className="flex items-center gap-3 py-4">
            <item.icon
              className="size-5 shrink-0 text-primary"
              strokeWidth={1.4}
            />
            <div>
              <p className="text-xs font-medium sm:text-sm">{item.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
