import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { categoryApi } from '../services/api'
import type { CreateCategoryInput, Category } from '../models/Category'

export interface AddCategoryViewModel {
  state: {
    formData: CreateCategoryInput
    errors: Record<string, string>
    loading: boolean
    success: boolean
    errorMessage: string
    parentCategories: Category[]
    loadingParents: boolean
  }
  actions: {
    setField: (field: keyof CreateCategoryInput, value: any) => void
    handleSubmit: (e: React.FormEvent) => Promise<void>
    clearError: () => void
  }
}

export const useAddCategoryViewModel = (): AddCategoryViewModel => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [parentCategories, setParentCategories] = useState<Category[]>([])
  const [loadingParents, setLoadingParents] = useState(true)

  const [formData, setFormData] = useState<CreateCategoryInput>({
    name: '',
    parentId: null,
    description: '',
    sortOrder: 0,
    isActive: true,
  })

  // Load parent categories khi component mount
  useEffect(() => {
    const loadParentCategories = async () => {
      try {
        setLoadingParents(true)
        const response = await categoryApi.getAll({ isActive: true })
        setParentCategories(response.data || [])
      } catch (err) {
        console.error('Failed to load parent categories:', err)
      } finally {
        setLoadingParents(false)
      }
    }
    loadParentCategories()
  }, [])

  const setField = (field: keyof CreateCategoryInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error khi user nhập lại
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Tên danh mục là bắt buộc'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Tên danh mục phải có ít nhất 2 ký tự'
    } else if (formData.name.trim().length > 60) {
      newErrors.name = 'Tên danh mục không được vượt quá 60 ký tự'
    } else {
      // Kiểm tra không chỉ toàn ký tự đặc biệt
      const hasLetterOrNumber = /[a-zA-Z0-9À-ỹ]/.test(formData.name.trim())
      if (!hasLetterOrNumber) {
        newErrors.name = 'Tên danh mục phải chứa ít nhất một chữ cái hoặc số'
      }
    }

    // Validate description
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Mô tả không được vượt quá 500 ký tự'
    }

    // Validate sortOrder
    if (formData.sortOrder !== undefined) {
      if (!Number.isInteger(formData.sortOrder)) {
        newErrors.sortOrder = 'Thứ tự sắp xếp phải là số nguyên'
      } else if (formData.sortOrder < 0) {
        newErrors.sortOrder = 'Thứ tự sắp xếp phải lớn hơn hoặc bằng 0'
      } else if (formData.sortOrder > 9999) {
        newErrors.sortOrder = 'Thứ tự sắp xếp không được vượt quá 9999'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setErrorMessage('')
    setErrors({})

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Chuẩn bị data để gửi
      const submitData: CreateCategoryInput = {
        name: formData.name.trim(),
        parentId: formData.parentId || null,
        description: formData.description?.trim() || undefined,
        sortOrder: formData.sortOrder ?? 0,
        isActive: formData.isActive ?? true,
      }

      await categoryApi.create(submitData)
      setSuccess(true)
      
      // Redirect về trang quản lý danh mục sau 2 giây
      setTimeout(() => {
        navigate('/admin/categories')
      }, 2000)
    } catch (err: any) {
      const errorData = err.response?.data || {
        success: false,
        code: 'SYSTEM_ERROR',
        message: 'Có lỗi xảy ra. Vui lòng thử lại.',
      }

      setErrorMessage(errorData.message || 'Có lỗi xảy ra')

      // Xử lý validation errors từ server
      if (errorData.details?.fieldErrors) {
        setErrors(errorData.details.fieldErrors)
      }

      // Highlight name field nếu duplicate
      if (errorData.code === 'CATEGORY_DUPLICATE') {
        setErrors((prev) => ({
          ...prev,
          name: errorData.details?.fieldErrors?.name || 'Danh mục đã tồn tại',
        }))
      }
    } finally {
      setLoading(false)
    }
  }

  const clearError = (): void => {
    setErrorMessage('')
    setErrors({})
  }

  return {
    state: {
      formData,
      errors,
      loading,
      success,
      errorMessage,
      parentCategories,
      loadingParents,
    },
    actions: {
      setField,
      handleSubmit,
      clearError,
    },
  }
}

