import { useAuth } from '@renderer/hooks/useAuth'
import { socioService, cargoService, provinciaService, regionService } from '@renderer/services'
import { ROUTES } from '@renderer/utils/constants'
import { use, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { LoadingOverlay, TitlePage } from '@renderer/components/common'
import type { CreateSocio, Region, Provincia, Cargo } from '@renderer/types'
import { LuUserPlus } from 'react-icons/lu'

export default function NewSocio() {
  const { userInfo } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [cargos, setCargos] = useState<Cargo[]>([])
  const [provincias, setProvincias] = useState<Provincia[]>([])
  const [regiones, setRegiones] = useState<Region[]>([])

  const fetchCargos = () => {
    cargoService
      .getAll()
      .then(response => {
        setCargos(response.data)
      })
      .catch(error => {
        toast.error(error.message)
      })
  }

  const fetchProvincias = () => {
    provinciaService
      .getAll()
      .then(response => {
        setProvincias(response.data)
      })
      .catch(error => {
        toast.error(error.message)
      })
  }

  const fetchRegiones = () => {
    regionService
      .getAll()
      .then(response => {
        setRegiones(response.data)
      })
      .catch(error => {
        toast.error(error.message)
      })
  }

  useEffect(() => {
    if (!userInfo) {
      navigate(ROUTES.LOGIN)
    }
    setLoading(true)
    fetchCargos()
    fetchProvincias()
    fetchRegiones()
    setLoading(false)
  }, [])

  return (
    <div className="h-full w-full flex flex-col justify-start pt-8 px-4">
      {loading && <LoadingOverlay />}
      <section className="flex w-full gap-3">
        <LuUserPlus className="text-6xl text-blue-500 font-bold" />
        <TitlePage title="Nuevo socio" />
      </section>
      <h1>Crear socio</h1>
    </div>
  )
}
