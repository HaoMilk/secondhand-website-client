import { useAddCategoryViewModel } from '../../viewmodels/useAddCategoryViewModel'
import './AddCategoryPage.css'

const AddCategoryPage = () => {
  const { state, actions } = useAddCategoryViewModel()

  return (
    <div className="add-category-container">
      <div className="add-category-card">
        <div className="add-category-header">
          <h1>Thêm danh mục mới</h1>
          <p>Điền thông tin danh mục bạn muốn tạo</p>
        </div>

        {state.success && (
          <div className="success-message">
            ✅ Danh mục đã được tạo thành công! Đang chuyển về trang quản lý danh mục...
          </div>
        )}

        {state.errorMessage && (
          <div className="error-message" onClick={actions.clearError}>
            ❌ {state.errorMessage}
          </div>
        )}

        <form onSubmit={actions.handleSubmit} className="add-category-form">
          {/* Thông tin cơ bản */}
          <div className="form-section">
            <h2>Thông tin cơ bản</h2>
            
            <div className="form-group">
              <label htmlFor="name">
                Tên danh mục <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={state.formData.name}
                onChange={(e) => actions.setField('name', e.target.value)}
                placeholder="VD: Áo thun"
                disabled={state.loading}
                required
                className={state.errors.name ? 'error-input' : ''}
              />
              {state.errors.name && (
                <span className="field-error">{state.errors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="parentId">Danh mục cha (tùy chọn)</label>
              <select
                id="parentId"
                value={state.formData.parentId || ''}
                onChange={(e) => {
                  const value = e.target.value
                  actions.setField('parentId', value === '' ? null : value)
                }}
                disabled={state.loading || state.loadingParents}
              >
                <option value="">-- Không có danh mục cha (danh mục gốc) --</option>
                {state.parentCategories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {'  '.repeat(category.level)} {category.name}
                  </option>
                ))}
              </select>
              <small className="form-hint">
                Chọn danh mục cha nếu bạn muốn tạo danh mục con. Tối đa 3 cấp độ.
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="description">Mô tả</label>
              <textarea
                id="description"
                value={state.formData.description || ''}
                onChange={(e) => actions.setField('description', e.target.value)}
                placeholder="Mô tả về danh mục này..."
                disabled={state.loading}
                rows={4}
                maxLength={500}
                className={state.errors.description ? 'error-input' : ''}
              />
              <small className="form-hint">
                {state.formData.description?.length || 0}/500 ký tự
              </small>
              {state.errors.description && (
                <span className="field-error">{state.errors.description}</span>
              )}
            </div>
          </div>

          {/* Thông tin bổ sung */}
          <div className="form-section">
            <h2>Thông tin bổ sung</h2>
            
            <div className="form-group">
              <label htmlFor="sortOrder">Thứ tự sắp xếp</label>
              <input
                type="number"
                id="sortOrder"
                value={state.formData.sortOrder ?? 0}
                onChange={(e) => actions.setField('sortOrder', parseInt(e.target.value) || 0)}
                placeholder="0"
                disabled={state.loading}
                min="0"
                max="9999"
                className={state.errors.sortOrder ? 'error-input' : ''}
              />
              <small className="form-hint">
                Số càng nhỏ, hiển thị càng trước (0-9999)
              </small>
              {state.errors.sortOrder && (
                <span className="field-error">{state.errors.sortOrder}</span>
              )}
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={state.formData.isActive ?? true}
                  onChange={(e) => actions.setField('isActive', e.target.checked)}
                  disabled={state.loading}
                />
                <span>Kích hoạt danh mục</span>
              </label>
              <small className="form-hint">
                Danh mục không kích hoạt sẽ không hiển thị cho người dùng
              </small>
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
              {state.loading ? 'Đang xử lý...' : 'Tạo danh mục'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCategoryPage

