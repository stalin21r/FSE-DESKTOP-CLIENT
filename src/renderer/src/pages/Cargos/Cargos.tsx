import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { LoadingOverlay, TitlePage } from '@renderer/components/common'
import { cargoService } from '@renderer/services'
import type { Cargo, CreateCargo } from '@renderer/types'
import { LuBriefcase, LuPlus, LuCheck, LuX } from 'react-icons/lu'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function Cargos() {
  const [cargos, setCargos] = useState<Cargo[]>([])
  const [loading, setLoading] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [newCargo, setNewCargo] = useState<CreateCargo>({
    cargo: '',
    tipo: 'Dirigente'
  })
  const MySwal = withReactContent(Swal)

  // Lista de palabras prohibidas
  const palabrasProhibidas = [
    'NACIONAL',
    'PROVINCIA',
    'PROVINCIAL',
    'CANTON',
    'CANTONAL',
    'COMUNIDAD',
    'COMUNA'
  ]

  useEffect(() => {
    fetchCargos()
  }, [])

  const fetchCargos = async () => {
    try {
      setLoading(true)
      const response = await cargoService.getAll()
      setCargos(response.data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error cargando cargos')
    } finally {
      setLoading(false)
    }
  }

  const handleAddClick = () => {
    setIsAdding(true)
    setNewCargo({ cargo: '', tipo: 'Dirigente' })
  }

  const handleCancelAdd = () => {
    setIsAdding(false)
    setNewCargo({ cargo: '', tipo: 'Dirigente' })
  }

  // Función para validar palabras prohibidas
  const validarPalabrasProhibidas = (texto: string): string | null => {
    const textoMayusculas = texto.toUpperCase()

    for (const palabra of palabrasProhibidas) {
      if (textoMayusculas.includes(palabra)) {
        return palabra
      }
    }

    return null
  }

  // Función para validar si el cargo ya existe
  const validarCargoDuplicado = (nombre: string, tipo: 'Miembro' | 'Dirigente'): boolean => {
    return cargos.some(
      cargo =>
        cargo.cargo.toUpperCase().trim() === nombre.toUpperCase().trim() &&
        cargo.tipo === tipo
    )
  }

  const handleSaveNew = async () => {
    if (!newCargo.cargo.trim()) {
      toast.error('El nombre del cargo es requerido')
      return
    }

    // Validar palabras prohibidas
    const palabraProhibida = validarPalabrasProhibidas(newCargo.cargo)
    if (palabraProhibida) {
      await MySwal.fire({
        title: '⚠️ Término no permitido',
        text: `No puede ingresar el término "${palabraProhibida}"`,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#E44F38'
      })
      return
    }

    // Validar cargo duplicado
    if (validarCargoDuplicado(newCargo.cargo, newCargo.tipo)) {
      await MySwal.fire({
        title: '⚠️ Cargo duplicado',
        text: `El cargo "${newCargo.cargo}" con tipo "${newCargo.tipo}" ya existe`,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#E44F38'
      })
      return
    }

    const confirmacion = await MySwal.fire({
      title: '¿Está seguro de crear este cargo?',
      text: `Cargo: ${newCargo.cargo} - Tipo: ${newCargo.tipo}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, crear',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#FBD130',
      cancelButtonColor: '#E44F38'
    })

    if (!confirmacion.isConfirmed) return

    try {
      setLoading(true)
      const response = await cargoService.create(newCargo)
      if (response.status === 201) {
        toast.success('Cargo creado exitosamente')
        setIsAdding(false)
        setNewCargo({ cargo: '', tipo: 'Dirigente' })
        fetchCargos()
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error creando cargo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full w-full flex flex-col justify-start pt-8 px-4">
      {loading && <LoadingOverlay />}

      <section className="flex w-full gap-3 items-center">
        <LuBriefcase className="text-6xl text-blue-500 font-bold" />
        <TitlePage title="Cargos" />
      </section>

      <section className="flex w-full items-center justify-end mb-4">
        {!isAdding && (
          <button
            onClick={handleAddClick}
            className="cursor-pointer flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl transition duration-300 ease-in-out"
          >
            <LuPlus className="text-xl" />
            Nuevo Cargo
          </button>
        )}
      </section>

      <section className="w-full p-2">
        <div className="w-full overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-xl shadow-lg overflow-hidden bg-white">
            <thead className="bg-blue-600 text-white text-sm uppercase">
              <tr>
                <th className="px-6 py-4 border-b border-blue-700 text-left tracking-wide w-20">
                  #
                </th>
                <th className="px-6 py-4 border-b border-blue-700 text-left tracking-wide">
                  Cargo
                </th>
                <th className="px-6 py-4 border-b border-blue-700 text-left tracking-wide w-48">
                  Tipo
                </th>
                {isAdding && (
                  <th className="px-6 py-4 border-b border-blue-700 text-center tracking-wide w-32">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {cargos.map((cargo, index) => (
                <tr
                  key={cargo.id}
                  className={`transition-colors duration-150 border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-gray-100`}
                >
                  <td className="px-6 py-3 font-medium">{index + 1}</td>
                  <td className="px-6 py-3 uppercase">{cargo.cargo}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${cargo.tipo === 'Dirigente'
                        ? 'bg-purple-200 text-purple-800'
                        : 'bg-blue-200 text-blue-800'
                        }`}
                    >
                      {cargo.tipo}
                    </span>
                  </td>
                  {isAdding && <td className="px-6 py-3"></td>}
                </tr>
              ))}

              {/* Fila para agregar nuevo cargo */}
              {isAdding && (
                <tr className="bg-yellow-50 border-2 border-yellow-400">
                  <td className="px-6 py-3 font-medium text-gray-400">{cargos.length + 1}</td>
                  <td className="px-6 py-3">
                    <input
                      type="text"
                      value={newCargo.cargo}
                      onChange={e =>
                        setNewCargo({ ...newCargo, cargo: e.target.value.toUpperCase() })
                      }
                      placeholder="Nombre del cargo..."
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black uppercase"
                      autoFocus
                    />
                  </td>
                  <td className="px-6 py-3">
                    <select
                      value={newCargo.tipo}
                      onChange={e =>
                        setNewCargo({
                          ...newCargo,
                          tipo: e.target.value as 'Miembro' | 'Dirigente'
                        })
                      }
                      className="cursor-pointer w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    >
                      <option value="Dirigente" className='cursor-pointer'>Dirigente</option>
                      <option value="Miembro" className='cursor-pointer'>Miembro</option>
                    </select>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={handleSaveNew}
                        className="cursor-pointer p-2 rounded-full bg-green-500 hover:bg-green-600 text-white transition-all duration-300"
                        title="Guardar"
                      >
                        <LuCheck className="text-xl" />
                      </button>
                      <button
                        onClick={handleCancelAdd}
                        className="cursor-pointer p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-300"
                        title="Cancelar"
                      >
                        <LuX className="text-xl" />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {cargos.length === 0 && !isAdding && (
            <div className="text-center py-12 text-gray-500">
              <LuBriefcase className="text-6xl mx-auto mb-4 opacity-50" />
              <p className="text-xl">No hay cargos registrados</p>
              <p className="text-sm mt-2">Haz clic en "Nuevo Cargo" para agregar uno</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}