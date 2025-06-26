import path, { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

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
    plugins: [react(), tailwindcss()],
    server: {
      headers: {
        'Content-Security-Policy': `
          default-src 'self';
          script-src 'self' 'unsafe-inline' 'unsafe-eval';
          style-src 'self' 'unsafe-inline';
          img-src 'self' data: blob:;
          connect-src 'self' http://127.0.0.1:3000 http://localhost:3000 ws://localhost:*;
          font-src 'self';
        `
          .replace(/\s+/g, ' ')
          .trim()
      }
    }
  }
})
