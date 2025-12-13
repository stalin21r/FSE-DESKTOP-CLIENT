export interface Cargo {
  id: number
  cargo: string
  tipo: 'Miembro' | 'Dirigente' // Cambiado de 'Socio' a 'Miembro'
}

export interface CreateCargo {
  cargo: string
  tipo: 'Miembro' | 'Dirigente' // Cambiado de 'Socio' a 'Miembro'
}

export interface UpdateCargo extends Partial<CreateCargo> {
  id: number
}
