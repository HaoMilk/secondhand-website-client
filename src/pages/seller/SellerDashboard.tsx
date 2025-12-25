import { useNavigate } from 'react-router-dom'
import '../admin/Dashboard.css'

const SellerDashboard = () => {
  const navigate = useNavigate()
  const email = localStorage.getItem('email') || 'Seller'
  const role = localStorage.getItem('role') || 'seller'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('email')
    navigate('/login')
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Trang Người Bán</h1>
          <p>Chào mừng, {email}</p>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Đăng xuất
        </button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>Sản phẩm của tôi</h2>
          <p>Quản lý sản phẩm bạn đang bán</p>
          <button className="action-button">Quản lý sản phẩm</button>
        </div>

        <div className="dashboard-card">
          <h2>Thêm sản phẩm mới</h2>
          <p>Đăng bán sản phẩm mới</p>
          <button className="action-button">Thêm sản phẩm</button>
        </div>

        <div className="dashboard-card">
          <h2>Đơn hàng</h2>
          <p>Theo dõi đơn hàng từ khách hàng</p>
          <button className="action-button">Xem đơn hàng</button>
        </div>

        <div className="dashboard-card">
          <h2>Thống kê bán hàng</h2>
          <p>Xem thống kê doanh số và sản phẩm</p>
          <button className="action-button">Xem thống kê</button>
        </div>

        <div className="dashboard-card">
          <h2>Cài đặt cửa hàng</h2>
          <p>Cấu hình thông tin cửa hàng</p>
          <button className="action-button">Cài đặt</button>
        </div>
      </div>
    </div>
  )
}

export default SellerDashboard

