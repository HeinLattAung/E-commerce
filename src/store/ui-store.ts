import { create } from "zustand"

interface UIStore {
  isMobileNavOpen: boolean
  isCartOpen: boolean
  isSearchOpen: boolean
  setMobileNavOpen: (open: boolean) => void
  setCartOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
}

export const useUIStore = create<UIStore>()((set) => ({
  isMobileNavOpen: false,
  isCartOpen: false,
  isSearchOpen: false,
  setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),
  setCartOpen: (open) => set({ isCartOpen: open }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
}))
