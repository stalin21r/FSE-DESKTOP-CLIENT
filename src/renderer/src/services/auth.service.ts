import api from './api'
import axios from 'axios'

interface LoginCredentials {
  user: string
  password: string
}

interface AuthResponse {
  token: string
  message?: string
}

interface AuthError {
  message: string
}

interface RegisterData {
  nombre: string
  apellido: string
  correo: string
  contrasena: string
  usuario: string
  rol: boolean | null
}

const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const data = await api.post<AuthResponse>('/auth/login', credentials)
      return data
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData: AuthError = err.response.data
        throw new Error(errorData.message || 'Error en el inicio de sesión')
      }
      if (err instanceof Error) {
        throw new Error(err.message)
      }
      throw new Error('Error desconocido en el inicio de sesión')
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data)
      return response
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData: AuthError = err.response.data
        throw new Error(errorData.message || 'Error en el registro')
      }
      if (err instanceof Error) {
        throw new Error(err.message)
      }
      throw new Error('Error desconocido en el registro')
    }
  }
  /* TODO: implementar sistema de recuperación en el backend antes de hacer cualquier cosa para usar este método.
  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      return await api.post<{ message: string }>('/auth/forgot-password', {
        email
      })
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData: AuthError = err.response.data
        throw new Error(
          errorData.message || 'Error al solicitar recuperación de contraseña'
        )
      }
      if (err instanceof Error) {
        throw new Error(err.message)
      }
      throw new Error(
        'Error desconocido al solicitar recuperación de contraseña'
      )
    }
  }*/
}

export default authService
