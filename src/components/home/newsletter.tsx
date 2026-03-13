"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"

export function Newsletter() {
  return (
    <section className="relative overflow-hidden bg-primary py-20 text-primary-foreground lg:py-28">
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container relative mx-auto px-4 text-center"
      >
        <p className="text-xs font-medium tracking-luxury text-primary-foreground/60">
          NEWSLETTER
        </p>
        <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          Join the Inner Circle
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-primary-foreground/70">
          Be the first to know about new arrivals, exclusive offers,
          and the stories behind our craftsmanship.
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mx-auto mt-8 flex w-full max-w-sm flex-col gap-3 px-4 sm:max-w-md sm:flex-row sm:px-0"
        >
          <Input
            type="email"
            placeholder="your@email.com"
            className="h-12 rounded-none border-primary-foreground/20 bg-transparent text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-primary-foreground/30"
          />
          <Button
            type="submit"
            variant="secondary"
            className="h-12 rounded-none px-6 text-xs font-medium tracking-wide-luxury"
          >
            SUBSCRIBE
            <ArrowRight className="ml-2 h-3.5 w-3.5" />
          </Button>
        </form>

        <p className="mt-4 text-xs text-primary-foreground/40">
          No spam. Unsubscribe anytime.
        </p>
      </motion.div>
    </section>
  )
}
