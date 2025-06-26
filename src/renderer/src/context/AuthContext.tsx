import { createContext, useState, useEffect, ReactNode } from 'react'

// definir tipos para la información de usuario
interface UserInfo {
  userId: number
  userName: string
  firstName: string
  lastName: string
  rol: string
}

// definir la interfaz para el contexto de autenticación
export interface AuthContextType {
  isAuthenticated: boolean
  userInfo: UserInfo | null
  token: string | null
  login: (token: string) => void
  logout: () => void
  loading: boolean
}

// valor por defecto
const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  userInfo: null,
  token: null,
  login: () => {},
  logout: () => {},
  loading: true
}

// crear el contexto
export const AuthContext = createContext<AuthContextType>(defaultAuthContext)

interface AuthProviderProps {
  children: ReactNode
}

// función para decodificar el token JWT
const decodeToken = (token: string): UserInfo | null => {
  try {
    const decodedPayload = JSON.parse(atob(token.split('.')[1]))

    return {
      userId: decodedPayload.userId,
      userName: decodedPayload.userName,
      firstName: decodedPayload.firstName,
      lastName: decodedPayload.lastName,
      rol: decodedPayload.rol
    }
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

// función para verificar expiración del token
const isTokenExpired = (token: string): boolean => {
  try {
    const decodedPayload = JSON.parse(atob(token.split('.')[1]))
    return decodedPayload.exp * 1000 < Date.now()
  } catch (error) {
    console.error('Error decoding token:', error)
    return true
  }
}

// proveedor
export default function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verifyToken = () => {
      setLoading(true)
      if (!token) {
        setIsAuthenticated(false)
        setUserInfo(null)
        setLoading(false)
        return
      }
      if (isTokenExpired(token)) {
        logout()
        setLoading(false)
        return
      }
      const decoded = decodeToken(token)
      if (decoded) {
        setIsAuthenticated(true)
        setUserInfo(decoded)
      } else {
        logout()
      }
      setLoading(false)
    }

    verifyToken()
    const intervalId = setInterval(verifyToken, 60000)
    return () => clearInterval(intervalId)
  }, [token])

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setIsAuthenticated(false)
    setUserInfo(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userInfo, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
