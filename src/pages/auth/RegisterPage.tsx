import { Link } from 'react-router-dom'
import { useRegisterViewModel } from '../../viewmodels/useRegisterViewModel'
import './AuthPage.css'

const RegisterPage = () => {
  const { state, actions } = useRegisterViewModel()

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Đăng ký</h1>
          <p>Tạo tài khoản mới để bắt đầu</p>
        </div>

        <form onSubmit={actions.handleSubmit} className="auth-form">
          {state.error && <div className="error-message">{state.error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={state.email}
              onChange={(e) => actions.setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              disabled={state.loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={state.password}
              onChange={(e) => actions.setPassword(e.target.value)}
              placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
              disabled={state.loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            <input
              type="password"
              id="confirmPassword"
              value={state.confirmPassword}
              onChange={(e) => actions.setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              disabled={state.loading}
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={state.loading}>
            {state.loading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage

