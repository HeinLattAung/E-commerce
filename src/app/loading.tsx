export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading the store"
      className="flex min-h-screen items-center justify-center"
    >
      <div className="flex flex-col items-center gap-5">
        <span className="text-3xl font-semibold tracking-[-0.08em]">luxe.</span>
        <span className="h-px w-12 animate-pulse bg-primary/40" />
        <span className="text-xs text-muted-foreground">
          Finding your everyday…
        </span>
      </div>
    </div>
  )
}
