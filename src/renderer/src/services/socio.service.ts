import type { Socio, CreateSocio, UpdateSocio } from '@renderer/types/socio'
import api from './api'
import axios from 'axios'

interface SocioError {
  message: string
}

export const socioService = {
  async create(data: CreateSocio): Promise<Socio> {
    try {
      const response = await api.post<Socio>('/socios', data)
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

  async getAll(): Promise<Socio[]> {
    try {
      const response = await api.get<Socio[]>('/socios')
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

  async getByCod(cod: string): Promise<Socio> {
    try {
      const response = await api.get<Socio>(`/socios/${cod}`)
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

  async update(cod: string, data: UpdateSocio): Promise<Socio> {
    try {
      const response = await api.patch<Socio>(`/socios/${cod}`, data)
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

  async delete(cod: string): Promise<Socio> {
    try {
      const response = await api.delete<Socio>(`/socio/${cod}`)
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
