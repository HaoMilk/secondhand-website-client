import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { productApi, categoryApi, profileApi } from '../services/api'
import type { CreateProductInput, ProductError } from '../models/Product'
import type { Category } from '../models/Category'

export interface AddProductViewModel {
  state: {
    formData: CreateProductInput
    categories: Category[]
    categoriesLoading: boolean
    errors: Record<string, string>
    loading: boolean
    success: boolean
    errorMessage: string
  }
  actions: {
    setField: (field: keyof CreateProductInput, value: any) => void
    addImage: (url: string) => void
    removeImage: (index: number) => void
    addDefectImage: (url: string) => void
    removeDefectImage: (index: number) => void
    handleSubmit: (e: React.FormEvent) => Promise<void>
    clearError: () => void
  }
}

export const useAddProductViewModel = (): AddProductViewModel => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  const [formData, setFormData] = useState<CreateProductInput>({
    title: '',
    description: '',
    categoryId: '',
    brand: '',
    size: '',
    color: '',
    material: '',
    gender: undefined,
    style: '',
    price: 0,
    condition: 'very-good',
    defects: '',
    defectImages: [],
    images: [],
    quantity: 1,
    authenticity: undefined,
  })

  const setField = (field: keyof CreateProductInput, value: any) => {
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

  const addImage = (url: string) => {
    if (url.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), url.trim()],
      }))
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || [],
    }))
  }

  const addDefectImage = (url: string) => {
    if (url.trim()) {
      setFormData((prev) => ({
        ...prev,
        defectImages: [...(prev.defectImages || []), url.trim()],
      }))
    }
  }

  const removeDefectImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      defectImages: prev.defectImages?.filter((_, i) => i !== index) || [],
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề là bắt buộc'
    }

    if (!formData.categoryId.trim()) {
      newErrors.categoryId = 'Danh mục là bắt buộc'
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Giá phải lớn hơn 0'
    }

    if (!formData.condition) {
      newErrors.condition = 'Tình trạng là bắt buộc'
    }

    if (!formData.images || formData.images.length === 0) {
      newErrors.images = 'Cần ít nhất 1 ảnh sản phẩm'
    }

    if (formData.condition === 'fair' && !formData.defects?.trim()) {
      newErrors.defects = 'Mô tả khuyết điểm là bắt buộc khi tình trạng là "Khá"'
    }

    if (formData.defects?.trim() && (!formData.defectImages || formData.defectImages.length === 0)) {
      newErrors.defectImages = 'Cần ít nhất 1 ảnh khuyết điểm khi có mô tả khuyết điểm'
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

    // Kiểm tra profile trước khi đăng bán
    try {
      const canSellResult = await profileApi.checkCanSell()
      if (!canSellResult.canSell) {
        setErrorMessage(
          `Hồ sơ của bạn chưa hoàn thiện. Vui lòng cập nhật thông tin trước khi đăng bán. ` +
          `Thiếu: ${canSellResult.missingFields?.join(', ') || 'Thông tin chưa đầy đủ'}`
        )
        // Redirect đến trang profile sau 3 giây
        setTimeout(() => {
          navigate('/user/profile')
        }, 3000)
        return
      }
    } catch (err: any) {
      // Nếu không kiểm tra được, vẫn cho phép thử đăng bán (backend sẽ kiểm tra)
      console.warn('Could not check profile:', err)
    }

    setLoading(true)

    try {
      // Chuẩn bị data để gửi
      const submitData: CreateProductInput = {
        ...formData,
        description: formData.description || undefined,
        brand: formData.brand || undefined,
        size: formData.size || undefined,
        color: formData.color || undefined,
        material: formData.material || undefined,
        gender: formData.gender || undefined,
        style: formData.style || undefined,
        defects: formData.defects || undefined,
        defectImages: formData.defectImages && formData.defectImages.length > 0 ? formData.defectImages : undefined,
        quantity: formData.quantity || 1,
        authenticity: formData.authenticity !== undefined ? formData.authenticity : undefined,
      }

      await productApi.create(submitData)
      setSuccess(true)
      
      // Redirect về trang sản phẩm của tôi sau 2 giây
      setTimeout(() => {
        navigate('/user/my-products')
      }, 2000)
    } catch (err: any) {
      const errorData: ProductError = err.response?.data || {
        code: 'SYSTEM_ERROR',
        message: 'Có lỗi xảy ra. Vui lòng thử lại.',
      }

      // Xử lý lỗi PROFILE_INCOMPLETE - redirect đến trang profile
      if (errorData.code === 'PROFILE_INCOMPLETE') {
        setErrorMessage(
          `Hồ sơ của bạn chưa hoàn thiện. Vui lòng cập nhật thông tin trước khi đăng bán. ` +
          `Thiếu: ${errorData.missingFields?.join(', ') || 'Thông tin chưa đầy đủ'}`
        )
        setTimeout(() => {
          navigate('/user/profile')
        }, 3000)
        return
      }

      setErrorMessage(errorData.message || 'Có lỗi xảy ra')

      // Xử lý validation errors từ server
      if (errorData.details) {
        const serverErrors: Record<string, string> = {}
        errorData.details.forEach((detail) => {
          const field = detail.path[0]
          serverErrors[field] = detail.message
        })
        setErrors(serverErrors)
      }
    } finally {
      setLoading(false)
    }
  }

  const clearError = (): void => {
    setErrorMessage('')
    setErrors({})
  }

  // Fetch categories khi component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true)
        const response = await categoryApi.getPublic()
        setCategories(response.data || [])
      } catch (err) {
        console.error('Failed to fetch categories:', err)
        setCategories([])
      } finally {
        setCategoriesLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return {
    state: {
      formData,
      categories,
      categoriesLoading,
      errors,
      loading,
      success,
      errorMessage,
    },
    actions: {
      setField,
      addImage,
      removeImage,
      addDefectImage,
      removeDefectImage,
      handleSubmit,
      clearError,
    },
  }
}

