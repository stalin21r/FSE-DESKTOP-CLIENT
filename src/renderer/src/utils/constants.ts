// URL base de la API
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Roles de usuario
export const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  USER: 'user'
}

export const TIPOS_SOCIOS = {
  SOCIO: 'Socio',
  DIRIGENTE: 'Dirigente'
}

// Rutas de la aplicación
export const ROUTES = {
  // Rutas públicas
  LOGIN: '/login',

  // Rutas privadas
  ADMIN_HOME: '/admin',
  ADMIN_SOCIOS: '/admin/socios',
  ADMIN_SOCIOS_NEW: '/admin/socios/nuevo',
  ADMIN_SOCIOS_EDIT: '/admin/socios/editar',
  ADMIN_SOCIOS_SHOW: '/admin/socios/mostrar',
  ADMIN_CARGOS: '/admin/cargos',
  ADMIN_USERS: '/admin/usuarios',
  ADMIN_REGIONES: '/admin/regiones',
  USER_PROFILE: '/admin/perfil'
}

// Mensajes de error
export const ERROR_MESSAGES = {
  SESSION_EXPIRED: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
  NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu conexión a internet.',
  UNAUTHORIZED: 'No tienes permiso para acceder a este recurso.',
  SERVER_ERROR: 'Error en el servidor. Por favor, intenta más tarde.',
  NOT_FOUND: 'El recurso solicitado no existe.',
  DEFAULT: 'Ha ocurrido un error. Por favor, intenta nuevamente.'
}
