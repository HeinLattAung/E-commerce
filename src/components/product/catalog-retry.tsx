"use client"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { RefreshCw } from "lucide-react"
export function CatalogRetry() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  return (
    <button
      disabled={pending}
      className="text-link shrink-0 disabled:opacity-50"
      onClick={() => startTransition(() => router.refresh())}
    >
      {pending ? "Trying again…" : "Try again"}
      <RefreshCw className={`size-4 ${pending ? "animate-spin" : ""}`} />
    </button>
  )
}
