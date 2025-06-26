export interface Cargo {
  id: number
  cargo: string
  tipo: 'Socio' | 'Dirigente' // según validación en DTO
}

export interface CreateCargo {
  cargo: string
  tipo: 'Socio' | 'Dirigente'
}

export interface UpdateCargo extends Partial<CreateCargo> {
  id: number
}
