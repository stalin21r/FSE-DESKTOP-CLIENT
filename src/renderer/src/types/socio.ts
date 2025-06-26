import type { Cargo } from './cargo'
import type { Provincia } from './provincia'
import type { Region } from './region'
import type { Usuario } from './usuario'

export interface CreateSocio {
  pnombre: string
  cedula?: string
  snombre?: string
  papellido: string
  sapellido?: string
  ptelefono: string
  stelefono?: string
  rutafoto: string
  rutafirma: string
  cargoid?: number
  provinciaid: number
  regionid?: number
  sector?: string
  registradoPorid: number
}

export interface UpdateSocio extends Partial<CreateSocio> {
  codunico: string
  impreso?: boolean
}

export interface Socio {
  id: number
  codunico: string
  pnombre: string
  snombre: string | null
  papellido: string
  sapellido: string | null
  ptelefono: string
  stelefono: string | null
  rutafoto: string
  rutafirma: string
  cargoid: number | null
  provinciaid: number
  impreso: boolean
  regionid: number | null
  sector: string | null
  fechaRegistro: string // normalmente fechas vienen como ISO strings en JSON
  registradoPorid: number
  machine: string | null
  cedula: string

  // Relaciones
  cargo?: Cargo | null
  provincia?: Provincia
  region?: Region | null
  registradoPor?: Usuario
}
