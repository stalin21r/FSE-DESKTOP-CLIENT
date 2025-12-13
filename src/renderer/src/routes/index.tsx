import { Navigate, RouteObject, createHashRouter } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import { ROUTES } from '@renderer/utils/constants'

// Layouts
//import PublicLayout from '@re/components/layout/PublicLayout'
import AdminLayout from '@renderer/components/layout/AdminLayout'
// Páginas
import { Login, Home, Socios, NewSocio, EditSocio, ViewSocio, Cargos } from '@renderer/pages'
import Usuarios from '@renderer/pages/Usuarios/Usuarios'

// Definición de rutas
const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/login" replace />
  },
  {
    path: ROUTES.LOGIN,
    element: <Login />
  },
  // Rutas privadas con layout de administración
  {
    path: ROUTES.ADMIN_HOME,
    element: (
      <PrivateRoute>
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      // Páginas de administración (comentadas hasta que se implementen las páginas)
      { index: true, element: <Home /> },
      { path: ROUTES.ADMIN_SOCIOS, element: <Socios /> },
      { path: ROUTES.ADMIN_SOCIOS_NEW, element: <NewSocio /> },
      { path: ROUTES.ADMIN_SOCIOS_EDIT, element: <EditSocio /> },
      { path: ROUTES.ADMIN_SOCIOS_SHOW, element: <ViewSocio /> },
      { path: ROUTES.ADMIN_CARGOS, element: <Cargos /> },
      {
        path: ROUTES.ADMIN_USERS,
        element: (
          <PrivateRoute adminOnly={true}>
            <Usuarios />
          </PrivateRoute>
        )
      }
      // { path: 'configuracion', element: <PrivateRoute adminOnly={true}><AdminConfiguracion /></PrivateRoute> },
      // { path: 'perfil', element: <UserProfile /> },
    ]
  }

  // Ruta para 404 (comentada hasta tener la página de NotFound)
  // {
  //   path: '*',
  //   element: <NotFound />,
  // },
]

// Crear el router
const router = createHashRouter(routes)

export default router
