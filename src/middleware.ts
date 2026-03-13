import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"

const { auth } = NextAuth(authConfig)

export default auth

export const config = {
  /*
   * Match all routes EXCEPT:
   * - api/auth (NextAuth API routes must remain public)
   * - api/stripe/webhook (Stripe needs raw access)
   * - _next/static, _next/image (Next.js internals)
   * - favicon, public assets
   */
  matcher: [
    "/((?!api/auth|api/stripe/webhook|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
