import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

/**
 * Edge-safe auth config — NO Prisma / Node-only imports.
 * Used by middleware for route protection.
 * The full auth.ts extends this with DB-dependent logic.
 */
export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    // Credentials stub — real authorize logic lives in auth.ts
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize() {
        return null
      },
    }),
  ],

  callbacks: {
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user
      const path = nextUrl.pathname

      // Admin routes: require ADMIN role (role is set via jwt callback below)
      if (path.startsWith("/admin")) {
        if (!isLoggedIn) return false
        if (session?.user?.role !== "ADMIN") {
          return Response.redirect(new URL("/", nextUrl))
        }
        return true
      }

      // Protected customer routes: require login
      const protectedPaths = ["/checkout", "/orders", "/profile"]
      if (protectedPaths.some((p) => path.startsWith(p))) {
        return isLoggedIn
      }

      // Everything else is public
      return true
    },

    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },

    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
} satisfies NextAuthConfig
