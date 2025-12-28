import { useNavigate } from 'react-router-dom'
import { useCategoriesViewModel } from '../../viewmodels/useCategoriesViewModel'
import './CategoriesManagementPage.css'

const CategoriesManagementPage = () => {
  const navigate = useNavigate()
  const { state, actions } = useCategoriesViewModel()

  // Sắp xếp categories theo level và sortOrder
  const sortedCategories = [...state.categories].sort((a, b) => {
    if (a.level !== b.level) {
      return a.level - b.level
    }
    return (a.sortOrder || 0) - (b.sortOrder || 0)
  })

  // Lấy danh sách root categories (không có parent)
  const rootCategories = sortedCategories.filter((cat) => !cat.parentId)

  const renderCategoryItem = (category: typeof sortedCategories[0], level: number = 0) => {
    // Tìm tất cả children của category này
    const children = sortedCategories.filter((cat) => cat.parentId === category._id)

    return (
      <div key={category._id} className="category-item">
        <div className="category-card" style={{ marginLeft: `${level * 24}px` }}>
          <div className="category-header">
            <div className="category-info">
              <h3 className="category-name">{category.name}</h3>
              <div className="category-meta">
                <span className="category-slug">/{category.slug}</span>
                <span className={`category-status ${category.isActive ? 'active' : 'inactive'}`}>
                  {category.isActive ? '✓ Hoạt động' : '✗ Không hoạt động'}
                </span>
                <span className="category-level">Cấp {category.level}</span>
              </div>
              {category.description && (
                <p className="category-description">{category.description}</p>
              )}
            </div>
          </div>
          <div className="category-footer">
            <div className="category-path">
              <span className="path-label">Đường dẫn:</span>
              <span className="path-value">{category.path}</span>
            </div>
            <div className="category-actions">
              <button
                className="action-btn edit-btn"
                onClick={() => {
                  // TODO: Navigate to edit page
                  alert('Chức năng chỉnh sửa đang được phát triển')
                }}
              >
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>
        {children.length > 0 && (
          <div className="category-children">
            {children.map((child) => renderCategoryItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="categories-management-container">
      <div className="categories-header">
        <div className="header-content">
          <h1>Quản lý Danh mục</h1>
          <p>Xem và quản lý tất cả danh mục sản phẩm</p>
        </div>
        <button
          className="add-category-button"
          onClick={() => navigate('/admin/categories/new')}
        >
          + Thêm danh mục mới
        </button>
      </div>

      {state.error && (
        <div className="error-message" onClick={actions.clearError}>
          ❌ {state.error}
        </div>
      )}

      {state.loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải danh sách danh mục...</p>
        </div>
      ) : sortedCategories.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <h2>Chưa có danh mục nào</h2>
          <p>Bắt đầu bằng cách tạo danh mục đầu tiên của bạn</p>
          <button
            className="add-category-button"
            onClick={() => navigate('/admin/categories/new')}
          >
            + Thêm danh mục mới
          </button>
        </div>
      ) : (
        <>
          <div className="categories-stats">
            <div className="stat-item">
              <span className="stat-label">Tổng danh mục:</span>
              <span className="stat-value">{sortedCategories.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Đang hoạt động:</span>
              <span className="stat-value">
                {sortedCategories.filter((c) => c.isActive).length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Không hoạt động:</span>
              <span className="stat-value">
                {sortedCategories.filter((c) => !c.isActive).length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Danh mục gốc:</span>
              <span className="stat-value">
                {sortedCategories.filter((c) => c.level === 0).length}
              </span>
            </div>
          </div>

          <div className="categories-list">
            {rootCategories.map((category) => renderCategoryItem(category, 0))}
          </div>
        </>
      )}
    </div>
  )
}

export default CategoriesManagementPage

