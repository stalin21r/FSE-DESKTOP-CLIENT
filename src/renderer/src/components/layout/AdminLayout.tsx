import { useState } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { LogoCircular } from '@renderer/assets/images'
import { ROUTES } from '@renderer/utils/constants'
import { LuUsers } from 'react-icons/lu'
import { AiOutlineHome } from 'react-icons/ai'

const AdminLayout = () => {
  const { userInfo, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Función para verificar si una ruta está activa
  const isActiveRoute = (route: string) => {
    return location.pathname === route || location.pathname.startsWith(`${route}/`)
  }

  // Alternar la visibilidad del sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-amber-300 text-white ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out`}
      >
        <div className="p-4 flex items-center justify-between text-red-600">
          {sidebarOpen ? (
            <>
              <img src={LogoCircular} alt="Logo" className="w-20 h-20" />
              <h2 className="text-xl font-bold ">FSE</h2>
            </>
          ) : (
            <h2 className="text-xl font-bold">FSE</h2>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-yellow-400 focus:outline-none text-red-600 cursor-pointer"
          >
            {sidebarOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            )}
          </button>
        </div>

        <nav className="mt-8">
          <ul className="space-y-2 px-2 text-red-500 font-bold">
            <li>
              <Link
                to={ROUTES.ADMIN_HOME}
                className={`flex items-center p-3 rounded-lg ${sidebarOpen ? 'justify-start' : 'justify-center'} ${
                  isActiveRoute(ROUTES.ADMIN_HOME) &&
                  !location.pathname.includes(ROUTES.ADMIN_HOME + '/')
                    ? 'bg-amber-200'
                    : 'hover:bg-amber-200'
                }`}
              >
                <AiOutlineHome className="h-7 w-7" />
                {sidebarOpen && <span className="ml-3">Inicio</span>}
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.ADMIN_SOCIOS}
                className={`flex items-center p-3 rounded-lg ${sidebarOpen ? 'justify-start' : 'justify-center'} ${
                  isActiveRoute(ROUTES.ADMIN_SOCIOS) &&
                  !location.pathname.includes(ROUTES.ADMIN_SOCIOS + '/')
                    ? 'bg-amber-200'
                    : 'hover:bg-amber-200'
                }`}
              >
                <LuUsers className="h-7 w-7" />
                {sidebarOpen && <span className="ml-3">Socios</span>}
              </Link>
            </li>
            {/*}
            {userInfo?.rol === 'admin' && (
              <li>
                <Link
                  to={'#'}
                  className={`flex items-center p-3 rounded-lg ${sidebarOpen ? 'justify-start' : 'justify-center'} ${
                    isActiveRoute('/admin/configuracion') ? 'bg-blue-700' : 'hover:bg-blue-700'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {sidebarOpen && <span className="ml-3">Configuración</span>}
                </Link>
              </li>
            )}
              */}
          </ul>
        </nav>

        {/* User profile section at bottom */}
        <div className="mt-2 p-2 border-t-2 border-red-300">
          <Link
            to="#"
            className={`flex items-center p-2 rounded-lg ${
              isActiveRoute('/admin/perfil') ? 'bg-red-300' : 'hover:bg-red-300'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
              <span className="text-lg font-semibold">
                {userInfo?.firstName.charAt(0)}
                {userInfo?.lastName.charAt(0)}
              </span>
            </div>
            {sidebarOpen && (
              <div className="ml-3">
                <p className="font-medium text-red-400">
                  {userInfo?.firstName} {userInfo?.lastName}
                </p>
                <p className="text-sm text-gray-700">
                  {userInfo?.rol ? 'Administrador' : 'Usuario'}
                </p>
              </div>
            )}
          </Link>

          {sidebarOpen && (
            <button
              onClick={handleLogout}
              className="mt-4 w-full flex items-center p-2 rounded-lg text-red-500 hover:bg-red-300 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="ml-3">Cerrar sesión</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar with user info for mobile */}
        <header className="bg-red-300 shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-blue-500">Panel de Administración</h1>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-700">Bienvenido, {userInfo?.firstName}</span>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-500 lg:hidden cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-white p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
