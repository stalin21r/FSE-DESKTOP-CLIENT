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
import { BiShowAlt, BiEdit, BiTrash } from 'react-icons/bi'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function Socios() {
  const navigate = useNavigate()
  const [socios, setSocios] = useState<Socio[]>([])
  const [loading, setLoading] = useState(false)
  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const { userInfo } = useAuth()
  const MySwal = withReactContent(Swal)

  const totalPages = Math.ceil(socios.length / itemsPerPage)
  const start = (currentPage - 1) * itemsPerPage
  const currentItems = socios.slice(start, start + itemsPerPage)

  useEffect(() => {
    const fetchSocios = async () => {
      try {
        setLoading(true)
        const socios = await socioService.getAll()
        setSocios(socios.data)
        console.log(socios.data)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchSocios()
  }, [])

  const handleDelete = async (cod: string) => {
    try {
      if (!userInfo) {
        navigate(ROUTES.LOGIN)
      }
      const confirmation = await MySwal.fire({
        title: '¿Está seguro de eliminar este socio?',
        text: 'No olvide verificar los datos antes de eliminar',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#FBD130',
        cancelButtonColor: '#E44F38'
      })
      if (!confirmation.isConfirmed) {
        return
      }
      setLoading(true)
      const response = await socioService.delete(cod)
      toast.success(response.message)
      setSocios(socios.filter(socio => socio.codunico !== cod))
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

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
        <section className="sm:w-full w-2/4 p-2 flex flex-col items-center justify-center">
          <div className="w-full overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-xl shadow-[0_0_10px_rgba(216, 0, 0, 0.64)] overflow-hidden backdrop-blur-sm">
              <thead className="bg-blue-600 text-white text-xs uppercase sticky top-0 z-10 ">
                <tr>
                  {[
                    '#',
                    'Cédula',
                    'Nombre',
                    'Teléfono',
                    'Teléfono 2',
                    'Cargo',
                    'Provincia',
                    'Región',
                    'Sector',
                    'Impreso'
                  ].map((header, index) => (
                    <th
                      key={index}
                      className="px-4 py-3 border-b border-blue-700 text-left tracking-wide"
                    >
                      {header}
                    </th>
                  ))}
                  {userInfo?.rol === ROLES.ADMIN && (
                    <th className="px-4 py-3 border-b border-blue-700 text-left">Registrado Por</th>
                  )}
                  <th className="px-4 py-3 border-b border-blue-700 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {currentItems.map((socio, index) => (
                  <tr
                    key={socio.codunico}
                    className={`transition-colors duration-150 border-b border-gray-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-gray-200`}
                  >
                    <td className="px-4 py-2 font-medium">{start + index + 1}</td>
                    <td className="px-4 py-2">{socio.cedula}</td>
                    <td className="px-4 py-2 break-words max-w-[240px]">
                      {`${socio.papellido || ''} ${socio.sapellido || ''} ${socio.pnombre || ''} ${socio.snombre || ''}`}
                    </td>
                    <td className="px-4 py-2">{socio.ptelefono}</td>
                    <td className="px-4 py-2">{socio.stelefono || 'N/A'}</td>
                    <td className="px-4 py-2">{socio.cargo?.cargo}</td>
                    <td className="px-4 py-2">{socio.provincia?.provincia}</td>
                    <td className="px-4 py-2">{socio.region?.region}</td>
                    <td className="px-4 py-2">{socio.sector || 'N/A'}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          socio.impreso ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                        }`}
                      >
                        {socio.impreso ? 'Sí' : 'No'}
                      </span>
                    </td>
                    {userInfo?.rol === ROLES.ADMIN && (
                      <td className="px-4 py-2">{socio.registradoPor2?.username}</td>
                    )}
                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          title="Ver"
                          className="p-2 rounded-full bg-gray-200 hover:bg-blue-300 text-blue-600 transition-all duration-300 cursor-pointer text-lg"
                          onClick={() =>
                            navigate(ROUTES.ADMIN_SOCIOS_SHOW.replace(':cod', socio.codunico))
                          }
                        >
                          <BiShowAlt />
                        </button>
                        <button
                          title="Editar"
                          className="p-2 rounded-full bg-gray-200 hover:bg-yellow-300 text-yellow-600 transition-all duration-300 cursor-pointer text-lg"
                          onClick={() =>
                            navigate(ROUTES.ADMIN_SOCIOS_EDIT.replace(':cod', socio.codunico))
                          }
                        >
                          <BiEdit />
                        </button>
                        <button
                          title="Eliminar"
                          className="p-2 rounded-full bg-gray-200 hover:bg-red-300 text-red-600 transition-all duration-300 cursor-pointer text-lg"
                          onClick={() => handleDelete(socio.codunico)}
                        >
                          <BiTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
