import type {
  Autoidentificacion,
  CreateAutoidentificacion,
  UpdateAutoidentificacion,
  ApiResponse
} from '@renderer/types'
import api from './api'
import axios from 'axios'

interface AutoidentificacionError {
  message: string
}

export const autoidentificacionService = {
  async create(data: CreateAutoidentificacion): Promise<ApiResponse<Autoidentificacion>> {
    try {
      const response = await api.post<ApiResponse<Autoidentificacion>>('/autoidentificacion', data)
      return response
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData: AutoidentificacionError = err.response.data
        throw new Error(errorData.message || 'Error en el registro')
      }
      if (err instanceof Error) {
        throw new Error(err.message)
      }
      throw new Error('Error desconocido en el registro')
    }
  },

  async getAll(): Promise<ApiResponse<Autoidentificacion[]>> {
    try {
      const response = await api.get<ApiResponse<Autoidentificacion[]>>('/autoidentificacion')
      return response
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData: AutoidentificacionError = err.response.data
        throw new Error(errorData.message || 'Error en el registro')
      }
      if (err instanceof Error) {
        throw new Error(err.message)
      }
      throw new Error('Error desconocido en el registro')
    }
  },

  async getById(id: number): Promise<ApiResponse<Autoidentificacion>> {
    try {
      const response = await api.get<ApiResponse<Autoidentificacion>>(`/autoidentificacion/${id}`)
      return response
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData: AutoidentificacionError = err.response.data
        throw new Error(errorData.message || 'Error en el registro')
      }
      if (err instanceof Error) {
        throw new Error(err.message)
      }
      throw new Error('Error desconocido en el registro')
    }
  },

  async update(data: UpdateAutoidentificacion): Promise<ApiResponse<Autoidentificacion>> {
    try {
      const response = await api.patch<ApiResponse<Autoidentificacion>>(`/autoidentificacion`, data)
      return response
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData: AutoidentificacionError = err.response.data
        throw new Error(errorData.message || 'Error en el registro')
      }
      if (err instanceof Error) {
        throw new Error(err.message)
      }
      throw new Error('Error desconocido en el registro')
    }
  }
}
