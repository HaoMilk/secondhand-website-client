import { useState, useEffect } from 'react'
import { categoryApi } from '../services/api'
import type { Category } from '../models/Category'

export interface CategoriesViewModel {
  state: {
    categories: Category[]
    loading: boolean
    error: string
  }
  actions: {
    refreshCategories: () => Promise<void>
    clearError: () => void
  }
}

export const useCategoriesViewModel = (): CategoriesViewModel => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await categoryApi.getAll({ isActive: undefined })
      setCategories(response.data || [])
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể tải danh sách danh mục'
      setError(errorMessage)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const clearError = () => {
    setError('')
  }

  return {
    state: {
      categories,
      loading,
      error,
    },
    actions: {
      refreshCategories: fetchCategories,
      clearError,
    },
  }
}


