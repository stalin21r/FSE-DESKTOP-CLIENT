import type { Usuario, CreateUsuario, UpdateUsuario, ApiResponse } from '@renderer/types'
import api from './api'
import axios from 'axios'

interface UsuarioError {
  message: string
}

export const usuarioService = {
  async create(data: CreateUsuario): Promise<ApiResponse<Usuario>> {
    try {
      const response = await api.post<ApiResponse<Usuario>>('/usuarios', data)
      return response
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData: UsuarioError = err.response.data
        throw new Error(errorData.message || 'Error en el registro')
      }
      if (err instanceof Error) {
        throw new Error(err.message)
      }
      throw new Error('Error desconocido en el registro')
    }
  },

  async getAll(): Promise<ApiResponse<Usuario[]>> {
    try {
      const response = await api.get<ApiResponse<Usuario[]>>('/usuarios')
      return response
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData: UsuarioError = err.response.data
        throw new Error(errorData.message || 'Error obteniendo usuarios')
      }
      if (err instanceof Error) {
        throw new Error(err.message)
      }
      throw new Error('Error desconocido obteniendo usuarios')
    }
  },

  async getById(id: number): Promise<ApiResponse<Usuario>> {
    try {
      const response = await api.get<ApiResponse<Usuario>>(`/usuarios/${id}`)
      return response
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData: UsuarioError = err.response.data
        throw new Error(errorData.message || 'Error obteniendo usuario')
      }
      if (err instanceof Error) {
        throw new Error(err.message)
      }
      throw new Error('Error desconocido obteniendo usuario')
    }
  },

  async update(data: UpdateUsuario): Promise<ApiResponse<Usuario>> {
    try {
      const response = await api.patch<ApiResponse<Usuario>>('/usuarios', data)
      return response
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData: UsuarioError = err.response.data
        throw new Error(errorData.message || 'Error actualizando usuario')
      }
      if (err instanceof Error) {
        throw new Error(err.message)
      }
      throw new Error('Error desconocido actualizando usuario')
    }
  },

  async delete(id: number): Promise<ApiResponse<Usuario>> {
    try {
      const response = await api.delete<ApiResponse<Usuario>>(`/usuarios/${id}`)
      return response
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData: UsuarioError = err.response.data
        throw new Error(errorData.message || 'Error eliminando usuario')
      }
      if (err instanceof Error) {
        throw new Error(err.message)
      }
      throw new Error('Error desconocido eliminando usuario')
    }
  }
}
