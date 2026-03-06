import { Truck, Shield, RotateCcw, Headphones } from "lucide-react"

const values = [
  { icon: Truck, label: "Complimentary Shipping", detail: "On orders over $100" },
  { icon: Shield, label: "Authenticity Guaranteed", detail: "Every piece verified" },
  { icon: RotateCcw, label: "30-Day Returns", detail: "No questions asked" },
  { icon: Headphones, label: "Concierge Support", detail: "Personal assistance" },
]

export function ValueStrip() {
  return (
    <section className="border-y">
      <div className="container mx-auto grid grid-cols-2 gap-px bg-border lg:grid-cols-4">
        {values.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center gap-2 bg-background px-3 py-6 text-center sm:px-4 sm:py-8 lg:py-10"
          >
            <item.icon className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
            <p className="text-xs font-medium sm:text-sm">{item.label}</p>
            <p className="text-xs text-muted-foreground">{item.detail}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
