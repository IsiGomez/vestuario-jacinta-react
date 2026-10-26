import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { crearUsuario } from '../../data/usuarios'
import { useAuth } from '../../hooks/useAuth'
import EncabezadoPagina from '../../components/EncabezadoPagina'
import Campo from '../../components/Campo'
import RegionComunaSelect from '../../components/RegionComunaSelect'
import {
    normalizarRun,
    validarRun,
    validarNombre,
    validarApellidos,
    validarCorreo,
    validarContrasena,
    validarFechaNacimiento,
    validarDireccion,
    validarRequerido,
} from '../../utils/validaciones'

const VALORES_INICIALES = {
    run: '',
    nombre: '',
    apellidos: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
    fechaNacimiento: '',
    region: '',
    comuna: '',
    direccion: '',
}


function validar(datos) {
    const errores = {
        run: validarRun(datos.run),
        nombre: validarNombre(datos.nombre),
        apellidos: validarApellidos(datos.apellidos),
        correo: validarCorreo(datos.correo),
        contrasena: validarContrasena(datos.contrasena),
        confirmarContrasena: datos.contrasena !== datos.confirmarContrasena ? 'Las contraseñas no coinciden' : null,
        fechaNacimiento: validarFechaNacimiento(datos.fechaNacimiento),
        region: validarRequerido(datos.region, 'La región'),
        comuna: validarRequerido(datos.comuna, 'La comuna'),
        direccion: validarDireccion(datos.direccion),
    }

    return Object.fromEntries(Object.entries(errores).filter(([, mensaje]) => mensaje))
}


function Registro() {
    const { usuario, iniciarSesion } = useAuth()
    const navegar = useNavigate()
    const ubicacion = useLocation()

    const [datos, setDatos] = useState(VALORES_INICIALES)
    const [errores, setErrores] = useState({})
    const [errorGuardado, setErrorGuardado] = useState('')

    const destino = ubicacion.state?.desde ?? '/'

    if (usuario) return <Navigate to={destino} replace />

    const cambiar = (e) => {
        const { name, value } = e.target

        setDatos((anterior) => ({ ...anterior, [name]: value }))
        setErrores((anterior) => ({ ...anterior, [name]: undefined }))
    }

    const cambiarUbicacion = ({ region, comuna }) => {
        setDatos((anterior) => ({ ...anterior, region, comuna }))
        setErrores((anterior) => ({ ...anterior, region: undefined, comuna: undefined }))
    }

    const enviar = (e) => {
        e.preventDefault()
        setErrorGuardado('')

        const erroresEncontrados = validar(datos)
        setErrores(erroresEncontrados)

        if (Object.keys(erroresEncontrados).length > 0) return

        const campos = {
            run: normalizarRun(datos.run),
            nombre: datos.nombre.trim(),
            apellidos: datos.apellidos.trim(),
            correo: datos.correo.trim(),
            contrasena: datos.contrasena,
            fechaNacimiento: datos.fechaNacimiento,
            tipoUsuario: 'Cliente',
            region: datos.region,
            comuna: datos.comuna,
            direccion: datos.direccion.trim(),
        }

        try {
            crearUsuario(campos)
        } catch (err) {
            setErrorGuardado(err.message)
            return
        }

        if (!iniciarSesion(campos.correo, campos.contrasena)) navegar('/login', { replace: true })
    }


    return (
        <>
            <EncabezadoPagina titulo="Crear cuenta" subtitulo="Regístrate para comprar en Jacinta" />
        <div className="auth-pagina">
            <div className="auth-tarjeta auth-tarjeta-ancha mx-auto">

                {errorGuardado && <div className="alert alert-danger" role="alert">{errorGuardado}</div>}

                <form onSubmit={enviar} noValidate>
                    <Campo
                        etiqueta="RUN"
                        nombre="run"
                        valor={datos.run}
                        error={errores.run}
                        onChange={cambiar}
                        placeholder="Ej: 19.011.022-2 o 190110222"
                        maxLength={12}
                    />

                    <div className="row">
                        <div className="col-md-6">
                            <Campo
                                etiqueta="Nombre"
                                nombre="nombre"
                                valor={datos.nombre}
                                error={errores.nombre}
                                onChange={cambiar}
                                autoComplete="given-name"
                            />
                        </div>
                        <div className="col-md-6">
                            <Campo
                                etiqueta="Apellidos"
                                nombre="apellidos"
                                valor={datos.apellidos}
                                error={errores.apellidos}
                                onChange={cambiar}
                                autoComplete="family-name"
                            />
                        </div>
                    </div>

                    <Campo
                        etiqueta="Correo"
                        nombre="correo"
                        type="email"
                        valor={datos.correo}
                        error={errores.correo}
                        onChange={cambiar}
                        autoComplete="email"
                    />

                    <div className="row">
                        <div className="col-md-6">
                            <Campo
                                etiqueta="Contraseña"
                                ayuda="Entre 4 y 10 caracteres"
                                nombre="contrasena"
                                type="password"
                                valor={datos.contrasena}
                                error={errores.contrasena}
                                onChange={cambiar}
                                autoComplete="new-password"
                            />
                        </div>
                        <div className="col-md-6">
                            <Campo
                                etiqueta="Confirmar contraseña"
                                nombre="confirmarContrasena"
                                type="password"
                                valor={datos.confirmarContrasena}
                                error={errores.confirmarContrasena}
                                onChange={cambiar}
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    <Campo
                        etiqueta="Fecha de nacimiento (opcional)"
                        nombre="fechaNacimiento"
                        type="date"
                        valor={datos.fechaNacimiento}
                        error={errores.fechaNacimiento}
                        onChange={cambiar}
                    />

                    <div className="mb-3">
                        <RegionComunaSelect region={datos.region} comuna={datos.comuna} onChange={cambiarUbicacion} />
                        {(errores.region || errores.comuna) && (
                            <div className="text-danger small mt-1">{errores.region || errores.comuna}</div>
                        )}
                    </div>

                    <Campo
                        etiqueta="Dirección"
                        nombre="direccion"
                        valor={datos.direccion}
                        error={errores.direccion}
                        onChange={cambiar}
                        autoComplete="street-address"
                    />

                    <button type="submit" className="btn btn-auth btn-primary w-100 mt-2">Crear cuenta</button>
                </form>

                <p className="auth-pie">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" state={ubicacion.state}>Inicia sesión</Link>
                </p>
            </div>
        </div>
        </>
    )
}

export default Registro