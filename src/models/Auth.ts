import { User } from './User'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  confirmPassword: string
}

export type UserRole = 'admin' | 'user'

export interface AuthResponse {
  token?: string
  accessToken?: string
  id?: string
  email?: string
  role?: UserRole
  user?: User
  message?: string
  code?: string
}

export interface AuthError {
  message: string
  field?: string
}

