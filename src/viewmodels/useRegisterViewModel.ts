import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../services/api'
import type { RegisterCredentials, AuthError } from '../models/Auth'

interface RegisterViewModelState {
  email: string
  password: string
  confirmPassword: string
  error: string
  loading: boolean
}

interface RegisterViewModelActions {
  setEmail: (email: string) => void
  setPassword: (password: string) => void
  setConfirmPassword: (confirmPassword: string) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  clearError: () => void
}

export interface RegisterViewModel {
  state: RegisterViewModelState
  actions: RegisterViewModelActions
}

export const useRegisterViewModel = (): RegisterViewModel => {
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const validateCredentials = (credentials: RegisterCredentials): AuthError | null => {
    if (!credentials.email || !credentials.password || !credentials.confirmPassword) {
      return { message: 'Vui lòng điền đầy đủ thông tin' }
    }

    if (!credentials.email.includes('@')) {
      return { message: 'Email không hợp lệ', field: 'email' }
    }

    if (credentials.password.length < 6) {
      return { message: 'Mật khẩu phải có ít nhất 6 ký tự', field: 'password' }
    }

    if (credentials.password !== credentials.confirmPassword) {
      return { message: 'Mật khẩu xác nhận không khớp', field: 'confirmPassword' }
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setError('')

    const credentials: RegisterCredentials = { email, password, confirmPassword }
    const validationError = validateCredentials(credentials)

    if (validationError) {
      setError(validationError.message)
      return
    }

    setLoading(true)

    try {
      const response = await authApi.register({ email, password })
      
      // Backend trả về { id, email } khi đăng ký thành công
      if (response.id || response.email) {
        navigate('/login', { 
          state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' } 
        })
      } else {
        setError('Đăng ký thất bại')
      }
    } catch (err: any) {
      // Backend trả về { code, message } khi có lỗi
      const errorMessage = err.response?.data?.message || 'Đăng ký thất bại. Email có thể đã được sử dụng.'
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
      confirmPassword,
      error,
      loading,
    },
    actions: {
      setEmail,
      setPassword,
      setConfirmPassword,
      handleSubmit,
      clearError,
    },
  }
}

