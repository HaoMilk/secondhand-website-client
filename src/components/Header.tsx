import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { UserRole } from '../models/Auth'
import { categoryApi } from '../services/api'
import type { Category } from '../models/Category'
import './Header.css'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [cartCount] = useState(0)
  
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role') as UserRole | null
  const email = localStorage.getItem('email') || 'User'
  
  const categoryMenuRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Hide header only on login/register pages
  const shouldHideHeader = location.pathname === '/login' || location.pathname === '/register'

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getPublic(null)
        if (response.success && response.data) {
          // Lấy các category cấp 1 (parentId = null)
          const mainCategories = response.data.filter(cat => !cat.parentId)
          setCategories(mainCategories)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) {
        setIsCategoryMenuOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const handleLogoClick = () => {
    navigate('/')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log('Searching for:', searchQuery)
      // navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/category/${categoryId}`)
    setIsCategoryMenuOpen(false)
  }

  const handleSellClick = () => {
    if (!token) {
      navigate('/login')
    } else if (role === 'user') {
      navigate('/user/add-product')
    } else {
      navigate('/register')
    }
  }

  const handleLoginClick = () => {
    navigate('/login')
  }

  const handleRegisterClick = () => {
    navigate('/register')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('email')
    setIsUserMenuOpen(false)
    navigate('/')
  }

  const getUserMenuItems = () => {
    if (role === 'admin') {
      return [
        { label: 'Trang Quản Trị', path: '/admin', onClick: () => navigate('/admin') },
        { label: 'Đăng xuất', onClick: handleLogout }
      ]
    } else if (role === 'user') {
      return [
        { label: 'Hồ sơ cá nhân', path: '/user', onClick: () => navigate('/user') },
        { label: 'Thông tin cá nhân', path: '/user/profile', onClick: () => navigate('/user/profile') },
        { label: 'Sản phẩm đã đăng', path: '/user/my-products', onClick: () => navigate('/user/my-products') },
        { label: 'Đơn hàng của tôi', onClick: () => console.log('Orders') },
        { label: 'Đăng xuất', onClick: handleLogout }
      ]
    }
    return []
  }

  // Default categories if API fails
  const defaultCategories = [
    { _id: '1', name: 'Quần áo', slug: 'quan-ao' },
    { _id: '2', name: 'Điện tử', slug: 'dien-tu' },
    { _id: '3', name: 'Nội thất', slug: 'noi-that' },
    { _id: '4', name: 'Sách', slug: 'sach' },
    { _id: '5', name: 'Phụ kiện', slug: 'phu-kien' },
    { _id: '6', name: 'Khác', slug: 'khac' }
  ]

  const displayCategories = categories.length > 0 ? categories : defaultCategories

  if (shouldHideHeader) {
    return null
  }

  return (
    <>
      <header className="header">
        <div className="header-container">
          {/* Logo */}
          <div className="header-logo" onClick={handleLogoClick}>
            <h1>Secondhand Market</h1>
          </div>

          {/* Desktop: Search Bar */}
          <div className="header-search-desktop">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                className="search-input"
                placeholder="Tìm quần áo, điện thoại, sách cũ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
            </form>
          </div>

          {/* Desktop: Actions */}
          <div className="header-actions-desktop">
            {/* Category Menu */}
            <div className="category-menu-wrapper" ref={categoryMenuRef}>
              <button
                className="category-menu-button"
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
                <span>Danh mục</span>
              </button>
              {isCategoryMenuOpen && (
                <div className="category-dropdown">
                  {displayCategories.map((category) => (
                    <button
                      key={category._id}
                      className="category-item"
                      onClick={() => handleCategoryClick(category._id)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sell Button */}
            <button className="sell-button" onClick={handleSellClick}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Đăng bán</span>
            </button>

            {/* Cart */}
            <button className="cart-button" onClick={() => navigate('/cart')}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="m1 1 4 4 13 1-1 7H6"></path>
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            {/* User Menu */}
            {token ? (
              <div className="user-menu-wrapper" ref={userMenuRef}>
                <button
                  className="user-avatar-button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <div className="user-avatar">
                    {email.charAt(0).toUpperCase()}
                  </div>
                </button>
                {isUserMenuOpen && (
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      <div className="user-avatar-small">
                        {email.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-info">
                        <div className="user-email">{email}</div>
                        <div className="user-role">{role === 'admin' ? 'Quản trị viên' : 'Người dùng'}</div>
                      </div>
                    </div>
                    <div className="user-dropdown-divider"></div>
                    {getUserMenuItems().map((item, index) => (
                      <button
                        key={index}
                        className="user-menu-item"
                        onClick={() => {
                          item.onClick()
                          setIsUserMenuOpen(false)
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <button className="login-button" onClick={handleLoginClick}>
                  Đăng nhập
                </button>
                <button className="register-button" onClick={handleRegisterClick}>
                  Đăng ký
                </button>
              </div>
            )}
          </div>

          {/* Mobile: Menu Toggle & Cart */}
          <div className="header-actions-mobile">
            <button className="cart-button-mobile" onClick={() => navigate('/cart')}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="m1 1 4 4 13 1-1 7H6"></path>
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            <button
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {isMobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile: Search Bar */}
        <div className="header-search-mobile">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              className="search-input"
              placeholder="Tìm quần áo, điện thoại, sách cũ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </form>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <>
          <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="mobile-menu-drawer">
            {token ? (
              <>
                <div className="mobile-user-info">
                  <div className="user-avatar-mobile">
                    {email.charAt(0).toUpperCase()}
                  </div>
                    <div>
                      <div className="user-email-mobile">{email}</div>
                      <div className="user-role-mobile">{role === 'admin' ? 'Quản trị viên' : 'Người dùng'}</div>
                    </div>
                </div>
                <div className="mobile-menu-divider"></div>
                {getUserMenuItems().map((item, index) => (
                  <button
                    key={index}
                    className="mobile-menu-item"
                    onClick={() => {
                      item.onClick()
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </>
            ) : (
              <>
                <button className="mobile-menu-item" onClick={handleLoginClick}>
                  Đăng nhập
                </button>
                <button className="mobile-menu-item" onClick={handleRegisterClick}>
                  Đăng ký
                </button>
              </>
            )}
            <div className="mobile-menu-divider"></div>
            <div className="mobile-menu-section-title">Danh mục</div>
            {displayCategories.map((category) => (
              <button
                key={category._id}
                className="mobile-menu-item"
                onClick={() => {
                  handleCategoryClick(category._id)
                  setIsMobileMenuOpen(false)
                }}
              >
                {category.name}
              </button>
            ))}
            <div className="mobile-menu-divider"></div>
            <button className="mobile-sell-button" onClick={handleSellClick}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Đăng bán
            </button>
          </div>
        </>
      )}
    </>
  )
}

export default Header
