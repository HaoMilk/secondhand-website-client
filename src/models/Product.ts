export type ProductCondition = 'new-like' | 'very-good' | 'good' | 'fair'
export type ProductGender = 'male' | 'female' | 'unisex'

export interface CreateProductInput {
  title: string
  description?: string
  categoryId: string
  brand?: string
  size?: string
  color?: string
  material?: string
  gender?: ProductGender
  style?: string
  price: number
  condition: ProductCondition
  defects?: string
  defectImages?: string[]
  images: string[]
  quantity?: number
  authenticity?: boolean
}

export interface Product {
  id: string
  title: string
  description?: string
  categoryId: string
  categoryName?: string
  brand?: string
  size?: string
  color?: string
  material?: string
  gender?: ProductGender
  style?: string
  price: number
  condition: ProductCondition
  defects?: string
  defectImages?: string[]
  images: string[]
  quantity: number
  sellerId: string
  sellerEmail?: string
  authenticity?: boolean
  status: 'draft' | 'pending' | 'approved' | 'rejected'
  isAvailable: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductError {
  code: string
  message: string
  details?: Array<{
    path: string[]
    message: string
  }>
  missingFields?: string[]
}

