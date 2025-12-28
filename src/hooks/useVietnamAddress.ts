import { useState, useEffect, useCallback } from 'react'
import { vietnamAddressApi, type Province, type District, type Ward } from '../services/address.api'

interface UseVietnamAddressReturn {
  provinces: Province[]
  districts: District[]
  wards: Ward[]
  selectedProvince: string
  selectedDistrict: string
  selectedWard: string
  loading: boolean
  error: string | null
  setSelectedProvince: (code: string) => void
  setSelectedDistrict: (code: string) => void
  setSelectedWard: (code: string) => void
  getProvinceName: (code: string) => string
  getDistrictName: (code: string) => string
  getWardName: (code: string) => string
  reset: () => void
}

export const useVietnamAddress = (
  initialProvince?: string,
  initialDistrict?: string,
  initialWard?: string
): UseVietnamAddressReturn => {
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [selectedProvince, setSelectedProvinceState] = useState<string>(initialProvince || '')
  const [selectedDistrict, setSelectedDistrictState] = useState<string>(initialDistrict || '')
  const [selectedWard, setSelectedWardState] = useState<string>(initialWard || '')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Load danh sách tỉnh/thành phố khi component mount
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await vietnamAddressApi.getProvinces()
        setProvinces(data)
        
        // Nếu initialProvince là name thay vì code, tìm code tương ứng
        if (initialProvince && !data.find(p => p.code === initialProvince)) {
          const province = data.find(p => p.name === initialProvince)
          if (province) {
            setSelectedProvinceState(province.code)
          }
        } else if (initialProvince) {
          setSelectedProvinceState(initialProvince)
        }
      } catch (err: any) {
        setError(err.message || 'Không thể tải danh sách tỉnh/thành phố')
        console.error('Error loading provinces:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProvinces()
  }, [])

  // Load quận/huyện khi chọn tỉnh/thành phố
  useEffect(() => {
    if (!selectedProvince) {
      setDistricts([])
      setWards([])
      setSelectedDistrictState('')
      setSelectedWardState('')
      return
    }

    const loadDistricts = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await vietnamAddressApi.getDistricts(selectedProvince)
        setDistricts(data)
        
        // Nếu có initialDistrict và đây là lần đầu load (không phải do user đổi tỉnh)
        // Tìm code từ name nếu cần
        if (initialDistrict && data.length > 0) {
          const district = data.find(d => d.code === initialDistrict || d.name === initialDistrict)
          if (district) {
            setSelectedDistrictState(district.code)
          } else {
            setSelectedDistrictState('')
          }
        } else {
          setSelectedDistrictState('')
        }
        setSelectedWardState('')
        setWards([])
      } catch (err: any) {
        setError(err.message || 'Không thể tải danh sách quận/huyện')
        console.error('Error loading districts:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDistricts()
  }, [selectedProvince])

  // Load phường/xã khi chọn quận/huyện
  useEffect(() => {
    if (!selectedDistrict) {
      setWards([])
      setSelectedWardState('')
      return
    }

    const loadWards = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await vietnamAddressApi.getWards(selectedDistrict)
        setWards(data)
        
        // Nếu có initialWard và đây là lần đầu load (không phải do user đổi quận/huyện)
        // Tìm code từ name nếu cần
        if (initialWard && data.length > 0) {
          const ward = data.find(w => w.code === initialWard || w.name === initialWard)
          if (ward) {
            setSelectedWardState(ward.code)
          } else {
            setSelectedWardState('')
          }
        } else {
          setSelectedWardState('')
        }
      } catch (err: any) {
        setError(err.message || 'Không thể tải danh sách phường/xã')
        console.error('Error loading wards:', err)
      } finally {
        setLoading(false)
      }
    }

    loadWards()
  }, [selectedDistrict])

  const setSelectedProvince = useCallback((code: string) => {
    setSelectedProvinceState(code)
  }, [])

  const setSelectedDistrict = useCallback((code: string) => {
    setSelectedDistrictState(code)
  }, [])

  const setSelectedWard = useCallback((code: string) => {
    setSelectedWardState(code)
  }, [])

  const getProvinceName = useCallback(
    (code: string): string => {
      const province = provinces.find((p) => p.code === code)
      return province?.name || ''
    },
    [provinces]
  )

  const getDistrictName = useCallback(
    (code: string): string => {
      const district = districts.find((d) => d.code === code)
      return district?.name || ''
    },
    [districts]
  )

  const getWardName = useCallback(
    (code: string): string => {
      const ward = wards.find((w) => w.code === code)
      return ward?.name || ''
    },
    [wards]
  )

  const reset = useCallback(() => {
    setSelectedProvinceState('')
    setSelectedDistrictState('')
    setSelectedWardState('')
    setDistricts([])
    setWards([])
  }, [])

  return {
    provinces,
    districts,
    wards,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    loading,
    error,
    setSelectedProvince,
    setSelectedDistrict,
    setSelectedWard,
    getProvinceName,
    getDistrictName,
    getWardName,
    reset,
  }
}

