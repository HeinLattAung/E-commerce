"use server"

import { signIn, signOut } from "@/lib/auth"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { loginSchema, registerSchema } from "@/lib/validators"
import { AuthError } from "next-auth"
import { Prisma } from "@prisma/client"

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

  const { name, email, password } = validated.data

  try {
    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return { success: false, error: "An account with this email already exists" }
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    await db.user.create({
      data: { name, email, password: hashedPassword },
    })
  } catch (error) {
    // A concurrent signup can create the email after the lookup above.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { success: false, error: "An account with this email already exists" }
    }

    // Log diagnostics without passwords, connection strings, or user input.
    console.error("Registration database operation failed", {
      code: error instanceof Prisma.PrismaClientKnownRequestError ? error.code : undefined,
      type: error instanceof Error ? error.name : "UnknownError",
    })
    return {
      success: false,
      error: "We couldn't create your account right now. Please try again later.",
    }
  }

  // Auto sign-in after registration
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
  } catch {
    // The account exists; do not ask the customer to register again.
    return { success: true, redirectTo: "/login?registered=true" }
  }

  return { success: true, redirectTo: "/" }
}

export async function logout() {
  await signOut({ redirectTo: "/login" })
}
