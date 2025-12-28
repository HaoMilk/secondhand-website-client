import { useAddProductViewModel } from '../../viewmodels/useAddProductViewModel'
import './AddProductPage.css'

const AddProductPage = () => {
  const { state, actions } = useAddProductViewModel()

  return (
    <div className="add-product-container">
      <div className="add-product-card">
        <div className="add-product-header">
          <h1>Thêm sản phẩm mới</h1>
          <p>Điền thông tin sản phẩm bạn muốn bán</p>
        </div>

        {state.success && (
          <div className="success-message">
            ✅ Sản phẩm đã được tạo thành công! Đang chuyển về trang quản lý...
          </div>
        )}

        {state.errorMessage && (
          <div className="error-message" onClick={actions.clearError}>
            ❌ {state.errorMessage}
          </div>
        )}

        <form onSubmit={actions.handleSubmit} className="add-product-form">
          {/* Thông tin cơ bản */}
          <div className="form-section">
            <h2>Thông tin cơ bản</h2>
            
            <div className="form-group">
              <label htmlFor="title">
                Tiêu đề sản phẩm <span className="required">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={state.formData.title}
                onChange={(e) => actions.setField('title', e.target.value)}
                placeholder="VD: Áo thun nam Nike cổ tròn"
                disabled={state.loading}
                required
              />
              {state.errors.title && (
                <span className="field-error">{state.errors.title}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description">Mô tả sản phẩm</label>
              <textarea
                id="description"
                value={state.formData.description || ''}
                onChange={(e) => actions.setField('description', e.target.value)}
                placeholder="Mô tả chi tiết về sản phẩm..."
                disabled={state.loading}
                rows={4}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="categoryId">
                  Danh mục <span className="required">*</span>
                </label>
                {state.categoriesLoading ? (
                  <select
                    id="categoryId"
                    disabled
                    className="loading-select"
                  >
                    <option>Đang tải danh mục...</option>
                  </select>
                ) : state.categories.length === 0 ? (
                  <div className="no-categories">
                    <p>Không có danh mục nào. Vui lòng liên hệ admin để thêm danh mục.</p>
                  </div>
                ) : (
                  <select
                    id="categoryId"
                    value={state.formData.categoryId}
                    onChange={(e) => actions.setField('categoryId', e.target.value)}
                    disabled={state.loading}
                    required
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {state.categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
                {state.errors.categoryId && (
                  <span className="field-error">{state.errors.categoryId}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="price">
                  Giá (VNĐ) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  value={state.formData.price || ''}
                  onChange={(e) => actions.setField('price', parseFloat(e.target.value) || 0)}
                  placeholder="250000"
                  disabled={state.loading}
                  min="0"
                  step="1000"
                  required
                />
                {state.errors.price && (
                  <span className="field-error">{state.errors.price}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="condition">
                Tình trạng <span className="required">*</span>
              </label>
              <select
                id="condition"
                value={state.formData.condition}
                onChange={(e) => actions.setField('condition', e.target.value)}
                disabled={state.loading}
                required
              >
                <option value="new-like">Như mới</option>
                <option value="very-good">Rất tốt</option>
                <option value="good">Tốt</option>
                <option value="fair">Khá (có khuyết điểm)</option>
              </select>
              {state.errors.condition && (
                <span className="field-error">{state.errors.condition}</span>
              )}
            </div>
          </div>

          {/* Thông tin chi tiết */}
          <div className="form-section">
            <h2>Thông tin chi tiết</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="brand">Thương hiệu</label>
                <input
                  type="text"
                  id="brand"
                  value={state.formData.brand || ''}
                  onChange={(e) => actions.setField('brand', e.target.value)}
                  placeholder="VD: Nike, Adidas..."
                  disabled={state.loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="size">Kích cỡ</label>
                <input
                  type="text"
                  id="size"
                  value={state.formData.size || ''}
                  onChange={(e) => actions.setField('size', e.target.value)}
                  placeholder="VD: M, L, XL..."
                  disabled={state.loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="color">Màu sắc</label>
                <input
                  type="text"
                  id="color"
                  value={state.formData.color || ''}
                  onChange={(e) => actions.setField('color', e.target.value)}
                  placeholder="VD: Đen, Trắng..."
                  disabled={state.loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="material">Chất liệu</label>
                <input
                  type="text"
                  id="material"
                  value={state.formData.material || ''}
                  onChange={(e) => actions.setField('material', e.target.value)}
                  placeholder="VD: Cotton 100%..."
                  disabled={state.loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="gender">Giới tính</label>
                <select
                  id="gender"
                  value={state.formData.gender || ''}
                  onChange={(e) => actions.setField('gender', e.target.value || undefined)}
                  disabled={state.loading}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="style">Phong cách</label>
                <input
                  type="text"
                  id="style"
                  value={state.formData.style || ''}
                  onChange={(e) => actions.setField('style', e.target.value)}
                  placeholder="VD: Casual, Sport..."
                  disabled={state.loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Số lượng</label>
              <input
                type="number"
                id="quantity"
                value={state.formData.quantity || 1}
                onChange={(e) => actions.setField('quantity', parseInt(e.target.value) || 1)}
                disabled={state.loading}
                min="1"
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={state.formData.authenticity || false}
                  onChange={(e) => actions.setField('authenticity', e.target.checked)}
                  disabled={state.loading}
                />
                <span>Sản phẩm chính hãng</span>
              </label>
            </div>
          </div>

          {/* Khuyết điểm (nếu condition = fair) */}
          {state.formData.condition === 'fair' && (
            <div className="form-section">
              <h2>Thông tin khuyết điểm</h2>
              
              <div className="form-group">
                <label htmlFor="defects">
                  Mô tả khuyết điểm <span className="required">*</span>
                </label>
                <textarea
                  id="defects"
                  value={state.formData.defects || ''}
                  onChange={(e) => actions.setField('defects', e.target.value)}
                  placeholder="Mô tả chi tiết các khuyết điểm của sản phẩm..."
                  disabled={state.loading}
                  rows={4}
                  required
                />
                {state.errors.defects && (
                  <span className="field-error">{state.errors.defects}</span>
                )}
              </div>

              <div className="form-group">
                <label>Ảnh khuyết điểm</label>
                <div className="image-input-group">
                  <input
                    type="text"
                    placeholder="Nhập URL ảnh khuyết điểm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const input = e.target as HTMLInputElement
                        actions.addDefectImage(input.value)
                        input.value = ''
                      }
                    }}
                    disabled={state.loading}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement
                      if (input.value.trim()) {
                        actions.addDefectImage(input.value)
                        input.value = ''
                      }
                    }}
                    disabled={state.loading}
                    className="add-image-btn"
                  >
                    Thêm
                  </button>
                </div>
                {state.errors.defectImages && (
                  <span className="field-error">{state.errors.defectImages}</span>
                )}
                {state.formData.defectImages && state.formData.defectImages.length > 0 && (
                  <div className="image-list">
                    {state.formData.defectImages.map((url, index) => (
                      <div key={index} className="image-item">
                        <img src={url} alt={`Defect ${index + 1}`} />
                        <button
                          type="button"
                          onClick={() => actions.removeDefectImage(index)}
                          disabled={state.loading}
                          className="remove-image-btn"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ảnh sản phẩm */}
          <div className="form-section">
            <h2>Ảnh sản phẩm</h2>
            
            <div className="form-group">
              <label>
                Ảnh sản phẩm <span className="required">*</span>
              </label>
              <div className="image-input-group">
                <input
                  type="text"
                  placeholder="Nhập URL ảnh sản phẩm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const input = e.target as HTMLInputElement
                      actions.addImage(input.value)
                      input.value = ''
                    }
                  }}
                  disabled={state.loading}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement
                    if (input.value.trim()) {
                      actions.addImage(input.value)
                      input.value = ''
                    }
                  }}
                  disabled={state.loading}
                  className="add-image-btn"
                >
                  Thêm
                </button>
              </div>
              {state.errors.images && (
                <span className="field-error">{state.errors.images}</span>
              )}
              {state.formData.images && state.formData.images.length > 0 && (
                <div className="image-list">
                  {state.formData.images.map((url, index) => (
                    <div key={index} className="image-item">
                      <img src={url} alt={`Product ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => actions.removeImage(index)}
                        disabled={state.loading}
                        className="remove-image-btn"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => window.history.back()}
              disabled={state.loading}
              className="cancel-button"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={state.loading}
              className="submit-button"
            >
              {state.loading ? 'Đang xử lý...' : 'Tạo sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProductPage

