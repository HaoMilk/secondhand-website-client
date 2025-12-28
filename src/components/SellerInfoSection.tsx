import { useNavigate } from 'react-router-dom'
import './ProfileSection.css'
import './SellerInfoSection.css'
import AddressSelector from './AddressSelector'
import type { SellerInfo, ShippingAddress } from '../models/Profile'

interface SellerInfoSectionProps {
  sellerInfo: SellerInfo
  saving: boolean
  onFieldChange: (field: string, value: any) => void
  onContactMethodChange: (field: string, value: boolean) => void
  onPaymentMethodChange: (field: string, value: any) => void
  onAgreementChange: (field: string, value: boolean) => void
  onPickupAddressChange: (address: ShippingAddress | null) => void
  onSave: () => void
}

const SellerInfoSection = ({
  sellerInfo,
  saving,
  onFieldChange,
  onContactMethodChange,
  onPaymentMethodChange,
  onAgreementChange,
  onPickupAddressChange,
  onSave
}: SellerInfoSectionProps) => {
  const navigate = useNavigate()
  return (
    <div className="profile-section">
      <div className="section-header">
        <h2>Thông tin người bán</h2>
        <p className="section-description">Thông tin bắt buộc để đăng bán sản phẩm</p>
      </div>

      <div className="form-group">
        <label htmlFor="shopName">
          Tên hiển thị người bán <span className="required">*</span>
        </label>
        <input
          type="text"
          id="shopName"
          value={sellerInfo.shopName || ''}
          onChange={(e) => onFieldChange('shopName', e.target.value)}
          placeholder="VD: Shop ABC hoặc Tên cá nhân"
          disabled={saving}
        />
        <span className="field-hint">Tên này sẽ hiển thị trên các sản phẩm bạn đăng bán</span>
      </div>

      <div className="form-group">
        <label htmlFor="tradingArea">
          Khu vực giao dịch <span className="required">*</span>
        </label>
        <input
          type="text"
          id="tradingArea"
          value={sellerInfo.tradingArea || ''}
          onChange={(e) => onFieldChange('tradingArea', e.target.value)}
          placeholder="VD: Hà Nội, TP.HCM, Toàn quốc"
          disabled={saving}
        />
      </div>

      <div className="form-group">
        <AddressSelector
          selectedAddressId={sellerInfo.pickupAddressId}
          onSelectAddress={(address) => {
            onPickupAddressChange(address)
            onFieldChange('pickupAddressId', address?._id || null)
          }}
          label="Địa chỉ lấy hàng"
          required={false}
          disabled={saving}
          showAddButton={true}
          onAddNew={() => {
            // Scroll đến phần sổ địa chỉ trong cùng trang
            const addressSection = document.querySelector('.addresses-list')
            if (addressSection) {
              addressSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
            } else {
              // Nếu không tìm thấy, chuyển đến trang profile
              navigate('/profile')
            }
          }}
        />
        <span className="field-hint">
          Chọn địa chỉ từ sổ địa chỉ để người mua có thể đến lấy hàng. Nếu chưa có địa chỉ, hãy thêm vào sổ địa chỉ trước.
        </span>
      </div>

      <div className="form-group">
        <label>Phương thức liên hệ</label>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={sellerInfo.contactMethods?.internalChat !== false}
              onChange={(e) => onContactMethodChange('internalChat', e.target.checked)}
              disabled={saving}
            />
            <span>Chat nội bộ</span>
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={sellerInfo.contactMethods?.phone || false}
              onChange={(e) => onContactMethodChange('phone', e.target.checked)}
              disabled={saving}
            />
            <span>Số điện thoại</span>
          </label>
          {sellerInfo.contactMethods?.phone && (
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={sellerInfo.contactMethods?.showPhone || false}
                onChange={(e) => onContactMethodChange('showPhone', e.target.checked)}
                disabled={saving}
              />
              <span>Hiển thị số điện thoại công khai</span>
            </label>
          )}
        </div>
      </div>

      <div className="form-group">
        <label>Phương thức nhận tiền</label>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={sellerInfo.paymentMethods?.eWallet || false}
              onChange={(e) => onPaymentMethodChange('eWallet', e.target.checked)}
              disabled={saving}
            />
            <span>Ví điện tử</span>
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={sellerInfo.paymentMethods?.bankTransfer || false}
              onChange={(e) => onPaymentMethodChange('bankTransfer', e.target.checked)}
              disabled={saving}
            />
            <span>Chuyển khoản ngân hàng</span>
          </label>
        </div>
        {sellerInfo.paymentMethods?.bankTransfer && (
          <div className="form-group" style={{ marginTop: '16px' }}>
            <label htmlFor="bankAccount">Số tài khoản ngân hàng</label>
            <input
              type="text"
              id="bankAccount"
              value={sellerInfo.paymentMethods?.bankAccount || ''}
              onChange={(e) => onPaymentMethodChange('bankAccount', e.target.value)}
              placeholder="Nhập số tài khoản"
              disabled={saving}
            />
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Cam kết người bán <span className="required">*</span></label>
        <div className="agreements-section">
          <label className="checkbox-label agreement-item">
            <input
              type="checkbox"
              checked={sellerInfo.agreements?.termsAccepted || false}
              onChange={(e) => onAgreementChange('termsAccepted', e.target.checked)}
              disabled={saving}
            />
            <span>Tôi đồng ý với các điều khoản và quy định của website</span>
          </label>
          <label className="checkbox-label agreement-item">
            <input
              type="checkbox"
              checked={sellerInfo.agreements?.noProhibitedItems || false}
              onChange={(e) => onAgreementChange('noProhibitedItems', e.target.checked)}
              disabled={saving}
            />
            <span>Tôi cam kết không bán các mặt hàng bị cấm theo quy định</span>
          </label>
        </div>
      </div>

      <div className="section-actions">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="save-button"
        >
          {saving ? 'Đang lưu...' : 'Lưu thông tin người bán'}
        </button>
      </div>
    </div>
  )
}

export default SellerInfoSection

