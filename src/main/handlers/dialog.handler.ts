import { dialog, ipcMain } from 'electron'
import fs from 'fs'

export function registerDialogHandler() {
  ipcMain.handle('select-image', async () => {
    const result = await dialog.showOpenDialog({
      title: 'Selecciona una imagen',
      properties: ['openFile'],
      filters: [{ name: 'Imágenes', extensions: ['jpg', 'jpeg', 'png', 'gif'] }]
    })

    if (result.canceled || result.filePaths.length === 0) {
      return null
    }

    const filePath = result.filePaths[0]
    const fileBuffer = fs.readFileSync(filePath)
    const base64 = fileBuffer.toString('base64')
    const mimeType = getMimeType(filePath)

    return `data:${mimeType};base64,${base64}`
  })
}

function getMimeType(filePath: string) {
  const ext = filePath.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'gif':
      return 'image/gif'
    default:
      return 'application/octet-stream'
  }
}
