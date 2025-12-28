import './ProfileSection.css'

interface ProfileBasicInfoProps {
  formData: {
    fullName?: string
    phone?: string
    avatar?: string
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

