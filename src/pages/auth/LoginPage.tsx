import { Link } from 'react-router-dom'
import { useLoginViewModel } from '../../viewmodels/useLoginViewModel'
import './AuthPage.css'

const LoginPage = () => {
  const { state, actions } = useLoginViewModel()

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Đăng nhập</h1>
          <p>Chào mừng bạn trở lại!</p>
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
              placeholder="Nhập mật khẩu"
              disabled={state.loading}
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={state.loading}>
            {state.loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

