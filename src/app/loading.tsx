export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="font-serif text-2xl font-bold tracking-tight">LUXE</div>
        <div className="h-px w-12 animate-pulse bg-foreground/20" />
      </div>
    </div>
  )
}
