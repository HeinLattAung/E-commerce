"use client"
import Link from "next/link"
import { ArrowLeft, RefreshCw } from "lucide-react"
export default function StoreError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="store-shell catalog-page">
      <div
        role="alert"
        className="glass-surface mx-auto max-w-xl rounded-3xl p-8 sm:p-12"
      >
        <p className="eyebrow">A brief pause</p>
        <h1 className="mt-4 text-3xl font-medium tracking-tight">
          This page needs another moment.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          We couldn&apos;t load this part of the store. Please try again, or
          head back to the collection.
        </p>
        <div className="mt-7 flex flex-wrap gap-4">
          <button onClick={reset} className="store-cta">
            Try again <RefreshCw className="size-4" />
          </button>
          <Link href="/" className="text-link">
            <ArrowLeft className="size-4" /> Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
