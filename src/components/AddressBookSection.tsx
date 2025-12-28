import { useState } from 'react'
import './ProfileSection.css'
import './AddressBookSection.css'
import type { ShippingAddress } from '../models/Profile'

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
  const [editingAddress, setEditingAddress] = useState<Partial<ShippingAddress>>({})

  const handleEdit = (address: ShippingAddress) => {
    setEditingAddress({ ...address })
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
                    <div className="form-group-inline">
                      <label>Tỉnh/Thành phố</label>
                      <input
                        type="text"
                        value={editingAddress.province || ''}
                        onChange={(e) => setEditingAddress({ ...editingAddress, province: e.target.value })}
                        disabled={saving}
                      />
                    </div>
                    <div className="form-group-inline">
                      <label>Quận/Huyện</label>
                      <input
                        type="text"
                        value={editingAddress.district || ''}
                        onChange={(e) => setEditingAddress({ ...editingAddress, district: e.target.value })}
                        disabled={saving}
                      />
                    </div>
                    <div className="form-group-inline">
                      <label>Phường/Xã</label>
                      <input
                        type="text"
                        value={editingAddress.ward || ''}
                        onChange={(e) => setEditingAddress({ ...editingAddress, ward: e.target.value })}
                        disabled={saving}
                      />
                    </div>
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
          <div className="form-group-inline">
            <label>
              Tỉnh/Thành phố <span className="required">*</span>
            </label>
            <input
              type="text"
              value={newAddress.province || ''}
              onChange={(e) => onNewAddressFieldChange('province', e.target.value)}
              placeholder="VD: Hà Nội"
              disabled={saving}
            />
          </div>
          <div className="form-group-inline">
            <label>
              Quận/Huyện <span className="required">*</span>
            </label>
            <input
              type="text"
              value={newAddress.district || ''}
              onChange={(e) => onNewAddressFieldChange('district', e.target.value)}
              placeholder="VD: Cầu Giấy"
              disabled={saving}
            />
          </div>
          <div className="form-group-inline">
            <label>
              Phường/Xã <span className="required">*</span>
            </label>
            <input
              type="text"
              value={newAddress.ward || ''}
              onChange={(e) => onNewAddressFieldChange('ward', e.target.value)}
              placeholder="VD: Dịch Vọng"
              disabled={saving}
            />
          </div>
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

