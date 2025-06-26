import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const TIMEOUT = 15000
//crear una instancia de axios
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

// Interceptor para agregar el token a las solicitudes
const setAuthToken = (token: string | null) => {
  if (token) axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  else delete axiosInstance.defaults.headers.common['Authorization']
}

// Manejo de respuestas y errores centralizado
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  error => {
    // capturar errores de autenticacion (401) para posible manejo global
    if (error.response && error.response.status === 401) {
      console.log('Error de autenticacion: ', error)

      //TODO: redirigir al login
    }

    //capturar errores de red
    if (!error.response) {
      console.error('Error de red: ', error)

      //TODO: Mostrar snackbar de red
    }

    return Promise.reject(error)
  }
)

// clase para crear APIs con metodos comunes
class Api {
  private token: string | null = null

  constructor() {
    this.token = localStorage.getItem('token')
    if (this.token) setAuthToken(this.token)
  }

  // Método para establecer el token (útil después del login)
  setToken(token: string | null) {
    this.token = token
    setAuthToken(token)
  }

  // Método GET
  async get<T>(utl: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.get<T>(utl, config)
    return response.data
  }

  // Método POST
  async post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.post<T>(url, data, config)
    return response.data
  }

  // Método PUT
  async put<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.put<T>(url, data, config)
    return response.data
  }

  // Metodo PATCH
  async patch<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.patch<T>(url, data, config)
    return response.data
  }

  // Método DELETE
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.delete<T>(url, config)
    return response.data
  }
}

// Exportar una instancia de la clase Api
const api = new Api()
export default api
