import type { Rol } from './rol'

export interface Usuario {
  id: number
  username: string
  email: string
  firstname: string
  lastname: string
  rol?: Rol // Hacerlo opcional
  active: boolean
}

export interface CreateUsuario {
  username: string
  email: string
  firstname: string
  lastname: string
  password: string
  rolId: number
}

export interface UpdateUsuario extends Partial<CreateUsuario> {
  id: number
  active?: boolean
  currentPassword?: string
}
