import { useNavigate } from 'react-router-dom'
import '../admin/Dashboard.css'

const UserDashboard = () => {
  const email = localStorage.getItem('email') || 'User'
  const navigate = useNavigate()

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Trang Người Dùng</h1>
          <p>Chào mừng, {email}</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>Sản phẩm của tôi</h2>
          <p>Quản lý sản phẩm bạn đang bán</p>
          <button 
            className="action-button"
            onClick={() => navigate('/user/my-products')}
          >
            Quản lý sản phẩm
          </button>
        </div>

        <div className="dashboard-card">
          <h2>Đăng sản phẩm mới</h2>
          <p>Thêm sản phẩm mới để bán</p>
          <button 
            className="action-button"
            onClick={() => navigate('/user/add-product')}
          >
            Đăng sản phẩm
          </button>
        </div>

        <div className="dashboard-card">
          <h2>Đơn hàng</h2>
          <p>Theo dõi đơn hàng của bạn</p>
          <button className="action-button">Xem đơn hàng</button>
        </div>

        <div className="dashboard-card">
          <h2>Yêu thích</h2>
          <p>Sản phẩm bạn đã yêu thích</p>
          <button className="action-button">Xem yêu thích</button>
        </div>

        <div className="dashboard-card">
          <h2>Thông tin cá nhân</h2>
          <p>Cập nhật thông tin tài khoản</p>
          <button className="action-button">Cập nhật</button>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
