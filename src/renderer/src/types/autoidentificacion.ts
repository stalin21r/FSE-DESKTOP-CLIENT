export interface Autoidentificacion {
  id: number
  nombre: string
}

export interface CreateAutoidentificacion {
  nombre: string
}

export interface UpdateAutoidentificacion extends Partial<CreateAutoidentificacion> {
  id: number
  nombre: string
}
