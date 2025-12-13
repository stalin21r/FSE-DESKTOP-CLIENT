import { Logo } from '@renderer/assets/images'
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa'

export default function Home() {
  return (
    <div className="h-full flex flex-col items-center justify-start pt-8 px-4">
      <div className="flex items-start justify-center w-full">
        <img
          src={Logo}
          alt="Logo"
          className="h-24 w-24 rounded-xl border-4 border-gray-300 shadow-lg shadow-gray-400/50"
          style={{
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25), inset 0 0 8px rgba(255, 255, 255, 0.6)'
          }}
        />
      </div>
      <h2 className='text-2xl font-bold text-primaryBlue mt-3'>ORGANIZACIÓN PLURINACIONAL</h2>
      <h1 className="text-4xl font-bold leading-tight mt-2 text-center">
        <span className="text-amber-400">Fuerzas </span>
        <span className="text-blue-600">Sociales </span>
        <span className="text-red-600">Del </span>
        <span className="text-red-600">Ecuador</span>
      </h1>
      <p className="text-lg mt-4 max-w-3xl text-center text-gray-600">
        Este programa está diseñado para facilitar la gestión integral de los miembros de la
        Organización "Fuerzas Sociales del Ecuador". A través de una interfaz intuitiva y eficiente,
        permite crear nuevos miembros, consultar la información detallada de cada miembro, así como
        editar y actualizar sus datos en tiempo real. Con herramientas especializadas para
        administrar el registro y seguimiento de los miembros, la aplicación garantiza un manejo
        organizado y seguro, optimizando los procesos internos de la organización y contribuyendo a
        fortalecer la comunidad y sus objetivos sociales. Ya sea para incorporar nuevos integrantes
        o mantener la información vigente, este sistema se convierte en una solución completa y
        confiable para la administración de la organización.
      </p>

      {/* Footer */}
      <footer className="mt-10 w-full max-w-4xl px-4 py-2 flex flex-col items-center border-t border-gray-300">
        <div className="flex space-x-6 mb-4 text-gray-700">
          <a
            href="https://facebook.com/MARCELOGARCIAFSQ"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:text-blue-600 transition"
          >
            <FaFacebookF size={24} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="hover:text-blue-400 transition"
          >
            <FaTwitter size={24} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-pink-500 transition"
          >
            <FaInstagram size={24} />
          </a>
        </div>
        <div className="text-sm text-gray-600 text-center select-none">
          <p>
            © {new Date().getFullYear()} Fuerzas Sociales del Ecuador. Todos los derechos
            reservados.
          </p>
          <p>Creado por Stalin García</p>
        </div>
      </footer>
    </div>
  )
}
