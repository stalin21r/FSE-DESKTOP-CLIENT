export interface Region {
  id: number
  region: string
}

export interface CreateRegion {
  region: string
}

export interface UpdateRegion extends Partial<CreateRegion> {
  id: number
}
