import type { Product } from './Product'

export interface CartItem {
  productId: string
  quantity: number
  product: Product
}

export interface CartResponse {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

export interface AddToCartInput {
  productId: string
  quantity?: number
}

export interface UpdateCartItemInput {
  quantity: number
}

