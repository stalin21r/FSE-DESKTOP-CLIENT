import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { LoadingOverlay, TitlePage } from '@renderer/components/common'
import { usuarioService } from '@renderer/services'
import type { Usuario, CreateUsuario, UpdateUsuario } from '@renderer/types'
import { LuUsers, LuPlus } from 'react-icons/lu'
import { BiEdit, BiTrash } from 'react-icons/bi'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import UsuarioModal from '@renderer/components/UsuarioModal/UsuarioModal'

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null)
  const MySwal = withReactContent(Swal)

  useEffect(() => {
    fetchUsuarios()
  }, [])

  const fetchUsuarios = async () => {
    try {
      setLoading(true)
      const response = await usuarioService.getAll()
      setUsuarios(response.data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error cargando usuarios')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenCreateModal = () => {
    setModalMode('create')
    setSelectedUsuario(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (usuario: Usuario) => {
    setModalMode('edit')
    setSelectedUsuario(usuario)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedUsuario(null)
  }

  const handleSave = async (data: CreateUsuario | UpdateUsuario) => {
    try {
      setLoading(true)

      if (modalMode === 'create') {
        const response = await usuarioService.create(data as CreateUsuario)
        if (response.status === 201) {
          toast.success('Usuario creado exitosamente')
          handleCloseModal()
          fetchUsuarios()
        }
      } else {
        const response = await usuarioService.update(data as UpdateUsuario)
        if (response.status === 200) {
          toast.success('Usuario actualizado exitosamente')
          handleCloseModal()
          fetchUsuarios()
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error guardando usuario')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (usuario: Usuario) => {
    const confirmacion = await MySwal.fire({
      title: '¿Está seguro de eliminar este usuario?',
      text: `Usuario: ${usuario.username} (${usuario.firstname} ${usuario.lastname})`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#E44F38',
      cancelButtonColor: '#6B7280'
    })

    if (!confirmacion.isConfirmed) return

    try {
      setLoading(true)
      const response = await usuarioService.delete(usuario.id)
      if (response.status === 200) {
        toast.success('Usuario eliminado exitosamente')
        fetchUsuarios()
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error eliminando usuario')
    } finally {
      setLoading(false)
    }
  }

  // Función auxiliar para obtener el nombre del rol basado en el username
  const getRoleName = (username: string): string => {
    // Si el username es 'admin' o contiene 'admin', asumimos que es administrador
    if (username.toLowerCase().includes('admin')) {
      return 'Administrador'
    }
    return 'Usuario'
  }

  // Función auxiliar para determinar si es admin
  const isAdmin = (username: string): boolean => {
    return username.toLowerCase().includes('admin')
  }

  return (
    <div className="h-full w-full flex flex-col justify-start pt-8 px-4">
      {loading && <LoadingOverlay />}

      <section className="flex w-full gap-3 items-center">
        <LuUsers className="text-6xl text-blue-500 font-bold" />
        <TitlePage title="Usuarios" />
      </section>

      <section className="flex w-full items-center justify-end mb-4">
        <button
          onClick={handleOpenCreateModal}
          className="cursor-pointer flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl transition duration-300 ease-in-out"
        >
          <LuPlus className="text-xl" />
          Nuevo Usuario
        </button>
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
                  Usuario
                </th>
                <th className="px-6 py-4 border-b border-blue-700 text-left tracking-wide">
                  Nombre Completo
                </th>
                <th className="px-6 py-4 border-b border-blue-700 text-left tracking-wide">
                  Correo
                </th>
                <th className="px-6 py-4 border-b border-blue-700 text-left tracking-wide w-32">
                  Rol
                </th>
                <th className="px-6 py-4 border-b border-blue-700 text-left tracking-wide w-32">
                  Estado
                </th>
                <th className="px-6 py-4 border-b border-blue-700 text-center tracking-wide w-40">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {usuarios.map((usuario, index) => (
                <tr
                  key={usuario.id}
                  className={`transition-colors duration-150 border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-gray-100`}
                >
                  <td className="px-6 py-3 font-medium">{index + 1}</td>
                  <td className="px-6 py-3 font-semibold">{usuario.username}</td>
                  <td className="px-6 py-3">
                    {usuario.firstname} {usuario.lastname}
                  </td>
                  <td className="px-6 py-3">{usuario.email}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${isAdmin(usuario.username)
                        ? 'bg-purple-200 text-purple-800'
                        : 'bg-blue-200 text-blue-800'
                        }`}
                    >
                      {getRoleName(usuario.username)}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${usuario.active
                        ? 'bg-green-200 text-green-800'
                        : 'bg-red-200 text-red-800'
                        }`}
                    >
                      {usuario.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleOpenEditModal(usuario)}
                        className="p-2 rounded-full bg-gray-200 hover:bg-yellow-300 text-yellow-600 transition-all duration-300 cursor-pointer text-lg"
                        title="Editar"
                      >
                        <BiEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(usuario)}
                        className="p-2 rounded-full bg-gray-200 hover:bg-red-300 text-red-600 transition-all duration-300 cursor-pointer text-lg"
                        title="Eliminar"
                      >
                        <BiTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {usuarios.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <LuUsers className="text-6xl mx-auto mb-4 opacity-50" />
              <p className="text-xl">No hay usuarios registrados</p>
              <p className="text-sm mt-2">Haz clic en "Nuevo Usuario" para agregar uno</p>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      <UsuarioModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        usuario={selectedUsuario}
        mode={modalMode}
      />
    </div>
  )
}