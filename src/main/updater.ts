import { autoUpdater } from 'electron-updater'
import { BrowserWindow, dialog, app } from 'electron'
import log from 'electron-log'

// Configurar logging
autoUpdater.logger = log
log.transports.file.level = 'info'

// Configurar autoUpdater
autoUpdater.autoDownload = true // ✅ Cambiar a true para descarga automática
autoUpdater.autoInstallOnAppQuit = true

export function setupAutoUpdater(mainWindow: BrowserWindow): void {
  // Verificar actualizaciones al iniciar
  autoUpdater.checkForUpdates()

  // Verificar cada 10 minutos
  setInterval(
    () => {
      autoUpdater.checkForUpdates()
    },
    10 * 60 * 1000
  )

  // Cuando se encuentra una actualización
  autoUpdater.on('update-available', info => {
    log.info('Update available:', info)

    dialog
      .showMessageBox(mainWindow, {
        type: 'warning',
        title: '⚠️ Actualización',
        message: `Se ha detectado una nueva versión (${info.version}).\n\nLa actualización es OBLIGATORIA para continuar usando la aplicación.\n\nLa descarga comenzará automáticamente.`,
        buttons: ['Aceptar'],
        defaultId: 0,
        noLink: true
      })
      .then(() => {
        // La descarga ya comenzó automáticamente por autoDownload: true
        log.info('Iniciando descarga obligatoria de actualización')
      })
  })

  // Cuando no hay actualizaciones
  autoUpdater.on('update-not-available', info => {
    log.info('Update not available:', info)
  })

  // Durante la descarga
  autoUpdater.on('download-progress', progressObj => {
    const percent = Math.round(progressObj.percent)
    const transferred = Math.round(progressObj.transferred / 1024 / 1024)
    const total = Math.round(progressObj.total / 1024 / 1024)

    const message = `Descargando actualización: ${percent}% (${transferred}MB / ${total}MB)`
    log.info(message)

    // Actualizar el título de la ventana con el progreso
    mainWindow.setTitle(`Registro FSE - Descargando actualización ${percent}%`)

    // Enviar progreso al renderer si quieres mostrar una barra
    mainWindow.webContents.send('download-progress', {
      percent,
      transferred,
      total
    })
  })

  // Cuando la descarga está completa
  autoUpdater.on('update-downloaded', info => {
    log.info('Update downloaded:', info)

    dialog
      .showMessageBox(mainWindow, {
        type: 'info',
        title: '✅ Actualización Descargada',
        message:
          'La actualización se ha descargado correctamente.\n\nLa aplicación se cerrará y se instalará la nueva versión automáticamente.',
        buttons: ['Instalar Ahora'],
        defaultId: 0,
        noLink: true
      })
      .then(() => {
        // Forzar instalación inmediata
        setImmediate(() => {
          autoUpdater.quitAndInstall(false, true)
        })
      })
  })

  // Errores - CERRAR LA APP SI HAY ERROR
  autoUpdater.on('error', err => {
    log.error('Error en actualización automática:', err)

    dialog
      .showMessageBox(mainWindow, {
        type: 'error',
        title: '❌ Error Crítico',
        message:
          'Hubo un error al descargar la actualización obligatoria.\n\n' +
          'La aplicación se cerrará. Por favor, contacte al administrador del sistema.',
        buttons: ['Cerrar Aplicación'],
        defaultId: 0,
        noLink: true
      })
      .then(() => {
        // Cerrar la aplicación después del error
        log.error('Cerrando aplicación por error en actualización')
        app.quit()
      })
  })
}
