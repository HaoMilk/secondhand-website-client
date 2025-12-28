import { useState, useEffect } from 'react'
import { profileApi } from '../../services/api'
import type { ShippingAddress } from '../../models/Profile'
import './AddressSelector.css'

interface AddressSelectorProps {
  selectedAddressId?: string
  onSelectAddress: (address: ShippingAddress | null) => void
  label?: string
  required?: boolean
  disabled?: boolean
  showAddButton?: boolean
  onAddNew?: () => void
}

const AddressSelector = ({
  selectedAddressId,
  onSelectAddress,
  label = 'Chọn địa chỉ',
  required = false,
  disabled = false,
  showAddButton = true,
  onAddNew
}: AddressSelectorProps) => {
  const [addresses, setAddresses] = useState<ShippingAddress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAddresses()
  }, [])

  const loadAddresses = async () => {
    try {
      setLoading(true)
      setError(null)
      const profile = await profileApi.getProfile()
      setAddresses(profile.shippingAddresses || [])
      
      // Nếu có địa chỉ mặc định lấy hàng và chưa chọn địa chỉ nào, tự động chọn địa chỉ mặc định
      if (!selectedAddressId && profile.shippingAddresses) {
        const defaultPickup = profile.shippingAddresses.find(addr => addr.isDefaultPickup)
        if (defaultPickup) {
          onSelectAddress(defaultPickup)
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải danh sách địa chỉ')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const addressId = e.target.value
    if (addressId === '') {
      onSelectAddress(null)
      return
    }
    
    const selectedAddress = addresses.find(addr => addr._id === addressId)
    if (selectedAddress) {
      onSelectAddress(selectedAddress)
    }
  }

  const formatAddress = (address: ShippingAddress): string => {
    const parts = []
    if (address.street) parts.push(address.street)
    parts.push(`${address.ward}, ${address.district}, ${address.province}`)
    return parts.join(', ')
  }

  if (loading) {
    return (
      <div className="address-selector">
        <label>{label} {required && <span className="required">*</span>}</label>
        <div className="loading-text">Đang tải danh sách địa chỉ...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="address-selector">
        <label>{label} {required && <span className="required">*</span>}</label>
        <div className="error-text">{error}</div>
      </div>
    )
  }

  return (
    <div className="address-selector">
      <div className="address-selector-header">
        <label htmlFor="address-select">
          {label} {required && <span className="required">*</span>}
        </label>
        {showAddButton && onAddNew && (
          <button
            type="button"
            onClick={onAddNew}
            className="add-address-link"
            disabled={disabled}
          >
            + Thêm địa chỉ mới
          </button>
        )}
      </div>
      
      {addresses.length === 0 ? (
        <div className="no-addresses">
          <p>Bạn chưa có địa chỉ nào trong sổ địa chỉ.</p>
          {showAddButton && onAddNew && (
            <button
              type="button"
              onClick={onAddNew}
              className="add-address-button"
              disabled={disabled}
            >
              Thêm địa chỉ đầu tiên
            </button>
          )}
        </div>
      ) : (
        <>
          <select
            id="address-select"
            value={selectedAddressId || ''}
            onChange={handleSelectChange}
            disabled={disabled}
            required={required}
            className="address-select"
          >
            <option value="">-- Chọn địa chỉ --</option>
            {addresses.map((address) => (
              <option key={address._id} value={address._id}>
                {address.fullName} - {formatAddress(address)}
                {address.isDefaultPickup && ' (Mặc định lấy hàng)'}
              </option>
            ))}
          </select>
          
          {selectedAddressId && (
            <div className="selected-address-info">
              {(() => {
                const selected = addresses.find(addr => addr._id === selectedAddressId)
                if (!selected) return null
                return (
                  <div className="address-card-preview">
                    <div className="address-preview-name">{selected.fullName}</div>
                    <div className="address-preview-phone">{selected.phone}</div>
                    <div className="address-preview-details">{formatAddress(selected)}</div>
                    {selected.note && (
                      <div className="address-preview-note">Ghi chú: {selected.note}</div>
                    )}
                  </div>
                )
              })()}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AddressSelector

