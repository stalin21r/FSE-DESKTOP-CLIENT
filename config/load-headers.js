import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isDevelopment = process.env.VITE_NODE_ENV === 'development'

const headersFile = isDevelopment
  ? path.join(__dirname, 'headers.dev.json')
  : path.join(__dirname, 'headers.prod.json')

let headersConfig
try {
  headersConfig = JSON.parse(fs.readFileSync(headersFile, 'utf-8'))
} catch (error) {
  console.error('❌ Error cargando headers:', error.message)
  throw error
}

function buildCSP(cspObject) {
  if (!cspObject || typeof cspObject !== 'object') {
    throw new Error('Configuración CSP inválida')
  }

  return Object.entries(cspObject)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ')
}

export const headers = {
  'Content-Security-Policy': buildCSP(headersConfig['Content-Security-Policy'])
}

// Debug info
console.log('🔒 CSP:', isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION')
