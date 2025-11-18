import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function injectCSPPlugin() {
  return {
    name: 'inject-csp',
    transformIndexHtml(html) {
      const isDevelopment = process.env.NODE_ENV === 'development'
      const configFileName = isDevelopment ? 'headers.dev.json' : 'headers.prod.json'
      const configPath = path.join(__dirname, '..', 'config', configFileName)

      try {
        const configContent = fs.readFileSync(configPath, 'utf-8')
        const config = JSON.parse(configContent)
        const cspObject = config['Content-Security-Policy']

        const csp = Object.entries(cspObject)
          .map(([key, values]) => `${key} ${values.join(' ')}`)
          .join('; ')

        const cspMeta = `<meta http-equiv="Content-Security-Policy" content="${csp}">`

        // Insertar después de <head>
        return html.replace('<head>', `<head>\n  ${cspMeta}`)
      } catch (error) {
        console.error('Error inyectando CSP:', error)
        return html
      }
    }
  }
}
