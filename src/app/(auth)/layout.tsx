import { Logo } from "@/components/shared/logo"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: form side */}
      <div className="flex flex-col justify-center px-4 py-12 sm:px-8 lg:px-16">
        <div className="mb-8">
          <Logo />
        </div>
        <div className="mx-auto w-full max-w-sm">
          {children}
        </div>
      </div>

      {/* Right: image side (hidden on mobile) */}
      <div className="relative hidden lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative flex h-full items-end p-12">
          <blockquote className="max-w-md">
            <p className="font-serif text-2xl font-medium leading-relaxed text-white">
              &ldquo;Quality is not an act, it is a habit.&rdquo;
            </p>
            <footer className="mt-3 text-sm text-white/60">
              &mdash; Aristotle
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}
