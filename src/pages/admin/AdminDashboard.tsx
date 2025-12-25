import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const email = localStorage.getItem('email') || 'Admin'
  const role = localStorage.getItem('role') || 'admin'

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
          <h1>Trang Quản Trị</h1>
          <p>Chào mừng, {email}</p>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Đăng xuất
        </button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>Quản lý Người dùng</h2>
          <p>Xem và quản lý tất cả người dùng trong hệ thống</p>
          <button className="action-button">Quản lý</button>
        </div>

        <div className="dashboard-card">
          <h2>Quản lý Sản phẩm</h2>
          <p>Kiểm duyệt và quản lý tất cả sản phẩm</p>
          <button className="action-button">Quản lý</button>
        </div>

        <div className="dashboard-card">
          <h2>Quản lý Đơn hàng</h2>
          <p>Theo dõi và quản lý tất cả đơn hàng</p>
          <button className="action-button">Quản lý</button>
        </div>

        <div className="dashboard-card">
          <h2>Thống kê</h2>
          <p>Xem báo cáo và thống kê hệ thống</p>
          <button className="action-button">Xem thống kê</button>
        </div>

        <div className="dashboard-card">
          <h2>Cài đặt Hệ thống</h2>
          <p>Cấu hình và cài đặt hệ thống</p>
          <button className="action-button">Cài đặt</button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

