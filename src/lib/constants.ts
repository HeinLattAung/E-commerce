export const APP_NAME = "LuxeStore"
export const APP_DESCRIPTION = "Premium e-commerce experience with curated collections"

export const ITEMS_PER_PAGE = 12

export const FREE_SHIPPING_THRESHOLD = 100
export const SHIPPING_PRICE = 10
export const TAX_RATE = 0.15

export const ORDER_STATUS = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
} as const

export const USER_ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const
