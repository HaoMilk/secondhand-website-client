export interface Category {
  _id: string
  name: string
  slug: string
  parentId?: string | null
  level: number
  path: string
  description?: string
  isActive: boolean
  sortOrder: number
  createdBy: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateCategoryInput {
  name: string
  parentId?: string | null
  description?: string
  sortOrder?: number
  isActive?: boolean
}

export interface CategoryError {
  success: false
  code: string
  message: string
  details?: {
    fieldErrors?: Record<string, string>
    meta?: Record<string, any>
  }
}

export interface CategoryResponse {
  success: true
  data: Category
}

export interface CategoriesResponse {
  success: true
  data: Category[]
}

