import { useNavigate } from 'react-router-dom'
import { useMyProductsViewModel } from '../../viewmodels/useMyProductsViewModel'
import './MyProductsPage.css'

const MyProductsPage = () => {
  const navigate = useNavigate()
  const { state, actions } = useMyProductsViewModel()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

  const getConditionLabel = (condition: string) => {
    const conditionMap: Record<string, string> = {
      'new-like': 'Như mới',
      'very-good': 'Rất tốt',
      good: 'Tốt',
      fair: 'Khá',
    }
    return conditionMap[condition] || condition
  }

  return (
    <div className="my-products-container">
      <div className="my-products-header">
        <div className="header-content">
          <h1>Sản phẩm của tôi</h1>
          <p>Quản lý các sản phẩm bạn đang bán</p>
        </div>
        <button
          className="add-product-button"
          onClick={() => navigate('/user/add-product')}
        >
          + Thêm sản phẩm mới
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
          <p>Đang tải danh sách sản phẩm...</p>
        </div>
      ) : state.products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h2>Chưa có sản phẩm nào</h2>
          <p>Bắt đầu bán hàng bằng cách thêm sản phẩm đầu tiên của bạn</p>
          <button
            className="add-product-button"
            onClick={() => navigate('/user/add-product')}
          >
            + Thêm sản phẩm mới
          </button>
        </div>
      ) : (
        <>
          <div className="products-stats">
            <div className="stat-item">
              <span className="stat-label">Tổng sản phẩm:</span>
              <span className="stat-value">{state.products.length}</span>
            </div>
          </div>

          <div className="products-grid">
            {state.products.map((product) => {
              return (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    {product.images && product.images.length > 0 ? (
                      <img src={product.images[0]} alt={product.title} />
                    ) : (
                      <div className="no-image">Không có ảnh</div>
                    )}
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">{product.title}</h3>
                    <div className="product-price">{formatPrice(product.price)}</div>
                    <div className="product-details">
                      <span className="detail-item">
                        Tình trạng: {getConditionLabel(product.condition)}
                      </span>
                      {product.brand && (
                        <span className="detail-item">Thương hiệu: {product.brand}</span>
                      )}
                      {product.size && (
                        <span className="detail-item">Size: {product.size}</span>
                      )}
                      <span className="detail-item">
                        Số lượng: {product.quantity}
                      </span>
                    </div>
                    <div className="product-actions">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => {
                          // TODO: Navigate to edit page
                          alert('Chức năng chỉnh sửa đang được phát triển')
                        }}
                      >
                        Chỉnh sửa
                      </button>
                      <button
                        className="action-btn view-btn"
                        onClick={() => {
                          // TODO: Navigate to product detail
                          alert('Chức năng xem chi tiết đang được phát triển')
                        }}
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default MyProductsPage
