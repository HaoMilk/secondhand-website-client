import { useState, useEffect } from 'react'
import { useVietnamAddress } from '../hooks/useVietnamAddress'
import { vietnamAddressApi } from '../services/address.api'
import './ProfileSection.css'

interface ProfileBasicInfoProps {
  formData: {
    fullName?: string
    phone?: string
    avatar?: string
    address?: {
      province?: string
      district?: string
      ward?: string
      street?: string
    }
  }
  errors: { [key: string]: string }
  saving: boolean
  onFieldChange: (field: string, value: any) => void
  onSave: () => void
}

const ProfileBasicInfo = ({
  formData,
  errors,
  saving,
  onFieldChange,
  onSave
}: ProfileBasicInfoProps) => {
  // Tìm province code từ name
  const [provinceCode, setProvinceCode] = useState<string>('')
  const [districtCode, setDistrictCode] = useState<string>('')
  const [wardCode, setWardCode] = useState<string>('')
  
  const {
    provinces,
    districts,
    wards,
    loading: addressLoading,
    setSelectedProvince,
    setSelectedDistrict,
    setSelectedWard,
    getProvinceName,
    getDistrictName,
    getWardName
  } = useVietnamAddress()

  // Load province/district/ward codes từ names khi component mount
  useEffect(() => {
    const loadCodes = async () => {
      if (formData.address?.province) {
        const provinces = await vietnamAddressApi.getProvinces()
        const province = provinces.find(p => p.name === formData.address?.province)
        if (province) {
          setProvinceCode(province.code)
          setSelectedProvince(province.code)
          
          if (formData.address?.district) {
            const districts = await vietnamAddressApi.getDistricts(province.code)
            const district = districts.find(d => d.name === formData.address?.district)
            if (district) {
              setDistrictCode(district.code)
              setSelectedDistrict(district.code)
              
              if (formData.address?.ward) {
                const wards = await vietnamAddressApi.getWards(district.code)
                const ward = wards.find(w => w.name === formData.address?.ward)
                if (ward) {
                  setWardCode(ward.code)
                  setSelectedWard(ward.code)
                }
              }
            }
          }
        }
      }
    }
    loadCodes()
  }, [])

  const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value
    setProvinceCode(code)
    setDistrictCode('')
    setWardCode('')
    if (code) {
      const province = provinces.find(p => p.code === code)
      if (province) {
        onFieldChange('address', {
          ...formData.address,
          province: province.name,
          district: '',
          ward: ''
        })
        setSelectedProvince(code)
      }
    } else {
      onFieldChange('address', {
        ...formData.address,
        province: '',
        district: '',
        ward: ''
      })
    }
  }

  const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value
    setDistrictCode(code)
    setWardCode('')
    if (code) {
      const district = districts.find(d => d.code === code)
      if (district) {
        onFieldChange('address', {
          ...formData.address,
          district: district.name,
          ward: ''
        })
        setSelectedDistrict(code)
      }
    } else {
      onFieldChange('address', {
        ...formData.address,
        district: '',
        ward: ''
      })
    }
  }

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value
    setWardCode(code)
    if (code) {
      const ward = wards.find(w => w.code === code)
      if (ward) {
        onFieldChange('address', {
          ...formData.address,
          ward: ward.name
        })
        setSelectedWard(code)
      }
    } else {
      onFieldChange('address', {
        ...formData.address,
        ward: ''
      })
    }
  }

  return (
    <div className="profile-section">
      <div className="section-header">
        <h2>Thông tin cá nhân</h2>
        <p className="section-description">Thông tin bắt buộc để mua và bán hàng</p>
      </div>

      <div className="form-group">
        <label htmlFor="fullName">
          Họ và tên <span className="required">*</span>
        </label>
        <input
          type="text"
          id="fullName"
          value={formData.fullName || ''}
          onChange={(e) => onFieldChange('fullName', e.target.value)}
          placeholder="Nhập họ và tên"
          disabled={saving}
          className={errors.fullName ? 'error' : ''}
        />
        {errors.fullName && (
          <span className="field-error">{errors.fullName}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="phone">
          Số điện thoại <span className="required">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone || ''}
          onChange={(e) => onFieldChange('phone', e.target.value)}
          placeholder="Nhập số điện thoại"
          disabled={saving}
          className={errors.phone ? 'error' : ''}
        />
        {errors.phone && (
          <span className="field-error">{errors.phone}</span>
        )}
        {formData.phone && !errors.phone && (
          <span className="field-hint">Trạng thái: {formData.phone ? 'Chưa xác thực' : ''}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="avatar">Ảnh đại diện</label>
        <input
          type="text"
          id="avatar"
          value={formData.avatar || ''}
          onChange={(e) => onFieldChange('avatar', e.target.value)}
          placeholder="Nhập URL ảnh đại diện"
          disabled={saving}
        />
        {formData.avatar && (
          <div className="avatar-preview">
            <img src={formData.avatar} alt="Avatar preview" />
          </div>
        )}
      </div>

      <div className="form-group">
        <label>
          Địa chỉ <span className="required">*</span>
        </label>
        <div className="address-fields">
          <div className="form-group">
            <label htmlFor="province">Tỉnh/Thành phố</label>
            <select
              id="province"
              value={provinceCode}
              onChange={handleProvinceChange}
              disabled={saving || addressLoading}
              className={errors.address ? 'error' : ''}
            >
              <option value="">-- Chọn Tỉnh/Thành phố --</option>
              {provinces.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="district">Quận/Huyện</label>
            <select
              id="district"
              value={districtCode}
              onChange={handleDistrictChange}
              disabled={saving || addressLoading || !provinceCode}
              className={errors.address ? 'error' : ''}
            >
              <option value="">-- Chọn Quận/Huyện --</option>
              {districts.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="ward">Phường/Xã</label>
            <select
              id="ward"
              value={wardCode}
              onChange={handleWardChange}
              disabled={saving || addressLoading || !districtCode}
              className={errors.address ? 'error' : ''}
            >
              <option value="">-- Chọn Phường/Xã --</option>
              {wards.map((w) => (
                <option key={w.code} value={w.code}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="street">Đường/Số nhà</label>
            <input
              type="text"
              id="street"
              value={formData.address?.street || ''}
              onChange={(e) => onFieldChange('address', {
                ...formData.address,
                street: e.target.value
              })}
              placeholder="Nhập tên đường, số nhà"
              disabled={saving}
            />
          </div>
        </div>
        {errors.address && (
          <span className="field-error">{errors.address}</span>
        )}
        <span className="field-hint">
          Địa chỉ này sẽ được tự động đồng bộ từ địa chỉ giao hàng mặc định nếu bạn chưa nhập
        </span>
      </div>

      <div className="section-actions">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="save-button"
        >
          {saving ? 'Đang lưu...' : 'Lưu thông tin'}
        </button>
      </div>
    </div>
  )
}

export default ProfileBasicInfo

