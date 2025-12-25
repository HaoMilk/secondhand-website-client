import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../services/api'
import type { LoginCredentials, AuthError } from '../models/Auth'

interface LoginViewModelState {
  email: string
  password: string
  error: string
  loading: boolean
}

interface LoginViewModelActions {
  setEmail: (email: string) => void
  setPassword: (password: string) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  clearError: () => void
}

export interface LoginViewModel {
  state: LoginViewModelState
  actions: LoginViewModelActions
}

export const useLoginViewModel = (): LoginViewModel => {
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const validateCredentials = (credentials: LoginCredentials): AuthError | null => {
    if (!credentials.email || !credentials.password) {
      return { message: 'Vui lòng điền đầy đủ thông tin' }
    }

    if (!credentials.email.includes('@')) {
      return { message: 'Email không hợp lệ', field: 'email' }
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const credentials: LoginCredentials = { email, password }
    const validationError = validateCredentials(credentials)

    if (validationError) {
      setError(validationError.message)
      setLoading(false)
      return
    }

    try {
      const response = await authApi.login(credentials)
      
      // Backend trả về { accessToken, role, email } khi đăng nhập thành công
      const token = response.accessToken || response.token
      if (token) {
        localStorage.setItem('token', token)
        localStorage.setItem('role', response.role || 'user')
        localStorage.setItem('email', response.email || email)
        
        // Redirect theo role
        const role = response.role || 'user'
        if (role === 'admin') {
          navigate('/admin')
        } else if (role === 'seller') {
          navigate('/seller')
        } else {
          navigate('/user')
        }
      } else {
        setError(response.message || 'Đăng nhập thất bại')
      }
    } catch (err: any) {
      // Backend trả về { code, message } khi có lỗi
      const errorMessage = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const clearError = (): void => {
    setError('')
  }

  return {
    state: {
      email,
      password,
      error,
      loading,
    },
    actions: {
      setEmail,
      setPassword,
      handleSubmit,
      clearError,
    },
  }
}

