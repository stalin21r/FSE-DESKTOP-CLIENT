import { socioService } from '@renderer/services'
import { ROUTES, ROLES } from '@renderer/utils/constants'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Socio } from '@renderer/types/socio'
import { toast } from 'react-toastify'
import { LoadingOverlay, Pagination, TitlePage } from '@renderer/components/common'
import { useAuth } from '@renderer/hooks/useAuth'
import { FaFaceSadTear } from 'react-icons/fa6'
import { LuUsers } from 'react-icons/lu'
import { NavLink } from 'react-router-dom'
import { FaUserPlus } from 'react-icons/fa'

export default function Socios() {
  const navigate = useNavigate()
  const [socios, setSocios] = useState<Socio[]>([])
  const [loading, setLoading] = useState(false)
  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const { userInfo } = useAuth()

  const totalPages = Math.ceil(socios.length / itemsPerPage)
  const start = (currentPage - 1) * itemsPerPage
  const currentItems = socios.slice(start, start + itemsPerPage)

  useEffect(() => {
    const fetchSocios = async () => {
      try {
        setLoading(true)
        const socios = await socioService.getAll()
        setSocios(socios.data)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchSocios()
  }, [])
  return (
    <div className="h-full w-full flex flex-col justify-start pt-8 px-4">
      {loading && <LoadingOverlay />}
      <section className="flex w-full gap-3">
        <LuUsers className="text-6xl text-blue-500 font-bold" />
        <TitlePage title="Socios" />
      </section>
      <section className="flex w-full items-center justify-end">
        <NavLink
          to={ROUTES.ADMIN_SOCIOS_NEW}
          className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl transition duration-300 ease-in-out gap-2"
        >
          <FaUserPlus />
          Nuevo socio
        </NavLink>
      </section>

      {socios.length === 0 ? (
        <div className="w-full p-2 mt-20 space-y-4 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-red-500">No hay socios registrados</h1>
          <FaFaceSadTear className="text-6xl text-red-500" />
        </div>
      ) : (
        <section className="w-full p-2 flex flex-col items-center justify-center">
          <table className="min-w-6/8 table-auto border border-gray-300 shadow-md rounded-md overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                {[
                  '#',
                  'Cedula',
                  'Nombre',
                  'Telefono',
                  'Telefono 2',
                  'Cargo',
                  'Provincia',
                  'Región'
                ].map((header, index) => (
                  <th key={index} className="px-4 py-2 text-left">
                    {header}
                  </th>
                ))}
                {userInfo?.rol === ROLES.SUPERADMIN && (
                  <th className="px-4 py-2 text-left">Registrado Por</th>
                )}
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((socio, index) => (
                <tr
                  key={socio.codunico}
                  className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-200`}
                >
                  <td className="px-4 py-2 text-left">{start + index + 1}</td>
                  <td className="px-4 py-2 text-left">{socio.cedula}</td>
                  <td className="px-4 py-2 text-left">
                    {socio.papellido +
                      ' ' +
                      socio.sapellido +
                      ' ' +
                      socio.pnombre +
                      ' ' +
                      socio.snombre}
                  </td>
                  <td className="px-4 py-2 text-left">{socio.ptelefono}</td>
                  <td className="px-4 py-2 text-left">{socio.stelefono}</td>
                  <td className="px-4 py-2 text-left">{socio.cargo?.cargo}</td>
                  <td className="px-4 py-2 text-left">{socio.provincia?.provincia}</td>
                  <td className="px-4 py-2 text-left">{socio.region?.region}</td>
                  {userInfo?.rol === ROLES.SUPERADMIN && (
                    <td className="px-4 py-2 text-left">{socio.registradoPor?.username}</td>
                  )}
                  <td className="px-4 py-2 text-left">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => navigate(`${ROUTES.ADMIN_SOCIOS_SHOW}/${socio.codunico}`)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </section>
      )}
    </div>
  )
}
