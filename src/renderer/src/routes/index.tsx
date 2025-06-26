import { Navigate, RouteObject, createBrowserRouter } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import { ROUTES } from '@renderer/utils/constants'

// Layouts
//import PublicLayout from '@re/components/layout/PublicLayout'
import AdminLayout from '@renderer/components/layout/AdminLayout'
// Páginas
import { Login, Home, Socios } from '@renderer/pages'

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
      { path: ROUTES.ADMIN_SOCIOS, element: <Socios /> }
      // { path: 'casilleros', element: <AdminCasilleros /> },
      // { path: 'turnos', element: <AdminTurnos /> },
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
const router = createBrowserRouter(routes)

export default router
