import { ipcMain } from 'electron'
import { mkdirSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

export function registerSaveImageHandler() {
  ipcMain.handle(
    'save-image',
    async (
      _event,
      data: {
        base64: string
        pnombre: string
        papellido: string
        cedula: string
        tipo: string
      }
    ) => {
      const { base64, pnombre, papellido, cedula, tipo } = data

      const folderName = `${papellido}_${pnombre}_${cedula}`.toUpperCase()
      const desktopPath = join(homedir(), 'Desktop')
      const targetFolder = join(desktopPath, 'FSEIMAGES', folderName)

      // Crear carpetas si no existen
      if (!existsSync(targetFolder)) {
        mkdirSync(targetFolder, { recursive: true })
      }

      const fileName = `${folderName}_${tipo}.png`.toUpperCase()
      const filePath = join(targetFolder, fileName)

      // Quitar encabezado del base64
      const base64Data = base64.replace(/^data:image\/\w+;base64,/, '')
      const buffer = Buffer.from(base64Data, 'base64')

      writeFileSync(filePath, buffer)

      return { success: true, path: filePath }
    }
  )
}
