import { useProfileViewModel } from '../../viewmodels/useProfileViewModel'
import ProfileProgress from '../../components/ProfileProgress'
import ProfileBasicInfo from '../../components/ProfileBasicInfo'
import AddressBookSection from '../../components/AddressBookSection'
import SellerInfoSection from '../../components/SellerInfoSection'
import './ProfilePage.css'

const ProfilePage = () => {
  const { state, actions } = useProfileViewModel()

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>Thông tin cá nhân</h1>
          <p>Hoàn thiện hồ sơ để có thể mua và bán hàng</p>
        </div>

        {state.errorMessage && (
          <div className="error-message" onClick={actions.clearError}>
            ❌ {state.errorMessage}
          </div>
        )}

        {state.successMessage && (
          <div className="success-message" onClick={actions.clearSuccess}>
            ✅ {state.successMessage}
          </div>
        )}

        {state.loading ? (
          <div className="loading">Đang tải thông tin...</div>
        ) : (
          <>
            {state.profileData && (
              <ProfileProgress
                percentage={state.profileData.completion.percentage}
                missingFields={state.profileData.completion.missingFields}
              />
            )}

            <ProfileBasicInfo
              formData={state.formData.basicInfo}
              errors={state.errors}
              saving={state.saving}
              onFieldChange={actions.setBasicInfoField}
              onSave={actions.handleSaveBasicInfo}
            />

            <AddressBookSection
              addresses={state.formData.shippingAddresses}
              newAddress={state.newAddress}
              saving={state.saving}
              editingAddressId={state.editingAddressId}
              onNewAddressFieldChange={actions.setNewAddressField}
              onAddAddress={actions.handleAddShippingAddress}
              onUpdateAddress={actions.handleUpdateShippingAddress}
              onDeleteAddress={actions.handleDeleteShippingAddress}
              onSetDefaultShipping={actions.handleSetDefaultShipping}
              onSetDefaultPickup={actions.handleSetDefaultPickup}
              onSetEditing={actions.setEditingAddressId}
            />

            <SellerInfoSection
              sellerInfo={state.formData.sellerInfo}
              saving={state.saving}
              onFieldChange={actions.setSellerInfoField}
              onContactMethodChange={actions.setContactMethodField}
              onPaymentMethodChange={actions.setPaymentMethodField}
              onAgreementChange={actions.setAgreementField}
              onPickupAddressChange={actions.setPickupAddress}
              onSave={actions.handleSaveSellerInfo}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default ProfilePage

