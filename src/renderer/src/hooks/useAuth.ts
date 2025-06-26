import { useContext } from 'react'
import { AuthContext, AuthContextType } from '@renderer/context/AuthContext'

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}
