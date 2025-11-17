import path, { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { headers } from './config/load-headers.js'
import { injectCSPPlugin } from './scripts/inject-csp-plugin.js'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@': path.resolve(__dirname, './src/renderer/src')
      }
    },
    plugins: [react(), tailwindcss(), injectCSPPlugin()],
    server: {
      headers
    }
  }
})
