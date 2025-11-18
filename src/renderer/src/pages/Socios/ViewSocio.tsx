import { useParams, useNavigate, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Socio } from '@renderer/types/socio'
import { socioService } from '@renderer/services'
import { LoadingOverlay, TitlePage } from '@renderer/components/common'
import { ROUTES } from '@renderer/utils/constants'
import { LuUser } from 'react-icons/lu'
import { toast } from 'react-toastify'
import { useAuth } from '@renderer/hooks/useAuth'
import { FaArrowLeft } from 'react-icons/fa'
export default function ViewSocio() {
  const { cod } = useParams()
  const { userInfo } = useAuth()
  const [socio, setSocio] = useState<Socio | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSocio = async () => {
      try {
        setLoading(true)
        const result = await socioService.getByCod(cod as string)
        setSocio(result.data)
      } catch (error) {
        toast.error('Error al obtener datos del socio')
        navigate(ROUTES.ADMIN_SOCIOS)
      } finally {
        setLoading(false)
      }
    }

    fetchSocio()
  }, [cod])

  if (loading || !socio) return <LoadingOverlay />

  return (
    <div className="h-full w-full flex flex-col justify-start pt-8 px-4">
      <section className="flex w-full gap-3 items-center">
        <LuUser className="text-6xl text-blue-500 font-bold" />
        <TitlePage title="Detalle del Socio" />
      </section>
      <section className="flex w-full items-center justify-end">
        <NavLink
          to={ROUTES.ADMIN_SOCIOS}
          className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl transition duration-300 ease-in-out gap-2"
        >
          <FaArrowLeft />
          Volver
        </NavLink>
      </section>
      <section className="w-full py-4">
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-blue-900">
            <Info label="Cédula" value={socio.cedula} />
            <Info label="Código" value={socio.codunico} />
            <Info label="Primer Nombre" value={socio.pnombre} />
            <Info label="Segundo Nombre" value={socio.snombre} />
            <Info label="Primer Apellido" value={socio.papellido} />
            <Info label="Segundo Apellido" value={socio.sapellido} />
            <Info label="Teléfono 1" value={socio.ptelefono} />
            <Info label="Teléfono 2" value={socio.stelefono || 'N/A'} />
            <Info label="Cargo" value={socio.cargo?.cargo} />
            <Info label="Provincia" value={socio.provincia?.provincia} />
            <Info label="Región" value={socio.region?.region} />
            <Info label="Auto Identificación" value={socio.autoidentificacionfk2?.nombre} />
            {socio.regionid! > 2 && <Info label="Sector" value={socio.sector || 'N/A'} />}
            {userInfo?.rol === 'admin' && (
              <Info label="Registrado Por" value={socio.registradoPor2?.username || 'N/A'} />
            )}

            <Info label="Impreso" value={socio.impreso ? 'Sí' : 'No'} />
            <Info
              label="Fecha de Registro"
              value={new Date(socio.fechaRegistro).toLocaleString()}
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function Info({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex flex-col">
      <span className="text-red-600 font-semibold">{label}:</span>
      <span className="text-black">{value || 'N/A'}</span>
    </div>
  )
}
