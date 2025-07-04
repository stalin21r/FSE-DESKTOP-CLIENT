import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '@renderer/hooks/useAuth'
import { LoadingOverlay, TitlePage } from '@renderer/components/common'
import { LuUserPlus } from 'react-icons/lu'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import 'react-phone-number-input/style.css'
import { ROUTES } from '@renderer/utils/constants'
import {
  cargoService,
  provinciaService,
  regionService,
  imageService,
  socioService
} from '@renderer/services'
import type { UpdateSocio, Cargo, Provincia, Region } from '@renderer/types'
import { FaArrowLeft } from 'react-icons/fa'

export default function EditSocio() {
  const { userInfo } = useAuth()
  const navigate = useNavigate()
  const { cod } = useParams()
  const MySwal = withReactContent(Swal)

  const [loading, setLoading] = useState(true)
  const [cargos, setCargos] = useState<Cargo[]>([])
  const [provincias, setProvincias] = useState<Provincia[]>([])
  const [regiones, setRegiones] = useState<Region[]>([])
  const [imagesPreview, setImagesPreview] = useState<{ foto: string; firma: string }>({
    foto: '',
    firma: ''
  })

  const [socio, setSocio] = useState<UpdateSocio>({
    codunico: '',
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

  useEffect(() => {
    if (!userInfo) {
      navigate(ROUTES.LOGIN)
      return
    }
    if (!cod) {
      toast.error('Código inválido')
      navigate(ROUTES.ADMIN_SOCIOS)
      return
    }

    const loadData = async () => {
      try {
        setLoading(true)
        const [cargosRes, provinciasRes, regionesRes, socioRes] = await Promise.all([
          cargoService.getAll(),
          provinciaService.getAll(),
          regionService.getAll(),
          socioService.getByCod(cod)
        ])
        setCargos(cargosRes.data)
        setProvincias(provinciasRes.data)
        setRegiones(regionesRes.data)
        console.log(socioRes.data)
        setSocio({
          codunico: socioRes.data.codunico,
          pnombre: socioRes.data.pnombre,
          cedula: socioRes.data.cedula,
          snombre: socioRes.data.snombre || '',
          papellido: socioRes.data.papellido,
          sapellido: socioRes.data.sapellido || '',
          ptelefono: socioRes.data.ptelefono,
          stelefono: socioRes.data.stelefono || '',
          rutafoto: socioRes.data.rutafoto,
          rutafirma: socioRes.data.rutafirma,
          cargoid: socioRes.data.cargoid || 0,
          provinciaid: socioRes.data.provinciaid,
          regionid: socioRes.data.regionid || 0,
          sector: socioRes.data.sector || '',
          impreso: socioRes.data.impreso,
          registradoPorid: socioRes.data.registradoPorid
        })
      } catch (err) {
        toast.error('Error cargando los datos')
        navigate(ROUTES.ADMIN_SOCIOS)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleSelectImage = async (e: React.MouseEvent, tipo: 'foto' | 'firma') => {
    e.preventDefault()
    const result = await imageService.getImage()
    if (result) {
      setImagesPreview(prev => ({ ...prev, [tipo]: result }))
    }
  }

  const verificarCampos = () => {
    if (
      !socio.pnombre ||
      !socio.cedula ||
      !socio.papellido ||
      !socio.ptelefono ||
      !socio.cargoid ||
      !socio.provinciaid ||
      !socio.regionid
    ) {
      return false
    }
    if (socio.regionid > 2 && !socio.sector) {
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const confirmacion = await MySwal.fire({
      title: '¿Está seguro de guardar los cambios?',
      text: 'Verifique los datos antes de continuar',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#FBD130',
      cancelButtonColor: '#E44F38'
    })

    if (!confirmacion.isConfirmed) return

    if (!verificarCampos()) {
      await MySwal.fire({
        title: 'Complete todos los campos obligatorios',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#FBD130'
      })
      return
    }

    try {
      setLoading(true)

      const updates: UpdateSocio = {
        ...socio,
        registradoPorid: userInfo?.userId,
        codunico: socio.codunico
      }
      if (imagesPreview.foto) {
        const fotoRes = await imageService.saveImages({
          base64: imagesPreview.foto,
          pnombre: socio.pnombre || '',
          papellido: socio.papellido || '',
          cedula: socio.cedula || '',
          tipo: 'foto'
        })

        if (!fotoRes.success) throw new Error('Error guardando la foto')
        updates.rutafoto =
          `FSEIMAGES/${socio.papellido}_${socio.pnombre}_${socio.cedula}/${socio.papellido}_${socio.pnombre}_${socio.cedula}_FOTO.png`.toUpperCase()
      }

      if (imagesPreview.firma) {
        const firmaRes = await imageService.saveImages({
          base64: imagesPreview.firma,
          pnombre: socio.pnombre || '',
          papellido: socio.papellido || '',
          cedula: socio.cedula || '',
          tipo: 'firma'
        })

        if (!firmaRes.success) throw new Error('Error guardando la firma')
        updates.rutafirma =
          `FSEIMAGES/${socio.papellido}_${socio.pnombre}_${socio.cedula}/${socio.papellido}_${socio.pnombre}_${socio.cedula}_FIRMA.png`.toUpperCase()
      }

      console.log(updates)
      updates.impreso = false
      const result = await socioService.update(updates)

      if (result.status === 200) {
        toast.success('Socio actualizado correctamente')
        navigate(ROUTES.ADMIN_SOCIOS)
      } else {
        throw new Error('No se pudo actualizar el socio')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full w-full flex flex-col justify-start pt-8 px-4">
      {loading && <LoadingOverlay />}
      <section className="flex w-full gap-3">
        <LuUserPlus className="text-6xl text-yellow-500 font-bold" />
        <TitlePage title="Editar socio" />
      </section>
      <section className="flex w-full items-center justify-end">
        <NavLink
          to={ROUTES.ADMIN_SOCIOS}
          className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl transition duration-300 ease-in-out gap-2"
        >
          <FaArrowLeft />
          Volver
        </NavLink>
      </section>
      <section className="w-full py-4">
        <div className="w-full px-2 sm:px-4 md:px-8 lg:px-24 xl:px-32 2xl:px-80 py-6 mx-auto bg-white rounded-2xl shadow-md border">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-4 grid-rows-6 gap-4 text-blue-600 text-sm">
              <div>
                <label htmlFor="pnombre" className="block mb-1 font-semibold">
                  Primer Nombre<span className="text-red-600">*</span>:
                </label>
                <input
                  type="text"
                  id="pnombre"
                  value={socio.pnombre}
                  onChange={e => setSocio({ ...socio, pnombre: e.target.value.toUpperCase() })}
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
                  value={socio.snombre}
                  onChange={e => setSocio({ ...socio, snombre: e.target.value.toUpperCase() })}
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
                  value={socio.papellido}
                  onChange={e => setSocio({ ...socio, papellido: e.target.value.toUpperCase() })}
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
                  value={socio.sapellido}
                  onChange={e => setSocio({ ...socio, sapellido: e.target.value.toUpperCase() })}
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
                      value={socio.sector}
                      onChange={e => setSocio({ ...socio, sector: e.target.value.toUpperCase() })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:shadow-md focus:shadow-red-600/40 text-black text-xs"
                    />
                  </>
                )}
              </div>

              <div className="row-span-3 col-start-3 row-start-1">
                <div></div>
                <label htmlFor="foto" className="block mb-1 font-semibold">
                  Foto:
                </label>
                <div className="w-full h-48 border rounded-xl shadow-inner bg-gray-100 flex items-center justify-center overflow-hidden">
                  {imagesPreview?.foto ? (
                    <img src={imagesPreview.foto} alt="Foto" className="h-full object-contain" />
                  ) : (
                    <>Foto</>
                  )}
                </div>
              </div>
              <div className="col-start-3 row-start-4">
                <button
                  className="w-full border bg-blue-500 border-gray-300 rounded-md px-3 py-2 hover:outline-none hover:ring-2 hover:ring-red-600/30 hover:shadow-md hover:shadow-red-600/40 hover:bg-yellow-500 hover:text-black transition duration-300 text-white text-xs font-bold cursor-pointer"
                  onClick={e => handleSelectImage(e, 'foto')}
                >
                  seleccionar
                </button>
              </div>
              <div className="row-span-3 col-start-4 row-start-1">
                <label htmlFor="firma" className="block mb-1 font-semibold">
                  Firma:
                </label>
                <div className="w-full h-48 border rounded-xl shadow-inner bg-gray-100 flex items-center justify-center overflow-hidden">
                  {imagesPreview?.firma ? (
                    <img src={imagesPreview.firma} alt="Foto" className="h-full object-contain" />
                  ) : (
                    <>Firma</>
                  )}
                </div>
              </div>
              <div className="col-start-4 row-start-4">
                <button
                  className="w-full border bg-blue-500 border-gray-300 rounded-md px-3 py-2 hover:outline-none hover:ring-2 hover:ring-red-600/30 hover:shadow-md hover:shadow-red-600/40 hover:bg-yellow-500 hover:text-black transition duration-300 text-white text-xs font-bold cursor-pointer"
                  onClick={e => handleSelectImage(e, 'firma')}
                >
                  seleccionar
                </button>
              </div>
              <div className="col-span-2 col-start-3 row-start-5">
                <p className=" text-red-600 text-xs font-bold animate-pulse">
                  * Ingrese los campos requeridos
                </p>
                <p className="text-xs text-red-600">
                  Si no desea cambiar la foto o firma, dejarlas en blanco
                </p>
              </div>

              <div className="col-span-2 col-start-3 row-start-6">
                <button
                  type="submit"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-blue-500 hover:bg-blue-600 hover:text-white transition duration-300 text-white text-xs font-bold cursor-pointer"
                >
                  Guardar
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
