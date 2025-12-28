import { useState, useEffect } from 'react'
import { vietnamAddressApi, type Province } from '../services/address.api'
import './ProvinceSelector.css'

interface ProvinceSelectorProps {
  value?: string
  onChange: (name: string) => void
  disabled?: boolean
  required?: boolean
  label?: string
  placeholder?: string
  allowMultiple?: boolean
}

const ProvinceSelector = ({
  value,
  onChange,
  disabled = false,
  required = false,
  label = 'Tỉnh/Thành phố',
  placeholder = '-- Chọn Tỉnh/Thành phố --',
  allowMultiple = false,
}: ProvinceSelectorProps) => {
  const [provinces, setProvinces] = useState<Province[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProvinces = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await vietnamAddressApi.getProvinces()
        setProvinces(data)
      } catch (err: any) {
        setError(err.message || 'Không thể tải danh sách tỉnh/thành phố')
        console.error('Error loading provinces:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProvinces()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value
    const selectedProvince = provinces.find((p) => p.code === selectedCode)
    if (selectedProvince) {
      onChange(selectedProvince.name)
    }
  }

  // Tìm code từ name để set giá trị selected
  const getProvinceCode = (name?: string): string => {
    if (!name) return ''
    const province = provinces.find((p) => p.name === name)
    return province?.code || ''
  }

  if (loading) {
    return (
      <div className="province-selector">
        {label && (
          <label>
            {label} {required && <span className="required">*</span>}
          </label>
        )}
        <div className="loading-text">Đang tải danh sách tỉnh/thành phố...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="province-selector">
        {label && (
          <label>
            {label} {required && <span className="required">*</span>}
          </label>
        )}
        <div className="error-text">{error}</div>
      </div>
    )
  }

  return (
    <div className="province-selector">
      {label && (
        <label htmlFor="province-select">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <select
        id="province-select"
        value={getProvinceCode(value)}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        className="province-select"
      >
        <option value="">{placeholder}</option>
        {provinces.map((p) => (
          <option key={p.code} value={p.code}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ProvinceSelector

