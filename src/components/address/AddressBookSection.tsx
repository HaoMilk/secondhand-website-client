import { useState, useEffect } from 'react'
import '../profile/ProfileSection.css'
import './AddressBookSection.css'
import AddressDropdown from './AddressDropdown'
import { vietnamAddressApi } from '../../services/address.api'
import type { ShippingAddress } from '../../models/Profile'

interface AddressBookSectionProps {
  addresses: ShippingAddress[]
  newAddress: Partial<ShippingAddress>
  saving: boolean
  editingAddressId: string | null
  onNewAddressFieldChange: (field: string, value: any) => void
  onAddAddress: () => void
  onUpdateAddress: (addressId: string, data: Partial<ShippingAddress>) => void
  onDeleteAddress: (addressId: string) => void
  onSetDefaultShipping: (addressId: string) => void
  onSetDefaultPickup: (addressId: string) => void
  onSetEditing: (addressId: string | null) => void
}

const AddressBookSection = ({
  addresses,
  newAddress,
  saving,
  editingAddressId,
  onNewAddressFieldChange,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress,
  onSetDefaultShipping,
  onSetDefaultPickup,
  onSetEditing
}: AddressBookSectionProps) => {
  const [editingAddress, setEditingAddress] = useState<Partial<ShippingAddress & { provinceCode?: string; districtCode?: string; wardCode?: string }>>({})
  const [provinces, setProvinces] = useState<any[]>([])

  // Load provinces để tìm code từ name
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const data = await vietnamAddressApi.getProvinces()
        setProvinces(data)
      } catch (error) {
        console.error('Error loading provinces:', error)
      }
    }
    loadProvinces()
  }, [])

  const findProvinceCode = (name: string): string => {
    const province = provinces.find(p => p.name === name)
    return province?.code || ''
  }

  const handleEdit = async (address: ShippingAddress) => {
    const editData: any = { ...address }
    
    // Nếu không có code nhưng có name, tìm code từ name
    if (address.province && !(address as any).provinceCode && provinces.length > 0) {
      editData.provinceCode = findProvinceCode(address.province)
    }
    
    setEditingAddress(editData)
    onSetEditing(address._id || null)
  }

  const handleCancelEdit = () => {
    setEditingAddress({})
    onSetEditing(null)
  }

  const handleSaveEdit = (addressId: string) => {
    onUpdateAddress(addressId, editingAddress)
    setEditingAddress({})
  }

  return (
    <div className="profile-section">
      <div className="section-header">
        <h2>Sổ địa chỉ</h2>
        <p className="section-description">Quản lý địa chỉ cho giao hàng và lấy hàng</p>
      </div>

      {/* Danh sách địa chỉ */}
      {addresses.length > 0 && (
        <div className="addresses-list">
          {addresses.map((address) => (
            <div key={address._id} className={`address-card ${address.isDefaultShipping || address.isDefaultPickup ? 'default' : ''}`}>
              <div className="address-badges">
                {address.isDefaultShipping && (
                  <div className="default-badge shipping-badge">Mặc định giao hàng</div>
                )}
                {address.isDefaultPickup && (
                  <div className="default-badge pickup-badge">Mặc định lấy hàng</div>
                )}
              </div>
              
              {editingAddressId === address._id ? (
                <div className="address-edit-form">
                  <div className="form-row">
                    <div className="form-group-inline">
                      <label>Tên người nhận</label>
                      <input
                        type="text"
                        value={editingAddress.fullName || ''}
                        onChange={(e) => setEditingAddress({ ...editingAddress, fullName: e.target.value })}
                        disabled={saving}
                      />
                    </div>
                    <div className="form-group-inline">
                      <label>Số điện thoại</label>
                      <input
                        type="tel"
                        value={editingAddress.phone || ''}
                        onChange={(e) => setEditingAddress({ ...editingAddress, phone: e.target.value })}
                        disabled={saving}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <AddressDropdown
                      province={(editingAddress as any).provinceCode || (editingAddress.province && findProvinceCode(editingAddress.province))}
                      district={(editingAddress as any).districtCode}
                      ward={(editingAddress as any).wardCode}
                      onProvinceChange={(code, name) => {
                        setEditingAddress({ 
                          ...editingAddress, 
                          province: name,
                          provinceCode: code 
                        })
                      }}
                      onDistrictChange={(code, name) => {
                        setEditingAddress({ 
                          ...editingAddress, 
                          district: name,
                          districtCode: code 
                        })
                      }}
                      onWardChange={(code, name) => {
                        setEditingAddress({ 
                          ...editingAddress, 
                          ward: name,
                          wardCode: code 
                        })
                      }}
                      disabled={saving}
                      required={false}
                      showLabels={true}
                    />
                  </div>
                  <div className="form-group">
                    <label>Số nhà, tên đường</label>
                    <input
                      type="text"
                      value={editingAddress.street || ''}
                      onChange={(e) => setEditingAddress({ ...editingAddress, street: e.target.value })}
                      disabled={saving}
                    />
                  </div>
                  <div className="form-group">
                    <label>Ghi chú</label>
                    <textarea
                      value={editingAddress.note || ''}
                      onChange={(e) => setEditingAddress({ ...editingAddress, note: e.target.value })}
                      disabled={saving}
                      rows={2}
                    />
                  </div>
                  <div className="address-actions">
                    <button
                      type="button"
                      onClick={() => address._id && handleSaveEdit(address._id)}
                      disabled={saving}
                      className="save-button"
                    >
                      Lưu
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={saving}
                      className="cancel-button"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="address-info">
                    <div className="address-name">{address.fullName}</div>
                    <div className="address-phone">{address.phone}</div>
                    <div className="address-details">
                      {address.street && `${address.street}, `}
                      {address.ward}, {address.district}, {address.province}
                    </div>
                    {address.note && (
                      <div className="address-note">Ghi chú: {address.note}</div>
                    )}
                  </div>
                  <div className="address-usage-options">
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="default-shipping"
                        checked={address.isDefaultShipping || false}
                        onChange={() => address._id && onSetDefaultShipping(address._id)}
                        disabled={saving}
                      />
                      <span>Đặt làm địa chỉ mặc định giao hàng</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="default-pickup"
                        checked={address.isDefaultPickup || false}
                        onChange={() => address._id && onSetDefaultPickup(address._id)}
                        disabled={saving}
                      />
                      <span>Đặt làm địa chỉ mặc định lấy hàng</span>
                    </label>
                  </div>
                  <div className="address-actions">
                    <button
                      type="button"
                      onClick={() => handleEdit(address)}
                      disabled={saving}
                      className="edit-button"
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => address._id && onDeleteAddress(address._id)}
                      disabled={saving}
                      className="delete-button"
                    >
                      Xóa
                    </button>
                  </div>
                  <div className="address-select-info">
                    <p className="select-info-text">
                      💡 Địa chỉ này có thể được chọn làm địa chỉ lấy hàng khi đăng sản phẩm
                    </p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Form thêm địa chỉ mới */}
      <div className="add-address-section">
        <h3>Thêm địa chỉ mới</h3>
        <div className="form-row">
          <div className="form-group-inline">
            <label>
              Tên người nhận <span className="required">*</span>
            </label>
            <input
              type="text"
              value={newAddress.fullName || ''}
              onChange={(e) => onNewAddressFieldChange('fullName', e.target.value)}
              placeholder="Nhập tên người nhận"
              disabled={saving}
            />
          </div>
          <div className="form-group-inline">
            <label>
              Số điện thoại <span className="required">*</span>
            </label>
            <input
              type="tel"
              value={newAddress.phone || ''}
              onChange={(e) => onNewAddressFieldChange('phone', e.target.value)}
              placeholder="Nhập số điện thoại"
              disabled={saving}
            />
          </div>
        </div>
        <div className="form-row">
          <AddressDropdown
            province={(newAddress as any).provinceCode}
            district={(newAddress as any).districtCode}
            ward={(newAddress as any).wardCode}
            onProvinceChange={(code, name) => {
              onNewAddressFieldChange('province', name)
              onNewAddressFieldChange('provinceCode', code)
            }}
            onDistrictChange={(code, name) => {
              onNewAddressFieldChange('district', name)
              onNewAddressFieldChange('districtCode', code)
            }}
            onWardChange={(code, name) => {
              onNewAddressFieldChange('ward', name)
              onNewAddressFieldChange('wardCode', code)
            }}
            disabled={saving}
            required={true}
            showLabels={true}
          />
        </div>
        <div className="form-group">
          <label>Số nhà, tên đường</label>
          <input
            type="text"
            value={newAddress.street || ''}
            onChange={(e) => onNewAddressFieldChange('street', e.target.value)}
            placeholder="VD: 123 Đường ABC"
            disabled={saving}
          />
        </div>
        <div className="form-group">
          <label>Ghi chú</label>
          <textarea
            value={newAddress.note || ''}
            onChange={(e) => onNewAddressFieldChange('note', e.target.value)}
            placeholder="Ghi chú thêm (nếu có)"
            disabled={saving}
            rows={2}
          />
        </div>
        <div className="form-group">
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={newAddress.isDefaultShipping || false}
                onChange={(e) => onNewAddressFieldChange('isDefaultShipping', e.target.checked)}
                disabled={saving}
              />
              <span>Đặt làm địa chỉ mặc định giao hàng</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={newAddress.isDefaultPickup || false}
                onChange={(e) => onNewAddressFieldChange('isDefaultPickup', e.target.checked)}
                disabled={saving}
              />
              <span>Đặt làm địa chỉ mặc định lấy hàng</span>
            </label>
          </div>
        </div>
        <button
          type="button"
          onClick={onAddAddress}
          disabled={saving}
          className="add-button"
        >
          {saving ? 'Đang thêm...' : 'Thêm địa chỉ'}
        </button>
      </div>
    </div>
  )
}

export default AddressBookSection

