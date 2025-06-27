import type { Cargo, CreateCargo, UpdateCargo, ApiResponse } from '@renderer/types'
import api from './api'
import axios from 'axios'

interface CargoError {
  message: string
}
export const cargoService = {
  async create(data: CreateCargo): Promise<ApiResponse<Cargo>> {
    try {
      const response = await api.post<ApiResponse<Cargo>>('/cargos', data)
      return response
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData: CargoError = err.response.data
        throw new Error(errorData.message || 'Error en el registro')
      }
      if (err instanceof Error) {
        throw new Error(err.message)
      }
      throw new Error('Error desconocido en el registro')
    }
  },

  async getAll(): Promise<ApiResponse<Cargo[]>> {
    try {
      const response = await api.get<ApiResponse<Cargo[]>>('/cargos')
      return response
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData: CargoError = err.response.data
        throw new Error(errorData.message || 'Error en el registro')
      }
      if (err instanceof Error) {
        throw new Error(err.message)
      }
      throw new Error('Error desconocido en el registro')
    }
  },

  async getById(id: number): Promise<ApiResponse<Cargo>> {
    try {
      const response = await api.get<ApiResponse<Cargo>>(`/cargos/${id}`)
      return response
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData: CargoError = err.response.data
        throw new Error(errorData.message || 'Error en el registro')
      }
      if (err instanceof Error) {
        throw new Error(err.message)
      }
      throw new Error('Error desconocido en el registro')
    }
  },

  async update(id: number, data: UpdateCargo): Promise<ApiResponse<Cargo>> {
    try {
      const response = await api.patch<ApiResponse<Cargo>>(`/cargos/${id}`, data)
      return response
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData: CargoError = err.response.data
        throw new Error(errorData.message || 'Error en el registro')
      }
      if (err instanceof Error) {
        throw new Error(err.message)
      }
      throw new Error('Error desconocido en el registro')
    }
  }
}
