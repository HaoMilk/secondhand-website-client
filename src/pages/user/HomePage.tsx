import { useState, useEffect } from 'react'
import { productApi } from '../../services/api'
import type { Product } from '../../models/Product'
import './HomePage.css'

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const limit = 9

  useEffect(() => {
    fetchProducts(currentPage)
  }, [currentPage])

  const fetchProducts = async (page: number) => {
    try {
      setLoading(true)
      setError(null)
      const response = await productApi.getAll(page, limit)
      setProducts(response.products)
      setTotalPages(response.pagination.totalPages)
      setTotal(response.pagination.total)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải sản phẩm')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const getConditionText = (condition: string) => {
    const conditions: Record<string, string> = {
      'new-like': 'Như mới',
      'very-good': 'Rất tốt',
      'good': 'Tốt',
      'fair': 'Khá'
    }
    return conditions[condition] || condition
  }

  if (loading && products.length === 0) {
    return (
      <div className="home-page">
        <div className="home-page-header">
          <h1>Sản phẩm đã qua sử dụng</h1>
        </div>
        <div className="loading-container">
          <p>Đang tải sản phẩm...</p>
        </div>
      </div>
    )
  }

  if (error && products.length === 0) {
    return (
      <div className="home-page">
        <div className="home-page-header">
          <h1>Sản phẩm đã qua sử dụng</h1>
        </div>
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => fetchProducts(currentPage)}>Thử lại</button>
        </div>
      </div>
    )
  }

  return (
    <div className="home-page">
      <div className="home-page-header">
        <h1>Sản phẩm đã qua sử dụng</h1>
        <p className="total-products">Tổng cộng {total} sản phẩm</p>
      </div>

      {products.length === 0 ? (
        <div className="no-products">
          <p>Không có sản phẩm nào</p>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                {product.images && product.images.length > 0 && (
                  <div className="product-image">
                    <img 
                      src={product.images[0]} 
                      alt={product.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=No+Image'
                      }}
                    />
                  </div>
                )}
                <div className="product-info">
                  <h3 className="product-title">{product.title}</h3>
                  {product.description && (
                    <p className="product-description">
                      {product.description.length > 100 
                        ? `${product.description.substring(0, 100)}...` 
                        : product.description}
                    </p>
                  )}
                  <div className="product-details">
                    <span className="product-condition">
                      {getConditionText(product.condition)}
                    </span>
                    {product.brand && (
                      <span className="product-brand">{product.brand}</span>
                    )}
                  </div>
                  <div className="product-footer">
                    <span className="product-price">{formatPrice(product.price)}</span>
                    {product.quantity > 0 ? (
                      <span className="product-available">Còn hàng</span>
                    ) : (
                      <span className="product-unavailable">Hết hàng</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Trước
              </button>
              
              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Hiển thị tối đa 5 số trang
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    )
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return <span key={page} className="pagination-ellipsis">...</span>
                  }
                  return null
                })}
              </div>

              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sau
              </button>
            </div>
          )}

          {loading && (
            <div className="loading-overlay">
              <p>Đang tải...</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default HomePage

