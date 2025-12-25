import axios from 'axios'
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '../models/Auth'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const authApi = {
  register: async (data: Omit<RegisterCredentials, 'confirmPassword'>): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/v1/auth/register', data)
    return response.data
  },

  login: async (data: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/v1/auth/login', data)
    return response.data
  },
}

export default api

