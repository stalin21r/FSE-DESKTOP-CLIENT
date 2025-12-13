import { useAuth } from '@renderer/hooks/useAuth'
import {
  socioService,
  cargoService,
  provinciaService,
  regionService,
  imageService
} from '@renderer/services'
import { ROUTES } from '@renderer/utils/constants'
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { LoadingOverlay, TitlePage } from '@renderer/components/common'
import type { CreateSocio, Region, Provincia, Cargo, Autoidentificacion } from '@renderer/types'
import { LuUserPlus } from 'react-icons/lu'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { FaArrowLeft } from 'react-icons/fa'
import { autoidentificacionService } from '@renderer/services/autoidentificacion.service'

export default function NewSocio() {
  const { userInfo } = useAuth()
  const navigate = useNavigate()
  const MySwal = withReactContent(Swal)
  const [loading, setLoading] = useState(false)
  const [cargos, setCargos] = useState<Cargo[]>([])
  const [provincias, setProvincias] = useState<Provincia[]>([])
  const [regiones, setRegiones] = useState<Region[]>([])
  const [autoidentificaciones, setAutoidentificaciones] = useState<Autoidentificacion[]>([])
  const [emailError, setEmailError] = useState<string>('')
  const [imagesPreview, setImagesPreview] = useState<{ foto: string; firma: string }>({
    foto: '',
    firma: ''
  })
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
    registradoPor: 0,
    autoidentificacionfk: 0,
    email: ''
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

  const fetchAutoidentificaciones = () => {
    autoidentificacionService
      .getAll()
      .then(response => {
        setAutoidentificaciones(response.data)
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
    fetchAutoidentificaciones()
    setLoading(false)
  }, [])

  const handleSelectImage = async (e: React.MouseEvent, type: 'foto' | 'firma') => {
    e?.preventDefault()
    const result = await imageService.getImage()
    if (result) {
      if (type === 'foto') {
        setImagesPreview({ ...imagesPreview, foto: result })
      } else {
        setImagesPreview({ ...imagesPreview, firma: result })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const confirmacion = await MySwal.fire({
        title: '¿Está seguro de guardar este socio?',
        text: 'No olvide verificar los datos antes de guardar',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, guardar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#FBD130',
        cancelButtonColor: '#E44F38'
      })
      if (!confirmacion.isConfirmed) {
        return
      }
      if (!verificarCampos()) {
        await MySwal.fire({
          title: 'Por favor, complete los campos obligatorios *',
          icon: 'error',
          color: '#E44F38',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#FBD130'
        })
        return
      }
      let saveImageResult
      saveImageResult = await imageService.saveImages({
        base64: imagesPreview.foto,
        pnombre: socio.pnombre,
        papellido: socio.papellido,
        cedula: socio.cedula,
        tipo: 'foto'
      })
      if (!saveImageResult.success) {
        await MySwal.fire({
          title: 'Error al guardar la foto',
          icon: 'error',
          color: '#E44F38',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#FBD130'
        })
        return
      }
      saveImageResult = await imageService.saveImages({
        base64: imagesPreview.firma,
        pnombre: socio.pnombre,
        papellido: socio.papellido,
        cedula: socio.cedula,
        tipo: 'firma'
      })
      if (!saveImageResult.success) {
        await MySwal.fire({
          title: 'Error al guardar la firma',
          icon: 'error',
          color: '#E44F38',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#FBD130'
        })
        return
      }

      socio.rutafoto =
        `FSEIMAGES/${socio.papellido}_${socio.pnombre}_${socio.cedula}/${socio.papellido}_${socio.pnombre}_${socio.cedula}_FOTO.png`.toUpperCase()
      socio.rutafirma =
        `FSEIMAGES/${socio.papellido}_${socio.pnombre}_${socio.cedula}/${socio.papellido}_${socio.pnombre}_${socio.cedula}_FIRMA.png`.toUpperCase()
      socio.registradoPor = userInfo?.userId || 0
      const newSocio = socio
      console.log(newSocio)
      setLoading(true)
      const result = await socioService.create(newSocio)
      setLoading(false)
      if (result.status === 201) {
        toast.success('Socio registrado con exito')
        navigate(ROUTES.ADMIN_SOCIOS)
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const verificarCampos = (): boolean => {
    if (
      socio.pnombre === '' ||
      socio.cedula === '' ||
      socio.papellido === '' ||
      socio.ptelefono === '' ||
      socio.cargoid === 0 ||
      socio.provinciaid === 0 ||
      socio.regionid === 0 ||
      imagesPreview.foto === '' ||
      imagesPreview.firma === '' ||
      socio.autoidentificacionfk === 0
    ) {
      return false
    }

    if (socio.regionid > 2 && socio.sector === '') {
      return false
    }
    return true
  }

  return (
    <div className="h-full w-full flex flex-col justify-start pt-8 px-4">
      {loading && <LoadingOverlay />}
      <section className="flex w-full gap-3">
        <LuUserPlus className="text-6xl text-blue-500 font-bold" />
        <TitlePage title="Nuevo miembro" />
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
            <div className="grid grid-cols-4 grid-rows-7 gap-4 text-blue-600 text-sm">
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
                <label htmlFor="email" className="block mb-1 font-semibold">
                  Correo:
                </label>
                <input
                  type="email"
                  id="email"
                  value={socio.email}
                  onChange={e => {
                    const value = e.target.value
                    setSocio({ ...socio, email: value })
                    if (value && !/^\S+@\S+\.\S+$/.test(value)) {
                      setEmailError('Correo electrónico no válido')
                    } else {
                      setEmailError('')
                    }
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:shadow-md focus:shadow-red-600/40 text-black text-xs"
                />
                {emailError && <p className="text-red-600 text-[0.55rem] mt-1">{emailError}</p>}
              </div>
              <div className="col-start-2 row-start-4">
                <label htmlFor="cedula" className="block mb-1 font-semibold">
                  Cédula<span className="text-red-600">*</span>:
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
              <div className="col-start-1 row-start-5">
                <label htmlFor="autoidentificacionfk" className="block mb-1 font-semibold">
                  Definición<span className="text-red-600">*</span>:
                </label>
                <select
                  id="autoidentificacionfk"
                  value={socio.autoidentificacionfk}
                  onChange={e =>
                    setSocio({ ...socio, autoidentificacionfk: Number(e.target.value) })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:shadow-md focus:shadow-red-600/40 text-black text-xs"
                >
                  <option value={0} disabled>
                    Seleccionar
                  </option>
                  {autoidentificaciones.map(identificacion => (
                    <option key={identificacion.id} value={identificacion.id}>
                      {identificacion.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-start-2 row-start-5">
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
              <div className="col-start-1 row-start-6">
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
              <div className="col-start-2 row-start-6">
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
              <div className="col-start-1 row-start-7">
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
                <label htmlFor="foto" className="block mb-1 font-semibold">
                  Foto<span className="text-red-600">*</span>:
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
                  Firma<span className="text-red-600">*</span>:
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
              <p className="col-span-2 col-start-3 row-start-5 text-red-600 text-xs font-bold animate-pulse">
                * Ingrese los campos requeridos
              </p>
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
