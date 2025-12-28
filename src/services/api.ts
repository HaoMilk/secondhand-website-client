import axios from 'axios'
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '../models/Auth'
import type { CreateProductInput, Product } from '../models/Product'
import type { CreateCategoryInput, CategoryResponse, CategoriesResponse } from '../models/Category'
import type { 
  ProfileResponse, 
  ProfileBasicInfo, 
  ShippingAddress, 
  SellerInfo,
  ProfileCheckResult 
} from '../models/Profile'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor để thêm token vào request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor để xử lý lỗi response (đặc biệt là 401 - Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Chỉ xử lý lỗi 401 từ authentication (có response và code liên quan đến auth)
    if (error.response?.status === 401) {
      const errorCode = error.response?.data?.code
      
      // Chỉ xử lý các lỗi authentication thực sự
      // Bỏ qua nếu không có response (lỗi network) hoặc không phải lỗi auth
      if (errorCode && (
        errorCode === 'AUTH_INVALID_TOKEN' || 
        errorCode === 'AUTH_REQUIRED' ||
        errorCode === 'AUTH_INVALID_CREDENTIALS'
      )) {
        // Kiểm tra xem đã có token trong localStorage không (tránh xóa nhiều lần)
        const token = localStorage.getItem('token')
        if (token) {
          // Xóa token và thông tin đăng nhập khỏi localStorage
          localStorage.removeItem('token')
          localStorage.removeItem('role')
          localStorage.removeItem('email')
          
          // Chỉ redirect nếu không phải đang ở trang login hoặc register
          if (!window.location.pathname.includes('/login') && 
              !window.location.pathname.includes('/register')) {
            window.location.href = '/login'
          }
        }
      }
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  register: async (data: Omit<RegisterCredentials, 'confirmPassword'>): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/v1/auth/register', data)
    return response.data
  },

  login: async (data: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/v1/auth/login', data)
    return response.data
  },
}

export const productApi = {
  create: async (data: CreateProductInput): Promise<Product> => {
    const response = await api.post<Product>('/v1/products', data)
    return response.data
  },

  getMyProducts: async (): Promise<{ products: Product[]; total: number }> => {
    const response = await api.get<{ products: Product[]; total: number }>('/v1/products/my-products')
    return response.data
  },

  getAll: async (page: number = 1, limit: number = 9): Promise<{
    products: Product[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> => {
    const response = await api.get<{
      products: Product[]
      pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
      }
    }>('/v1/products', {
      params: { page, limit }
    })
    return response.data
  },
}

export const categoryApi = {
  create: async (data: CreateCategoryInput): Promise<CategoryResponse> => {
    const response = await api.post<CategoryResponse>('/v1/admin/categories', data)
    return response.data
  },

  getAll: async (filters?: { isActive?: boolean; parentId?: string | null }): Promise<CategoriesResponse> => {
    const params: any = {}
    if (filters?.isActive !== undefined) {
      params.isActive = filters.isActive.toString()
    }
    if (filters?.parentId !== undefined) {
      params.parentId = filters.parentId || null
    }
    const response = await api.get<CategoriesResponse>('/v1/admin/categories', { params })
    return response.data
  },

  getPublic: async (parentId?: string | null): Promise<CategoriesResponse> => {
    const params: any = {}
    if (parentId !== undefined) {
      params.parentId = parentId || null
    }
    const response = await api.get<CategoriesResponse>('/v1/categories/public', { params })
    return response.data
  },
}

export const profileApi = {
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await api.get<ProfileResponse>('/v1/profile')
    return response.data
  },

  updateBasicInfo: async (data: ProfileBasicInfo): Promise<ProfileBasicInfo> => {
    const response = await api.put<ProfileBasicInfo>('/v1/profile/basic-info', data)
    return response.data
  },

  addShippingAddress: async (data: Omit<ShippingAddress, '_id'>): Promise<ShippingAddress> => {
    const response = await api.post<ShippingAddress>('/v1/profile/shipping-addresses', data)
    return response.data
  },

  updateShippingAddress: async (addressId: string, data: Partial<ShippingAddress>): Promise<ShippingAddress> => {
    const response = await api.put<ShippingAddress>(`/v1/profile/shipping-addresses/${addressId}`, data)
    return response.data
  },

  deleteShippingAddress: async (addressId: string): Promise<{ success: boolean }> => {
    const response = await api.delete<{ success: boolean }>(`/v1/profile/shipping-addresses/${addressId}`)
    return response.data
  },

  updateSellerInfo: async (data: SellerInfo): Promise<SellerInfo> => {
    const response = await api.put<SellerInfo>('/v1/profile/seller-info', data)
    return response.data
  },

  checkCanSell: async (): Promise<ProfileCheckResult> => {
    const response = await api.get<ProfileCheckResult>('/v1/profile/check-sell')
    return response.data
  },

  checkCanBuy: async (): Promise<ProfileCheckResult> => {
    const response = await api.get<ProfileCheckResult>('/v1/profile/check-buy')
    return response.data
  },
}

export default api

