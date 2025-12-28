import { useState, useEffect } from 'react'
import { productApi } from '../services/api'
import type { Product } from '../models/Product'

export interface MyProductsViewModel {
  state: {
    products: Product[]
    loading: boolean
    error: string
  }
  actions: {
    refreshProducts: () => Promise<void>
    clearError: () => void
  }
}

export const useMyProductsViewModel = (): MyProductsViewModel => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await productApi.getMyProducts()
      setProducts(data.products || [])
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể tải danh sách sản phẩm'
      setError(errorMessage)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const clearError = () => {
    setError('')
  }

  return {
    state: {
      products,
      loading,
      error,
    },
    actions: {
      refreshProducts: fetchProducts,
      clearError,
    },
  }
}


