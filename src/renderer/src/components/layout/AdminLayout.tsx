import { useState } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { LogoCircular } from '@renderer/assets/images'
import { ROUTES } from '@renderer/utils/constants'
import { LuUsers, LuCog, LuChevronDown } from 'react-icons/lu'
import { AiOutlineHome } from 'react-icons/ai'

const AdminLayout = () => {
  const { userInfo, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isConfigDown, setIsConfigDown] = useState(false)

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
        className={`bg-primaryBlue text-white ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out`}
      >
        <div className="p-4 flex items-center justify-between text-red-600">
          {sidebarOpen ? (
            <>
              <img src={LogoCircular} alt="Logo" className="w-20 h-20" />
              <h2 className="text-xl font-bold text-primaryYellow">FSE</h2>
            </>
          ) : (
            <h2 className="text-xl font-bold text-primaryYellow">FSE</h2>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-primaryRed focus:outline-none text-red-600 cursor-pointer"
          >
            {sidebarOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-primaryYellow"
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
                className="h-4 w-4 text-primaryYellow"
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
        <div className="flex flex-col gap-30 ">
          <nav className="mt-8">
            <ul className="space-y-2 px-2 text-white font-bold">
              <li>
                <Link
                  to={ROUTES.ADMIN_HOME}
                  className={`flex items-center p-3 rounded-lg ${sidebarOpen ? 'justify-start' : 'justify-center'} ${
                    isActiveRoute(ROUTES.ADMIN_HOME) &&
                    !location.pathname.includes(ROUTES.ADMIN_HOME + '/')
                      ? 'bg-primaryYellow text-primaryBlue'
                      : 'hover:bg-secondaryYellow hover:text-primaryRed'
                  } transition-all duration-300 ease-in-out`}
                >
                  <AiOutlineHome className="h-7 w-7" />
                  {sidebarOpen && <span className="ml-3">Inicio</span>}
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.ADMIN_SOCIOS}
                  className={`flex items-center p-3 rounded-lg ${sidebarOpen ? 'justify-start' : 'justify-center'} ${
                    isActiveRoute(ROUTES.ADMIN_SOCIOS) ||
                    location.pathname.includes(ROUTES.ADMIN_SOCIOS + '/')
                      ? 'bg-primaryYellow text-primaryBlue'
                      : 'hover:bg-secondaryYellow hover:text-primaryRed'
                  } transition-all duration-300 ease-in-out`}
                >
                  <LuUsers className="h-7 w-7" />
                  {sidebarOpen && <span className="ml-3">Socios</span>}
                </Link>
              </li>

              {userInfo?.rol === 'admin' && (
                <>
                  <li>
                    <button
                      onClick={() => setIsConfigDown(!isConfigDown)}
                      className={`w-full flex items-center p-3 rounded-lg ${sidebarOpen ? 'justify-start' : 'justify-center'} ${
                        isConfigDown && sidebarOpen ? 'bg-primaryRed' : 'hover:bg-primaryRed'
                      } 
                  }`}
                    >
                      <LuCog className="h-7 w-7" />
                      {sidebarOpen && (
                        <div className="flex justify-between w-full">
                          <span className="ml-3">Configuración</span>
                          <span
                            className={`${isConfigDown ? 'rotate-180' : ''} flex justify-center items-center`}
                          >
                            <LuChevronDown />
                          </span>
                        </div>
                      )}
                    </button>
                  </li>
                  <ul
                    className={`${sidebarOpen && isConfigDown ? 'pl-2 ml-3 border-l-2 border-red-300 opacity-100' : 'opacity-0 max-h-0'} transition-all duration-500 ease-in-out`}
                  >
                    <Link
                      to={ROUTES.ADMIN_SOCIOS}
                      className={`flex items-center p-3 rounded-lg ${sidebarOpen ? 'justify-start ' : 'justify-center'} ${
                        isActiveRoute(ROUTES.ADMIN_SOCIOS) &&
                        !location.pathname.includes(ROUTES.ADMIN_SOCIOS + '/')
                          ? 'bg-amber-200'
                          : 'hover:bg-amber-200'
                      }`}
                    >
                      <LuUsers className="h-7 w-7" />
                      {sidebarOpen && <span className="ml-3">Socios</span>}
                    </Link>
                  </ul>
                </>
              )}
            </ul>
          </nav>

          {/* User profile section at bottom */}
          <div className="mt-2 p-2 border-t-2 border-red-300">
            <Link
              to="#"
              className={`flex items-center p-2 rounded-lg bg-primaryRed ${
                isActiveRoute('/admin/perfil')
                  ? 'bg-red-300'
                  : 'hover:bg-yellow-100 hover:text-primaryRed'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-primaryYellow flex items-center justify-center">
                <span className="text-lg font-semibold">
                  {userInfo?.firstName.charAt(0)}
                  {userInfo?.lastName.charAt(0)}
                </span>
              </div>
              {sidebarOpen && (
                <div className="ml-3">
                  <p className="font-bold text-primaryYellow">
                    {userInfo?.firstName} {userInfo?.lastName}
                  </p>
                  <p className="text-sm font-semibold text-gray-700">
                    {userInfo?.rol ? 'Administrador' : 'Usuario'}
                  </p>
                </div>
              )}
            </Link>

            {sidebarOpen && (
              <button
                onClick={handleLogout}
                className="font-bold mt-4 w-full flex items-center px-4 py-5 rounded-lg text-red-500 hover:bg-red-300 cursor-pointer bg-primaryYellow"
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
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar with user info for mobile */}
        <header className="bg-primaryYellow text-primaryBlue shadow-sm z-10 p-2">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-shadow-primaryBlue">Panel de Administración</h1>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-sm font-semibold">Bienvenido, {userInfo?.firstName}</span>
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
