import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { cartApi } from '../../services/api'
import type { CartItem } from '../../models/Cart'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import './CartPage.css'

const CartPage = () => {
  const navigate = useNavigate()
  const [items, setItems] = useState<CartItem[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [clearCartDialogOpen, setClearCartDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await cartApi.getCart()
      setItems(data.items)
      setTotalPrice(data.totalPrice)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải giỏ hàng')
      console.error('Error fetching cart:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setUpdatingItems(prev => new Set(prev).add(productId))
    try {
      const data = await cartApi.updateItem(productId, { quantity: newQuantity })
      setItems(data.items)
      setTotalPrice(data.totalPrice)
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể cập nhật số lượng')
      console.error('Error updating item:', err)
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  const handleRemoveItemClick = (productId: string) => {
    setItemToDelete(productId)
    setDeleteDialogOpen(true)
  }

  const handleRemoveItem = async () => {
    if (!itemToDelete) return

    setUpdatingItems(prev => new Set(prev).add(itemToDelete))
    try {
      const data = await cartApi.removeItem(itemToDelete)
      setItems(data.items)
      setTotalPrice(data.totalPrice)
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể xóa sản phẩm')
      console.error('Error removing item:', err)
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemToDelete)
        return newSet
      })
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const handleClearCartClick = () => {
    setClearCartDialogOpen(true)
  }

  const handleClearCart = async () => {
    try {
      const data = await cartApi.clearCart()
      setItems(data.items)
      setTotalPrice(data.totalPrice)
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể xóa giỏ hàng')
      console.error('Error clearing cart:', err)
    } finally {
      setClearCartDialogOpen(false)
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

  if (loading) {
    return (
      <div className="cart-page">
        <div className="loading-container">
          <p>Đang tải giỏ hàng...</p>
        </div>
      </div>
    )
  }

  if (error && items.length === 0) {
    return (
      <div className="cart-page">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchCart}>Thử lại</button>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Giỏ hàng của tôi</h1>
        {items.length > 0 && (
          <button className="clear-cart-btn" onClick={handleClearCartClick}>
            Xóa toàn bộ
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Giỏ hàng trống</h2>
          <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
          <button className="continue-shopping-btn" onClick={() => navigate('/')}>
            Tiếp tục mua sắm
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item) => {
              const isUpdating = updatingItems.has(item.productId)
              return (
                <div key={item.productId} className="cart-item">
                  <div 
                    className="cart-item-image"
                    onClick={() => navigate(`/products/${item.productId}`)}
                  >
                    {item.product.images && item.product.images.length > 0 ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x150?text=No+Image'
                        }}
                      />
                    ) : (
                      <div className="no-image">Không có ảnh</div>
                    )}
                  </div>

                  <div className="cart-item-info">
                    <h3 
                      className="cart-item-title"
                      onClick={() => navigate(`/products/${item.productId}`)}
                    >
                      {item.product.title}
                    </h3>
                    <div className="cart-item-details">
                      <span className="condition-badge">
                        {getConditionText(item.product.condition)}
                      </span>
                      {item.product.brand && (
                        <span className="brand-badge">{item.product.brand}</span>
                      )}
                    </div>
                    <div className="cart-item-price">
                      {formatPrice(item.product.price)}
                    </div>
                    {item.product.sellerEmail && (
                      <div className="cart-item-seller">
                        Người bán: {item.product.sellerEmail}
                      </div>
                    )}
                  </div>

                  <div className="cart-item-actions">
                    <div className="quantity-control">
                      <button
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1 || isUpdating}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        className="quantity-input"
                        value={item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1
                          handleQuantityChange(item.productId, value)
                        }}
                        min="1"
                        max={item.product.quantity}
                        disabled={isUpdating}
                      />
                      <button
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.product.quantity || isUpdating}
                      >
                        +
                      </button>
                    </div>
                    <div className="item-total">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                    <button
                      className="remove-item-btn"
                      onClick={() => handleRemoveItemClick(item.productId)}
                      disabled={isUpdating}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Tổng số lượng:</span>
              <span>{items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm</span>
            </div>
            <div className="summary-row total">
              <span>Tổng tiền:</span>
              <span className="total-price">{formatPrice(totalPrice)}</span>
            </div>
            <div className="summary-actions">
              <button className="continue-shopping-btn" onClick={() => navigate('/')}>
                Tiếp tục mua sắm
              </button>
              <button className="checkout-btn">
                Thanh toán
              </button>
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Xóa sản phẩm"
        message="Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"
        confirmText="Xóa"
        cancelText="Hủy"
        type="info"
        onConfirm={handleRemoveItem}
        onCancel={() => {
          setDeleteDialogOpen(false)
          setItemToDelete(null)
        }}
      />

      <ConfirmDialog
        isOpen={clearCartDialogOpen}
        title="Xóa toàn bộ giỏ hàng"
        message="Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng? Hành động này không thể hoàn tác."
        confirmText="Xóa toàn bộ"
        cancelText="Hủy"
        type="info"
        onConfirm={handleClearCart}
        onCancel={() => setClearCartDialogOpen(false)}
      />
    </div>
  )
}

export default CartPage

