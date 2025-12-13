import { useEffect, useState } from 'react'
import { LuX, LuEye, LuEyeOff } from 'react-icons/lu'
import type { CreateUsuario, UpdateUsuario, Usuario } from '@renderer/types'

interface UsuarioModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: CreateUsuario | UpdateUsuario) => void
  usuario?: Usuario | null
  mode: 'create' | 'edit'
}

export default function UsuarioModal({ isOpen, onClose, onSave, usuario, mode }: UsuarioModalProps) {
  const [formData, setFormData] = useState<CreateUsuario>({
    username: '',
    email: '',
    firstname: '',
    lastname: '',
    password: '',
    rolId: 2 // Por defecto, rol de usuario normal
  })

  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (mode === 'edit' && usuario) {
      setFormData({
        username: usuario.username,
        email: usuario.email,
        firstname: usuario.firstname,
        lastname: usuario.lastname,
        password: '',
        rolId: usuario.rol?.id || 2  // Usar operador opcional y valor por defecto
      })
    } else {
      setFormData({
        username: '',
        email: '',
        firstname: '',
        lastname: '',
        password: '',
        rolId: 2
      })
    }
    setErrors({})
    setShowPassword(false)
  }, [mode, usuario, isOpen])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo es requerido'
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Correo electrónico no válido'
    }

    if (!formData.firstname.trim()) {
      newErrors.firstname = 'El nombre es requerido'
    }

    if (!formData.lastname.trim()) {
      newErrors.lastname = 'El apellido es requerido'
    }

    if (mode === 'create' && !formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida'
    }

    if (mode === 'create' && formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    if (mode === 'edit' && usuario) {
      const updateData: UpdateUsuario = {
        id: usuario.id,
        username: formData.username,
        email: formData.email,
        firstname: formData.firstname,
        lastname: formData.lastname,
        rolId: formData.rolId
      }

      // Solo incluir password si se proporcionó uno nuevo
      if (formData.password.trim()) {
        updateData.password = formData.password
      }

      onSave(updateData)
    } else {
      onSave(formData)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-blue-600 text-white rounded-t-2xl">
          <h2 className="text-xl font-bold">
            {mode === 'create' ? 'Nuevo Usuario' : 'Editar Usuario'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-700 rounded-full transition-colors"
          >
            <LuX className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-1">
              Usuario<span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={e => setFormData({ ...formData, username: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="nombre.usuario"
            />
            {errors.username && <p className="text-red-600 text-xs mt-1">{errors.username}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-1">
              Correo Electrónico<span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="usuario@ejemplo.com"
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Firstname */}
          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-1">
              Nombre<span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.firstname}
              onChange={e => setFormData({ ...formData, firstname: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Juan"
            />
            {errors.firstname && <p className="text-red-600 text-xs mt-1">{errors.firstname}</p>}
          </div>

          {/* Lastname */}
          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-1">
              Apellido<span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.lastname}
              onChange={e => setFormData({ ...formData, lastname: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Pérez"
            />
            {errors.lastname && <p className="text-red-600 text-xs mt-1">{errors.lastname}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-1">
              Contraseña{mode === 'create' && <span className="text-red-600">*</span>}
              {mode === 'edit' && <span className="text-gray-500 text-xs ml-1">(dejar vacío para no cambiar)</span>}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <LuEyeOff /> : <LuEye />}
              </button>
            </div>
            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Rol */}
          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-1">
              Rol<span className="text-red-600">*</span>
            </label>
            <select
              value={formData.rolId}
              onChange={e => setFormData({ ...formData, rolId: Number(e.target.value) })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value={1}>Administrador</option>
              <option value={2}>Usuario</option>
            </select>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-colors"
            >
              {mode === 'create' ? 'Crear' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}