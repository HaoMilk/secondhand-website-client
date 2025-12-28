import { useEffect } from 'react'
import { useVietnamAddress } from '../../hooks/useVietnamAddress'
import './AddressDropdown.css'

interface AddressDropdownProps {
  province?: string // Có thể là code hoặc name
  district?: string // Có thể là code hoặc name
  ward?: string // Có thể là code hoặc name
  onProvinceChange: (code: string, name: string) => void
  onDistrictChange: (code: string, name: string) => void
  onWardChange: (code: string, name: string) => void
  disabled?: boolean
  required?: boolean
  showLabels?: boolean
}

const AddressDropdown = ({
  province,
  district,
  ward,
  onProvinceChange,
  onDistrictChange,
  onWardChange,
  disabled = false,
  required = false,
  showLabels = true,
}: AddressDropdownProps) => {
  // Tìm code từ name nếu province/district/ward là name thay vì code
  const getProvinceCode = (value?: string, provincesList: any[] = []): string => {
    if (!value) return ''
    // Nếu là code (thường là số), trả về luôn
    if (/^\d+$/.test(value)) return value
    // Nếu là name, tìm code
    const found = provincesList.find(p => p.name === value)
    return found?.code || ''
  }

  const provinceCode = getProvinceCode(province, [])
  
  const {
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
  } = useVietnamAddress(provinceCode, district, ward)
  
  // Cập nhật selectedProvince khi provinces được load và province là name
  useEffect(() => {
    if (province && provinces.length > 0 && !selectedProvince) {
      const code = getProvinceCode(province, provinces)
      if (code) {
        setSelectedProvince(code)
      }
    }
  }, [provinces, province, selectedProvince, setSelectedProvince])

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value
    setSelectedProvince(code)
    const selectedProvinceData = provinces.find((p) => p.code === code)
    if (selectedProvinceData) {
      onProvinceChange(code, selectedProvinceData.name)
    }
  }

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value
    setSelectedDistrict(code)
    const selectedDistrictData = districts.find((d) => d.code === code)
    if (selectedDistrictData) {
      onDistrictChange(code, selectedDistrictData.name)
    }
  }

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value
    setSelectedWard(code)
    const selectedWardData = wards.find((w) => w.code === code)
    if (selectedWardData) {
      onWardChange(code, selectedWardData.name)
    }
  }

  if (loading && provinces.length === 0) {
    return (
      <div className="address-dropdown">
        <div className="loading-text">Đang tải danh sách địa chỉ...</div>
      </div>
    )
  }

  if (error && provinces.length === 0) {
    return (
      <div className="address-dropdown">
        <div className="error-text">{error}</div>
      </div>
    )
  }

  return (
    <div className="address-dropdown">
      <div className="address-dropdown-row">
        <div className="form-group-inline">
          {showLabels && (
            <label>
              Tỉnh/Thành phố {required && <span className="required">*</span>}
            </label>
          )}
          <select
            value={selectedProvince || ''}
            onChange={handleProvinceChange}
            disabled={disabled || loading}
            required={required}
            className="address-select"
          >
            <option value="">-- Chọn Tỉnh/Thành phố --</option>
            {provinces.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group-inline">
          {showLabels && (
            <label>
              Quận/Huyện {required && <span className="required">*</span>}
            </label>
          )}
          <select
            value={selectedDistrict || ''}
            onChange={handleDistrictChange}
            disabled={disabled || loading || !selectedProvince}
            required={required}
            className="address-select"
          >
            <option value="">-- Chọn Quận/Huyện --</option>
            {districts.map((d) => (
              <option key={d.code} value={d.code}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group-inline">
          {showLabels && (
            <label>
              Phường/Xã {required && <span className="required">*</span>}
            </label>
          )}
          <select
            value={selectedWard || ''}
            onChange={handleWardChange}
            disabled={disabled || loading || !selectedDistrict}
            required={required}
            className="address-select"
          >
            <option value="">-- Chọn Phường/Xã --</option>
            {wards.map((w) => (
              <option key={w.code} value={w.code}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default AddressDropdown

