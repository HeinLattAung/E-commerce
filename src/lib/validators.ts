import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const productVariantSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  size: z.string().min(1, "Size is required"),
  color: z.string().min(1, "Color is required"),
  price: z.coerce.number().positive("Price must be positive"),
  comparePrice: z.coerce.number().positive().optional(),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
})

export const productImageSchema = z.object({
  url: z.string().url("Invalid image URL"),
  alt: z.string().min(1, "Alt text is required"),
  position: z.coerce.number().int().min(0),
})

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  basePrice: z.coerce.number().positive("Price must be positive"),
  categoryId: z.string().min(1, "Category is required"),
  images: z.array(productImageSchema).min(1, "At least one image is required"),
  variants: z.array(productVariantSchema).min(1, "At least one variant is required"),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
})

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().min(2, "Title must be at least 2 characters"),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
})

export const addressSchema = z.object({
  fullName: z.string().min(2),
  street: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  zipCode: z.string().min(3),
  country: z.string().min(2),
  phone: z.string().min(7),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProductInput = z.infer<typeof productSchema>
export type ProductVariantInput = z.infer<typeof productVariantSchema>
export type ProductImageInput = z.infer<typeof productImageSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
export type AddressInput = z.infer<typeof addressSchema>
