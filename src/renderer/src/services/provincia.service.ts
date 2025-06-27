import type { Provincia, ApiResponse } from '@renderer/types'
import api from './api'
import axios from 'axios'

interface ProvinciaError {
  message: string
}

export const provinciaService = {
  async getAll(): Promise<ApiResponse<Provincia[]>> {
    try {
      const response = await api.get<ApiResponse<Provincia[]>>('/provincias')
      return response
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData: ProvinciaError = err.response.data
        throw new Error(errorData.message || 'Error en el registro')
      }
      if (err instanceof Error) {
        throw new Error(err.message)
      }
      throw new Error('Error desconocido en el registro')
    }
  },

  async getByid(id: number): Promise<ApiResponse<Provincia>> {
    try {
      const response = await api.get<ApiResponse<Provincia>>(`/provincias/${id}`)
      return response
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData: ProvinciaError = err.response.data
        throw new Error(errorData.message || 'Error en el registro')
      }
      if (err instanceof Error) {
        throw new Error(err.message)
      }
      throw new Error('Error desconocido en el registro')
    }
  }
}
