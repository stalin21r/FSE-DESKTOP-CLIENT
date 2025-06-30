import type { Socio, CreateSocio, UpdateSocio, ApiResponse } from '@renderer/types'
import api from './api'
import axios from 'axios'

interface SocioError {
  message: string
}

export const socioService = {
  async create(data: CreateSocio): Promise<ApiResponse<Socio>> {
    try {
      const response = await api.post<ApiResponse<Socio>>('/socios', data)
      return response
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData: SocioError = err.response.data
        throw new Error(errorData.message || 'Error en el registro')
      }
      if (err instanceof Error) {
        throw new Error(err.message)
      }
      throw new Error('Error desconocido en el registro')
    }
  },

  async getAll(): Promise<ApiResponse<Socio[]>> {
    try {
      const response = await api.get<ApiResponse<Socio[]>>('/socios')
      return response
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData: SocioError = err.response.data
        throw new Error(errorData.message || 'Error en el registro')
      }
      if (err instanceof Error) {
        throw new Error(err.message)
      }
      throw new Error('Error desconocido en el registro')
    }
  },

  async getByCod(cod: string): Promise<ApiResponse<Socio>> {
    try {
      const response = await api.get<ApiResponse<Socio>>(`/socios/${cod}`)
      return response
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData: SocioError = err.response.data
        throw new Error(errorData.message || 'Error en el registro')
      }
      if (err instanceof Error) {
        throw new Error(err.message)
      }
      throw new Error('Error desconocido en el registro')
    }
  },

  async update(data: UpdateSocio): Promise<ApiResponse<Socio>> {
    try {
      const response = await api.patch<ApiResponse<Socio>>(`/socios`, data)
      return response
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData: SocioError = err.response.data
        throw new Error(errorData.message || 'Error en el registro')
      }
      if (err instanceof Error) {
        throw new Error(err.message)
      }
      throw new Error('Error desconocido en el registro')
    }
  },

  async delete(cod: string): Promise<ApiResponse<Socio>> {
    try {
      const response = await api.delete<ApiResponse<Socio>>(`/socios/${cod}`)
      return response
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData: SocioError = err.response.data
        throw new Error(errorData.message || 'Error en el registro')
      }
      if (err instanceof Error) {
        throw new Error(err.message)
      }
      throw new Error('Error desconocido en el registro')
    }
  }
}
