import { useState, useEffect } from 'react'
import { profileApi } from '../services/api'
import type { 
  ProfileResponse, 
  ProfileBasicInfo, 
  ShippingAddress, 
  SellerInfo 
} from '../models/Profile'

interface ProfileFormData {
  basicInfo: ProfileBasicInfo
  shippingAddresses: ShippingAddress[]
  sellerInfo: SellerInfo
}

interface Errors {
  [key: string]: string
}

export function useProfileViewModel() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null)
  const [formData, setFormData] = useState<ProfileFormData>({
    basicInfo: {},
    shippingAddresses: [],
    sellerInfo: {}
  })
  const [errors, setErrors] = useState<Errors>({})
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [newAddress, setNewAddress] = useState<Partial<ShippingAddress>>({
    fullName: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    street: '',
    note: '',
    isDefaultShipping: false,
    isDefaultPickup: false
  })

  // Load profile data
  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      setErrorMessage(null)
      const data = await profileApi.getProfile()
      setProfileData(data)
      setFormData({
        basicInfo: data.profile || {},
        shippingAddresses: data.shippingAddresses || [],
        sellerInfo: data.sellerInfo || {}
      })
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Không thể tải thông tin profile')
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setErrorMessage(null)
  }

  const clearSuccess = () => {
    setSuccessMessage(null)
  }

  // Basic Info handlers
  const setBasicInfoField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        [field]: value
      }
    }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateBasicInfo = (): boolean => {
    const newErrors: Errors = {}
    
    if (!formData.basicInfo.fullName?.trim()) {
      newErrors.fullName = 'Họ và tên là bắt buộc'
    }
    
    if (!formData.basicInfo.phone?.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc'
    } else if (!/^[0-9]{10,11}$/.test(formData.basicInfo.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveBasicInfo = async () => {
    if (!validateBasicInfo()) {
      return
    }

    try {
      setSaving(true)
      setErrorMessage(null)
      await profileApi.updateBasicInfo({
        fullName: formData.basicInfo.fullName!,
        phone: formData.basicInfo.phone!,
        avatar: formData.basicInfo.avatar,
        address: formData.basicInfo.address
      })
      setSuccessMessage('Đã cập nhật thông tin cá nhân thành công')
      await loadProfile()
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Không thể cập nhật thông tin')
    } finally {
      setSaving(false)
    }
  }

  // Shipping Address handlers
  const setNewAddressField = (field: string, value: any) => {
    setNewAddress(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateShippingAddress = (address: Partial<ShippingAddress>): boolean => {
    if (!address.fullName?.trim()) return false
    if (!address.phone?.trim()) return false
    if (!address.province?.trim()) return false
    if (!address.district?.trim()) return false
    if (!address.ward?.trim()) return false
    return true
  }

  const handleAddShippingAddress = async () => {
    if (!validateShippingAddress(newAddress)) {
      setErrorMessage('Vui lòng điền đầy đủ thông tin địa chỉ')
      return
    }

    try {
      setSaving(true)
      setErrorMessage(null)
      
      // Nếu đặt làm mặc định giao hàng, bỏ mặc định của địa chỉ cũ
      if (newAddress.isDefaultShipping) {
        const currentDefault = formData.shippingAddresses.find(addr => addr.isDefaultShipping)
        if (currentDefault?._id) {
          await profileApi.updateShippingAddress(currentDefault._id, { 
            isDefaultShipping: false 
          })
        }
      }
      
      // Nếu đặt làm mặc định lấy hàng, bỏ mặc định của địa chỉ cũ
      if (newAddress.isDefaultPickup) {
        const currentDefault = formData.shippingAddresses.find(addr => addr.isDefaultPickup)
        if (currentDefault?._id) {
          await profileApi.updateShippingAddress(currentDefault._id, { 
            isDefaultPickup: false 
          })
        }
      }
      
      await profileApi.addShippingAddress(newAddress as ShippingAddress)
      setSuccessMessage('Đã thêm địa chỉ thành công')
      setNewAddress({
        fullName: '',
        phone: '',
        province: '',
        district: '',
        ward: '',
        street: '',
        note: '',
        isDefaultShipping: false,
        isDefaultPickup: false
      })
      await loadProfile()
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Không thể thêm địa chỉ')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateShippingAddress = async (addressId: string, data: Partial<ShippingAddress>) => {
    try {
      setSaving(true)
      setErrorMessage(null)
      await profileApi.updateShippingAddress(addressId, data)
      setSuccessMessage('Đã cập nhật địa chỉ thành công')
      setEditingAddressId(null)
      await loadProfile()
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Không thể cập nhật địa chỉ')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteShippingAddress = async (addressId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      return
    }

    try {
      setSaving(true)
      setErrorMessage(null)
      await profileApi.deleteShippingAddress(addressId)
      setSuccessMessage('Đã xóa địa chỉ thành công')
      await loadProfile()
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Không thể xóa địa chỉ')
    } finally {
      setSaving(false)
    }
  }

  const handleSetDefaultShipping = async (addressId: string) => {
    try {
      setSaving(true)
      setErrorMessage(null)
      
      // Tìm địa chỉ hiện tại đang là mặc định giao hàng
      const currentDefault = formData.shippingAddresses.find(addr => addr.isDefaultShipping && addr._id !== addressId)
      
      // Bỏ mặc định của địa chỉ cũ (nếu có)
      if (currentDefault?._id) {
        await profileApi.updateShippingAddress(currentDefault._id, { 
          isDefaultShipping: false 
        })
      }
      
      // Đặt địa chỉ mới làm mặc định
      await profileApi.updateShippingAddress(addressId, { 
        isDefaultShipping: true 
      })
      
      setSuccessMessage('Đã cập nhật địa chỉ mặc định giao hàng')
      await loadProfile()
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Không thể cập nhật địa chỉ mặc định')
    } finally {
      setSaving(false)
    }
  }

  const handleSetDefaultPickup = async (addressId: string) => {
    try {
      setSaving(true)
      setErrorMessage(null)
      
      // Tìm địa chỉ hiện tại đang là mặc định lấy hàng
      const currentDefault = formData.shippingAddresses.find(addr => addr.isDefaultPickup && addr._id !== addressId)
      
      // Bỏ mặc định của địa chỉ cũ (nếu có)
      if (currentDefault?._id) {
        await profileApi.updateShippingAddress(currentDefault._id, { 
          isDefaultPickup: false 
        })
      }
      
      // Đặt địa chỉ mới làm mặc định
      await profileApi.updateShippingAddress(addressId, { 
        isDefaultPickup: true 
      })
      
      setSuccessMessage('Đã cập nhật địa chỉ mặc định lấy hàng')
      await loadProfile()
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Không thể cập nhật địa chỉ mặc định')
    } finally {
      setSaving(false)
    }
  }

  // Seller Info handlers
  const setSellerInfoField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      sellerInfo: {
        ...prev.sellerInfo,
        [field]: value
      }
    }))
  }

  const setContactMethodField = (field: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      sellerInfo: {
        ...prev.sellerInfo,
        contactMethods: {
          ...prev.sellerInfo.contactMethods,
          [field]: value
        }
      }
    }))
  }

  const setPaymentMethodField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      sellerInfo: {
        ...prev.sellerInfo,
        paymentMethods: {
          ...prev.sellerInfo.paymentMethods,
          [field]: value
        }
      }
    }))
  }

  const setAgreementField = (field: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      sellerInfo: {
        ...prev.sellerInfo,
        agreements: {
          ...prev.sellerInfo.agreements,
          [field]: value
        }
      }
    }))
  }

  const setPickupAddress = (address: any) => {
    setFormData(prev => ({
      ...prev,
      sellerInfo: {
        ...prev.sellerInfo,
        pickupAddressId: address?._id || null
      }
    }))
  }

  const validateSellerInfo = (): boolean => {
    if (!formData.sellerInfo.shopName?.trim()) {
      setErrorMessage('Tên hiển thị người bán là bắt buộc')
      return false
    }
    if (!formData.sellerInfo.tradingArea?.trim()) {
      setErrorMessage('Khu vực giao dịch là bắt buộc')
      return false
    }
    if (!formData.sellerInfo.agreements?.termsAccepted) {
      setErrorMessage('Vui lòng đồng ý điều khoản')
      return false
    }
    if (!formData.sellerInfo.agreements?.noProhibitedItems) {
      setErrorMessage('Vui lòng cam kết không bán hàng cấm')
      return false
    }
    return true
  }

  const handleSaveSellerInfo = async () => {
    if (!validateSellerInfo()) {
      return
    }

    try {
      setSaving(true)
      setErrorMessage(null)
      await profileApi.updateSellerInfo(formData.sellerInfo)
      setSuccessMessage('Đã cập nhật thông tin người bán thành công')
      await loadProfile()
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Không thể cập nhật thông tin người bán')
    } finally {
      setSaving(false)
    }
  }

  return {
    state: {
      loading,
      saving,
      errorMessage,
      successMessage,
      profileData,
      formData,
      errors,
      editingAddressId,
      newAddress
    },
    actions: {
      loadProfile,
      clearError,
      clearSuccess,
      setBasicInfoField,
      handleSaveBasicInfo,
      setNewAddressField,
      handleAddShippingAddress,
      handleUpdateShippingAddress,
      handleDeleteShippingAddress,
      handleSetDefaultShipping,
      handleSetDefaultPickup,
      setEditingAddressId,
      setSellerInfoField,
      setContactMethodField,
      setPaymentMethodField,
      setAgreementField,
      setPickupAddress,
      handleSaveSellerInfo
    }
  }
}

