import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      selectImage: () => Promise<string | null>
      saveImage: (data: {
        base64: string
        pnombre: string
        papellido: string
        cedula: string
        tipo: string
      }) => Promise<{ success: boolean; path: string }>
    }
  }
}
