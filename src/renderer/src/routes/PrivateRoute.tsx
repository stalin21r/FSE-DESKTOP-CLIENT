import { ReactNode, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@renderer/hooks/useAuth'
import { ROUTES } from '@renderer/utils/constants'
import { LoadingOverlay } from '@renderer/components/common'

interface PrivateRouteProps {
  children: ReactNode
  adminOnly?: boolean
}

export default function PrivateRoute({ children, adminOnly = false }: PrivateRouteProps) {
  const { isAuthenticated, userInfo } = useAuth()
  const location = useLocation()
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    // Esperamos medio segundo para permitir ver la vista anterior
    const timer = setTimeout(() => setCheckingAuth(false))
    return () => clearTimeout(timer)
  }, [])

  if (checkingAuth) {
    return (
      <>
        {children}
        <LoadingOverlay />
      </>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  if (adminOnly && userInfo && !userInfo.rol) {
    return <Navigate to={ROUTES.ADMIN_HOME} replace />
  }

  return <>{children}</>
}
