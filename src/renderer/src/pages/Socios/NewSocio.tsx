import { useAuth } from '@renderer/hooks/useAuth'
import { socioService, cargoService, provinciaService, regionService } from '@renderer/services'
import { ROUTES } from '@renderer/utils/constants'
import { use, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { LoadingOverlay, TitlePage } from '@renderer/components/common'
import type { CreateSocio, Region, Provincia, Cargo } from '@renderer/types'
import { LuUserPlus } from 'react-icons/lu'
import PhoneInput, {
  formatPhoneNumber,
  formatPhoneNumberIntl,
  isValidPhoneNumber
} from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function NewSocio() {
  const { userInfo } = useAuth()
  const navigate = useNavigate()
  const MySwal = withReactContent(Swal)
  const [loading, setLoading] = useState(false)
  const [cargos, setCargos] = useState<Cargo[]>([])
  const [provincias, setProvincias] = useState<Provincia[]>([])
  const [regiones, setRegiones] = useState<Region[]>([])
  const [socio, setSocio] = useState<CreateSocio>({
    pnombre: '',
    cedula: '',
    snombre: '',
    papellido: '',
    sapellido: '',
    ptelefono: '',
    stelefono: '',
    rutafoto: '',
    rutafirma: '',
    cargoid: 0,
    provinciaid: 0,
    regionid: 0,
    sector: '',
    registradoPorid: 0
  })

  const fetchCargos = () => {
    cargoService
      .getAll()
      .then(response => {
        setCargos(response.data)
      })
      .catch(error => {
        toast.error(error.message)
      })
  }

  const fetchProvincias = () => {
    provinciaService
      .getAll()
      .then(response => {
        setProvincias(response.data)
      })
      .catch(error => {
        toast.error(error.message)
      })
  }

  const fetchRegiones = () => {
    regionService
      .getAll()
      .then(response => {
        setRegiones(response.data)
      })
      .catch(error => {
        toast.error(error.message)
      })
  }

  useEffect(() => {
    if (!userInfo) {
      navigate(ROUTES.LOGIN)
    }
    setLoading(true)
    fetchCargos()
    fetchProvincias()
    fetchRegiones()
    setLoading(false)
  }, [])

  return (
    <div className="h-full w-full flex flex-col justify-start pt-8 px-4">
      {loading && <LoadingOverlay />}
      <section className="flex w-full gap-3">
        <LuUserPlus className="text-6xl text-blue-500 font-bold" />
        <TitlePage title="Nuevo socio" />
      </section>
      <section className="w-full ">
        <div className="w-full max-w-[95%] sm:max-w-[90%] md:max-w-xl lg:max-w-xl xl:max-w-xl px-4 py-6 mx-auto bg-white rounded-2xl shadow-md border p-4">
          <form>
            <div className="grid grid-cols-4 grid-rows-6 gap-4 text-blue-600 text-sm">
              <div>
                <label htmlFor="pnombre" className="block mb-1 font-semibold">
                  Primer Nombre<span className="text-red-600">*</span>:
                </label>
                <input
                  type="text"
                  id="pnombre"
                  value={socio.pnombre.toUpperCase()}
                  onChange={e => setSocio({ ...socio, pnombre: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:shadow-md focus:shadow-red-600/40 text-black text-xs"
                />
              </div>
              <div>
                <label htmlFor="snombre" className="block mb-1 font-semibold">
                  Segundo Nombre:
                </label>
                <input
                  type="text"
                  id="snombre"
                  value={socio.snombre?.toUpperCase()}
                  onChange={e => setSocio({ ...socio, snombre: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:shadow-md focus:shadow-red-600/40 text-black text-xs"
                />
              </div>
              <div className="col-start-1 row-start-2">
                <label htmlFor="papellido" className="block mb-1 font-semibold">
                  Primer Apellido<span className="text-red-600">*</span>:
                </label>
                <input
                  type="text"
                  id="papellido"
                  value={socio.papellido.toUpperCase()}
                  onChange={e => setSocio({ ...socio, papellido: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:shadow-md focus:shadow-red-600/40 text-black text-xs"
                />
              </div>
              <div className="col-start-2 row-start-2">
                <label htmlFor="sapellido" className="block mb-1 font-semibold">
                  Segundo Apellido:
                </label>
                <input
                  type="text"
                  id="sapellido"
                  value={socio.sapellido?.toUpperCase()}
                  onChange={e => setSocio({ ...socio, sapellido: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:shadow-md focus:shadow-red-600/40 text-black text-xs"
                />
              </div>
              <div className="col-start-1 row-start-3">
                <label htmlFor="ptelefono" className="block mb-1 font-semibold">
                  Teléfono 1<span className="text-red-600">*</span>:
                </label>
                <PhoneInput
                  id="ptelefono"
                  defaultCountry="EC"
                  placeholder="Teléfono 1"
                  value={socio.ptelefono}
                  onChange={e => setSocio({ ...socio, ptelefono: e?.toString() ?? '' })}
                  error={
                    socio.ptelefono
                      ? isValidPhoneNumber(socio.ptelefono)
                        ? undefined
                        : 'Numero no valido'
                      : 'Teléfono 1 es requerido'
                  }
                  className="text-black text-xs mt-2"
                />
              </div>
              <div className="col-start-2 row-start-3">
                <label htmlFor="stelefono" className="block mb-1 font-semibold">
                  Teléfono 2:
                </label>
                <PhoneInput
                  id="stelefono"
                  defaultCountry="EC"
                  placeholder="Teléfono 2"
                  value={socio.stelefono}
                  onChange={e => setSocio({ ...socio, stelefono: e?.toString() ?? '' })}
                  className="text-black text-xs mt-2"
                />
              </div>
              <div className="col-start-1 row-start-4">
                <label htmlFor="cedula" className="block mb-1 font-semibold">
                  Cédula:
                </label>
                <input
                  type="text"
                  id="cedula"
                  value={socio.cedula}
                  onChange={e => {
                    const value = e.target.value
                    if (/^\d{0,10}$/.test(value)) {
                      setSocio({ ...socio, cedula: value })
                    }
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:shadow-md focus:shadow-red-600/40 text-black text-xs"
                />
              </div>
              <div className="col-start-2 row-start-4">
                <label htmlFor="provinciaid" className="block mb-1 font-semibold">
                  Provincia<span className="text-red-600">*</span>:
                </label>
                <select
                  id="provinciaid"
                  value={socio.provinciaid}
                  onChange={e => setSocio({ ...socio, provinciaid: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:shadow-md focus:shadow-red-600/40 text-black text-xs"
                >
                  <option value={0} disabled>
                    Seleccionar
                  </option>
                  {provincias.map(provincia => (
                    <option key={provincia.id} value={provincia.id}>
                      {provincia.provincia}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-start-1 row-start-5">
                <label htmlFor="regionid" className="block mb-1 font-semibold">
                  Región<span className="text-red-600">*</span>:
                </label>
                <select
                  id="regionid"
                  value={socio.regionid}
                  onChange={e => setSocio({ ...socio, regionid: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:shadow-md focus:shadow-red-600/40 text-black text-xs"
                >
                  <option value={0} disabled>
                    Seleccionar
                  </option>
                  {regiones.map(region => (
                    <option key={region.id} value={region.id}>
                      {region.region}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-start-2 row-start-5">
                <label htmlFor="cargoid" className="block mb-1 font-semibold">
                  Cargo<span className="text-red-600">*</span>:
                </label>
                <select
                  id="cargoid"
                  value={socio.cargoid}
                  onChange={e => setSocio({ ...socio, cargoid: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:shadow-md focus:shadow-red-600/40 text-black text-xs"
                >
                  <option value={0} disabled>
                    Seleccionar
                  </option>
                  {cargos.map(cargo => (
                    <option key={cargo.id} value={cargo.id}>
                      {cargo.cargo}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-start-1 row-start-6">
                {socio.regionid! > 2 && (
                  <>
                    <label htmlFor="sector" className="block mb-1 font-semibold">
                      Sector<span className="text-red-600">*</span>:
                    </label>
                    <input
                      type="text"
                      id="sector"
                      value={socio.sector?.toUpperCase()}
                      onChange={e => setSocio({ ...socio, sector: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:shadow-md focus:shadow-red-600/40 text-black text-xs"
                    />
                  </>
                )}
              </div>
              <div className="row-span-3 col-start-3 row-start-1">13</div>
              <div className="row-span-3 col-start-4 row-start-1">14</div>
              <div className="col-start-3 row-start-4">15</div>
              <div className="col-start-4 row-start-4">16</div>
              <p className="col-span-2 col-start-3 row-start-5 text-red-600 text-xs font-bold animate-pulse">
                * Ingrese los campos requeridos
              </p>
              <div className="col-span-2 col-start-3 row-start-6">17</div>
            </div>
          </form>
        </div>
      </section>
      <h1>Crear socio</h1>
    </div>
  )
}
