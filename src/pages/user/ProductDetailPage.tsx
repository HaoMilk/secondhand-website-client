import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productApi, cartApi } from '../../services/api'
import type { Product } from '../../models/Product'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import './ProductDetailPage.css'

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [addingToCart, setAddingToCart] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  useEffect(() => {
    if (id) {
      fetchProduct(id)
    }
  }, [id])

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await productApi.getById(productId)
      setProduct(data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải chi tiết sản phẩm')
      console.error('Error fetching product:', err)
    } finally {
      setLoading(false)
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

  const getGenderText = (gender?: string) => {
    const genders: Record<string, string> = {
      'male': 'Nam',
      'female': 'Nữ',
      'unisex': 'Unisex'
    }
    return genders[gender || ''] || gender || 'Không xác định'
  }

  const handleAddToCartClick = () => {
    if (!product || !id) return

    const token = localStorage.getItem('token')
    if (!token) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng')
      navigate('/login')
      return
    }

    setShowConfirmDialog(true)
  }

  const handleConfirmAddToCart = async () => {
    if (!product || !id) return

    setShowConfirmDialog(false)
    
    try {
      setAddingToCart(true)
      await cartApi.addItem({ productId: id, quantity })
      // Refresh cart count in header by reloading page or using context/state management
      window.location.reload()
    } catch (err: any) {
      if (err.response?.status === 401) {
        alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng')
        navigate('/login')
      } else {
        alert(err.response?.data?.message || 'Không thể thêm sản phẩm vào giỏ hàng')
      }
      console.error('Error adding to cart:', err)
    } finally {
      setAddingToCart(false)
    }
  }

  const handleCancelAddToCart = () => {
    setShowConfirmDialog(false)
  }

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="loading-container">
          <p>Đang tải chi tiết sản phẩm...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="error-container">
          <p>{error || 'Không tìm thấy sản phẩm'}</p>
          <button onClick={() => navigate('/')}>Quay về trang chủ</button>
        </div>
      </div>
    )
  }

  return (
    <div className="product-detail-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Quay lại
      </button>

      <div className="product-detail-container">
        <div className="product-images-section">
          {product.images && product.images.length > 0 ? (
            <>
              <div className="main-image">
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x600?text=No+Image'
                  }}
                />
              </div>
              {product.images.length > 1 && (
                <div className="thumbnail-images">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img
                        src={image}
                        alt={`${product.title} - ${index + 1}`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x100?text=No+Image'
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="main-image">
              <img
                src="https://via.placeholder.com/600x600?text=No+Image"
                alt={product.title}
              />
            </div>
          )}
        </div>

        <div className="product-info-section">
          <h1 className="product-title">{product.title}</h1>
          
          <div className="product-price-section">
            <span className="product-price">{formatPrice(product.price)}</span>
            {product.quantity > 0 ? (
              <span className="product-available-badge">Còn hàng</span>
            ) : (
              <span className="product-unavailable-badge">Hết hàng</span>
            )}
          </div>

          <div className="product-meta">
            <div className="meta-item">
              <span className="meta-label">Tình trạng:</span>
              <span className="meta-value">{getConditionText(product.condition)}</span>
            </div>
            {product.categoryName && (
              <div className="meta-item">
                <span className="meta-label">Danh mục:</span>
                <span className="meta-value">{product.categoryName}</span>
              </div>
            )}
            {product.brand && (
              <div className="meta-item">
                <span className="meta-label">Thương hiệu:</span>
                <span className="meta-value">{product.brand}</span>
              </div>
            )}
            {product.size && (
              <div className="meta-item">
                <span className="meta-label">Kích thước:</span>
                <span className="meta-value">{product.size}</span>
              </div>
            )}
            {product.color && (
              <div className="meta-item">
                <span className="meta-label">Màu sắc:</span>
                <span className="meta-value">{product.color}</span>
              </div>
            )}
            {product.material && (
              <div className="meta-item">
                <span className="meta-label">Chất liệu:</span>
                <span className="meta-value">{product.material}</span>
              </div>
            )}
            {product.gender && (
              <div className="meta-item">
                <span className="meta-label">Giới tính:</span>
                <span className="meta-value">{getGenderText(product.gender)}</span>
              </div>
            )}
            {product.style && (
              <div className="meta-item">
                <span className="meta-label">Phong cách:</span>
                <span className="meta-value">{product.style}</span>
              </div>
            )}
            {product.authenticity !== undefined && (
              <div className="meta-item">
                <span className="meta-label">Xác thực:</span>
                <span className="meta-value">
                  {product.authenticity ? '✓ Có' : '✗ Không'}
                </span>
              </div>
            )}
            {product.sellerEmail && (
              <div className="meta-item">
                <span className="meta-label">Người bán:</span>
                <span className="meta-value">{product.sellerEmail}</span>
              </div>
            )}
          </div>

          {product.description && (
            <div className="product-description-section">
              <h2>Mô tả sản phẩm</h2>
              <p className="description-text">{product.description}</p>
            </div>
          )}

          {product.defects && (
            <div className="product-defects-section">
              <h2>Khuyết điểm</h2>
              <p className="defects-text">{product.defects}</p>
              {product.defectImages && product.defectImages.length > 0 && (
                <div className="defect-images">
                  {product.defectImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Khuyết điểm ${index + 1}`}
                      className="defect-image"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x200?text=No+Image'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="product-actions">
            {product.quantity > 0 ? (
              <>
                <div className="quantity-selector">
                  <label>Số lượng:</label>
                  <div className="quantity-control">
                    <button
                      className="quantity-btn"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      className="quantity-input"
                      value={quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1
                        setQuantity(Math.max(1, Math.min(value, product.quantity)))
                      }}
                      min="1"
                      max={product.quantity}
                    />
                    <button
                      className="quantity-btn"
                      onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                      disabled={quantity >= product.quantity}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="add-to-cart-btn"
                  onClick={handleAddToCartClick}
                  disabled={addingToCart}
                >
                  {addingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                </button>
                <button className="contact-seller-btn">
                  Liên hệ người bán
                </button>
              </>
            ) : (
              <button className="contact-seller-btn" disabled>
                Sản phẩm đã hết hàng
              </button>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Thêm vào giỏ hàng"
        message={`Bạn có chắc chắn muốn thêm "${product.title}" (Số lượng: ${quantity}) vào giỏ hàng?`}
        confirmText="Xác nhận"
        cancelText="Hủy"
        onConfirm={handleConfirmAddToCart}
        onCancel={handleCancelAddToCart}
        type="info"
      />
    </div>
  )
}

export default ProductDetailPage

