import Stripe from "stripe"

let _stripe: Stripe | null = null

function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not set in environment variables")
    }
    _stripe = new Stripe(key, { typescript: true })
  }
  return _stripe
}

// Lazy proxy — defers Stripe instantiation until first property access at runtime.
// This prevents build failures when STRIPE_SECRET_KEY is not yet set.
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (getStripe() as any)[prop]
  },
})
