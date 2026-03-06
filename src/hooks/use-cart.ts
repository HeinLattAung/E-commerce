import { useCartStore } from "@/store/cart-store"
import { FREE_SHIPPING_THRESHOLD, SHIPPING_PRICE, TAX_RATE } from "@/lib/constants"

export function useCart() {
  const store = useCartStore()

  const itemsPrice = store.itemsPrice()
  const shippingPrice = itemsPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_PRICE
  const taxPrice = Number((itemsPrice * TAX_RATE).toFixed(2))
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2))

  return {
    ...store,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  }
}
