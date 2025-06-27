import type { Region, CreateRegion, UpdateRegion, ApiResponse } from '@renderer/types'
import api from './api'
import axios from 'axios'

interface RegionError {
  message: string
}

export const regionService = {
  async create(data: CreateRegion): Promise<ApiResponse<Region>> {
    try {
      const response = await api.post<ApiResponse<Region>>('/regiones', data)
      return response
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData: RegionError = err.response.data
        throw new Error(errorData.message || 'Error en el registro')
      }
      if (err instanceof Error) {
        throw new Error(err.message)
      }
      throw new Error('Error desconocido en el registro')
    }
  },

  async getAll(): Promise<ApiResponse<Region[]>> {
    try {
      const response = await api.get<ApiResponse<Region[]>>('/regiones')
      return response
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData: RegionError = err.response.data
        throw new Error(errorData.message || 'Error en el registro')
      }
      if (err instanceof Error) {
        throw new Error(err.message)
      }
      throw new Error('Error desconocido en el registro')
    }
  },

  async getById(id: number): Promise<ApiResponse<Region>> {
    try {
      const response = await api.get<ApiResponse<Region>>(`/regiones/${id}`)
      return response
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData: RegionError = err.response.data
        throw new Error(errorData.message || 'Error en el registro')
      }
      if (err instanceof Error) {
        throw new Error(err.message)
      }
      throw new Error('Error desconocido en el registro')
    }
  },

  async update(data: UpdateRegion): Promise<ApiResponse<Region>> {
    try {
      const response = await api.patch<ApiResponse<Region>>(`/regiones`, data)
      return response
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData: RegionError = err.response.data
        throw new Error(errorData.message || 'Error en el registro')
      }
      if (err instanceof Error) {
        throw new Error(err.message)
      }
      throw new Error('Error desconocido en el registro')
    }
  }
}
