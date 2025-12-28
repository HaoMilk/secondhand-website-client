import { Navigate } from 'react-router-dom'
import type { UserRole } from '../models/Auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

// Helper function để decode JWT token (không cần verify signature, chỉ để kiểm tra expiration)
const decodeToken = (token: string): { exp?: number; role?: UserRole } | null => {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    return null
  }
}

// Helper function để kiểm tra token có hợp lệ không (chưa hết hạn)
const isTokenValid = (token: string): boolean => {
  const decoded = decodeToken(token)
  if (!decoded || !decoded.exp) return false
  
  // Kiểm tra expiration (exp là timestamp tính bằng giây)
  const currentTime = Math.floor(Date.now() / 1000)
  return decoded.exp > currentTime
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role') as UserRole | null

  // Kiểm tra token tồn tại và hợp lệ (chưa hết hạn)
  if (!token || !isTokenValid(token)) {
    // Xóa token nếu đã hết hạn
    if (token) {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('email')
    }
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

