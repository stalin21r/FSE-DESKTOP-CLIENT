import { useEffect, useState } from 'react'

interface UpdateProgress {
  percent: number
  transferred: number
  total: number
  message?: string
}

export default function UpdateOverlay() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [progress, setProgress] = useState<UpdateProgress | null>(null)

  useEffect(() => {
    // Escuchar eventos de actualización
    const handleUpdateLock = (_event: any, locked: boolean) => {
      setIsUpdating(locked)
    }

    const handleDownloadProgress = (_event: any, progressData: UpdateProgress) => {
      setProgress(progressData)
    }

    // @ts-ignore
    window.electron.ipcRenderer.on('update-lock', handleUpdateLock)
    // @ts-ignore
    window.electron.ipcRenderer.on('download-progress', handleDownloadProgress)

    return () => {
      // @ts-ignore
      window.electron.ipcRenderer.removeListener('update-lock', handleUpdateLock)
      // @ts-ignore
      window.electron.ipcRenderer.removeListener('download-progress', handleDownloadProgress)
    }
  }, [])

  if (!isUpdating) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          {/* Icono animado */}
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 flex items-center justify-center animate-pulse">
              <svg className="w-10 h-10 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          </div>

          {/* Título */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">🔒 Actualización Obligatoria</h2>

          {/* Mensaje */}
          <p className="text-gray-600 mb-6">Por favor, no cierre la aplicación</p>

          {/* Barra de progreso */}
          {progress && (
            <div className="space-y-3">
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-300 ease-out"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>

              <div className="text-sm text-gray-600">
                <p className="font-semibold">{Math.round(progress.percent)}% completado</p>
                <p>
                  {progress.transferred}MB / {progress.total}MB
                </p>
              </div>
            </div>
          )}

          {/* Nota */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              ⚠️ Esta actualización es necesaria para continuar usando la aplicación
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
