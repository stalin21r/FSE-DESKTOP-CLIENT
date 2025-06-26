import { LogoCircular } from '@renderer/assets/images'

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="relative w-48 h-48">
        {/* Spinner SVG animado */}
        <svg
          width="48"
          height="48"
          className="absolute inset-0 w-full h-full animate-spin"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <style>
            {`
              .spinner {
                transform-origin: center;
                animation: spinner-rotation 50s linear infinite;
              }
              .spinner circle {
                stroke-linecap: round;
                animation: spinner-dash 2s ease-in-out infinite;
              }
              @keyframes spinner-rotation {
                100% {
                  transform: rotate(360deg);
                }
              }
              @keyframes spinner-dash {
                0% {
                  stroke-dasharray: 0 150;
                  stroke-dashoffset: 0;
                }
                47.5% {
                  stroke-dasharray: 42 150;
                  stroke-dashoffset: -16;
                }
                95%, 100% {
                  stroke-dasharray: 42 150;
                  stroke-dashoffset: -59;
                }
              }
            `}
          </style>
          <g className="spinner">
            <circle cx="12" cy="12" r="9.5" fill="none" stroke="#1E40AF" strokeWidth="1.5"></circle>
          </g>
        </svg>

        {/* Imagen estática en el centro */}
        <img
          src={LogoCircular}
          alt="Cargando"
          className="absolute top-1/2 left-1/2 w-24 h-24 object-contain rounded-full transform -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </div>
  )
}
