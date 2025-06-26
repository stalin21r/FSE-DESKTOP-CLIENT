import { useAuth } from '@renderer/hooks/useAuth'
import authService from '@renderer/services/auth.service'
import { ERROR_MESSAGES, ROUTES } from '@renderer/utils/constants'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { LogoCircular } from '@renderer/assets/images'
import { LoadingOverlay } from '@renderer/components/common'

export default function Login() {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, userInfo } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (userInfo) navigate(ROUTES.ADMIN_HOME, { replace: true })
  })

  const from = location.state?.from?.pathname || ROUTES.ADMIN_HOME

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user.trim()) {
      toast.error('El usuario es requerido')
      return
    }
    if (!password.trim()) {
      toast.error('La contraseña es requerida')
      return
    }
    setLoading(true)
    authService
      .login({ user, password })
      .then(res => {
        toast.success(res.message)
        login(res.token)
        navigate(from, { replace: true })
      })
      .catch(err => {
        if (err instanceof Error) {
          toast.error(err.message)
        } else {
          toast.error(ERROR_MESSAGES.NETWORK_ERROR)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className="h-screen flex items-center justify-center bg-yellow-500">
      {loading && <LoadingOverlay />}
      <div className="w-96 bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-center mb-8">
          <img
            src={LogoCircular}
            className="w-24 h-24 border-2 border-red-600 rounded-full"
            alt="Logo FSE"
          />
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="user" className="block text-base font-medium text-blue-700 mb-2">
              Usuario
            </label>
            <input
              type="text"
              id="user"
              value={user}
              onChange={e => setUser(e.currentTarget.value)}
              className="text-black w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-base font-medium text-blue-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.currentTarget.value)}
              className="text-black w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Iniciar sesión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
