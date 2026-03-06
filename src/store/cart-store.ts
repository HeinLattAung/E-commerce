import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  productId: string
  variantSku: string
  name: string
  slug: string
  image: string
  size: string
  color: string
  price: number
  quantity: number
  stock: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, variantSku: string) => void
  updateQuantity: (productId: string, variantSku: string, quantity: number) => void
  clearCart: () => void
  itemsPrice: () => number
  totalItems: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId && i.variantSku === item.variantSku
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId && i.variantSku === item.variantSku
                  ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
                  : i
              ),
            }
          }
          return { items: [...state.items, item] }
        }),

      removeItem: (productId, variantSku) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variantSku === variantSku)
          ),
        })),

      updateQuantity: (productId, variantSku, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.variantSku === variantSku
              ? { ...i, quantity: Math.min(quantity, i.stock) }
              : i
          ),
        })),

      clearCart: () => set({ items: [] }),

      itemsPrice: () =>
        get().items.reduce((total, item) => total + item.price * item.quantity, 0),

      totalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),
    }),
    { name: "cart-storage" }
  )
)
