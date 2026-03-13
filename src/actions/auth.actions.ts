"use server"

import { signIn, signOut } from "@/lib/auth"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { loginSchema, registerSchema } from "@/lib/validators"
import { AuthError } from "next-auth"

export async function login(email: string, password: string) {
  const parsed = loginSchema.safeParse({ email, password })
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    })
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Invalid email or password" }
        default:
          return { success: false, error: "Something went wrong. Please try again." }
      }
    }
    throw error
  }
}

export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/" })
}

export async function register(data: {
  name: string
  email: string
  password: string
  confirmPassword: string
}) {
  const validated = registerSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message }
  }

  const existing = await db.user.findUnique({
    where: { email: data.email },
  })

  if (existing) {
    return { success: false, error: "An account with this email already exists" }
  }

  const hashedPassword = await bcrypt.hash(data.password, 12)

  await db.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  })

  // Auto sign-in after registration
  try {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })
  } catch {
    // Sign-in failed after registration — user can sign in manually
  }

  return { success: true }
}

export async function logout() {
  await signOut({ redirectTo: "/login" })
}
