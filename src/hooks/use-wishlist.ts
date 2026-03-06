import { create } from "zustand"
import { persist } from "zustand/middleware"

interface WishlistStore {
  items: string[]
  addItem: (productId: string) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId) =>
        set((state) => ({
          items: state.items.includes(productId)
            ? state.items
            : [...state.items, productId],
        })),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        })),
      isInWishlist: (productId) => get().items.includes(productId),
    }),
    { name: "wishlist-storage" }
  )
)
