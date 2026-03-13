import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { loginSchema } from "@/lib/validators"
import { authConfig } from "@/lib/auth.config"

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,

  // Override providers with full DB-dependent implementations
  providers: [
    // Keep the edge-safe providers (Google)
    ...authConfig.providers.filter(
      (p) => (p as { id?: string }).id !== "credentials"
    ),
    // Real Credentials provider with DB lookup
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        const user = await db.user.findUnique({
          where: { email },
        })

        if (!user) return null
        if (!user.password) return null

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        }
      },
    }),
  ],

  callbacks: {
    ...authConfig.callbacks,

    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false

        const existing = await db.user.findUnique({
          where: { email: user.email },
        })

        if (existing) {
          if (user.image && user.image !== existing.image) {
            await db.user.update({
              where: { id: existing.id },
              data: { image: user.image },
            })
          }
          user.id = existing.id
          user.role = existing.role
        } else {
          const newUser = await db.user.create({
            data: {
              name: user.name || "User",
              email: user.email,
              image: user.image,
              emailVerified: new Date(),
            },
          })
          user.id = newUser.id
          user.role = newUser.role
        }
      }

      return true
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }

      if (trigger === "update" && session) {
        token.name = session.user?.name ?? token.name
        token.image = session.user?.image ?? token.image
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
})
