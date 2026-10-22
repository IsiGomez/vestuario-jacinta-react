import { useState } from 'react'
import { actualizarUsuario, obtenerUsuarioPorId } from '../../data/usuarios'
import { useAuth } from '../../hooks/useAuth'
import Campo from '../../components/Campo'
import RegionComunaSelect from '../../components/RegionComunaSelect'
import { formatearRun } from '../../utils/formato'
import {
    validarNombre,
    validarApellidos,
    validarCorreo,
    validarContrasena,
    validarFechaNacimiento,
    validarDireccion,
    validarRequerido,
} from '../../utils/validaciones'


const perfilAFormulario = (u) => ({
    nombre: u.nombre,
    apellidos: u.apellidos,
    correo: u.correo,
    contrasena: '',
    fechaNacimiento: u.fechaNacimiento ?? '',
    region: u.region,
    comuna: u.comuna,
    direccion: u.direccion,
})

function validar(datos) {
    const errores = {
        nombre: validarNombre(datos.nombre),
        apellidos: validarApellidos(datos.apellidos),
        correo: validarCorreo(datos.correo),
        contrasena: datos.contrasena ? validarContrasena(datos.contrasena) : null,
        fechaNacimiento: validarFechaNacimiento(datos.fechaNacimiento),
        region: validarRequerido(datos.region, 'La región'),
        comuna: validarRequerido(datos.comuna, 'La comuna'),
        direccion: validarDireccion(datos.direccion),
    }

    return Object.fromEntries(Object.entries(errores).filter(([, mensaje]) => mensaje))
}


function Perfil() {
    const { usuario: sesion, refrescarSesion } = useAuth()

    const [datos, setDatos] = useState(() => perfilAFormulario(obtenerUsuarioPorId(sesion.id)))
    const [errores, setErrores] = useState({})
    const [errorGuardado, setErrorGuardado] = useState('')
    const [guardado, setGuardado] = useState(false)

    const cambiar = (e) => {
        const { name, value } = e.target

        setDatos((anterior) => ({ ...anterior, [name]: value }))
        setErrores((anterior) => ({ ...anterior, [name]: undefined }))
        setGuardado(false)
    }

    const cambiarUbicacion = ({ region, comuna }) => {
        setDatos((anterior) => ({ ...anterior, region, comuna }))
        setErrores((anterior) => ({ ...anterior, region: undefined, comuna: undefined }))
        setGuardado(false)
    }

    const enviar = (e) => {
        e.preventDefault()

        const erroresEncontrados = validar(datos)
        setErrores(erroresEncontrados)

        if (Object.keys(erroresEncontrados).length > 0) return

        const campos = {
            nombre: datos.nombre.trim(),
            apellidos: datos.apellidos.trim(),
            correo: datos.correo.trim(),
            fechaNacimiento: datos.fechaNacimiento,
            region: datos.region,
            comuna: datos.comuna,
            direccion: datos.direccion.trim(),
        }

        if (datos.contrasena) campos.contrasena = datos.contrasena

        try {
            actualizarUsuario(sesion.id, campos)

            refrescarSesion()
            setDatos((anterior) => ({ ...anterior, contrasena: '' }))
            setErrorGuardado('')
            setGuardado(true)
        } catch (err) {
            setGuardado(false)
            setErrorGuardado(err.message)
        }
    }

    return (
        <div style={{ maxWidth: '720px' }}>
            <h1 className="h3 mb-1">Perfil</h1>
            <p className="text-muted mb-4">Administra tu información personal y la de tu cuenta.</p>

            {guardado && <div className="alert alert-success">Tus datos se guardaron correctamente.</div>}
            {errorGuardado && <div className="alert alert-danger">{errorGuardado}</div>}

            <form onSubmit={enviar} noValidate>
                <div className="row">
                    <div className="col-md-6">
                        <Campo 
                            etiqueta="RUN" 
                            nombre="run" 
                            valor={formatearRun(sesion.run)} 
                            disabled 
                        />
                    </div>
                    <div className="col-md-6">
                        <Campo 
                            etiqueta="Tipo de usuario" 
                            nombre="tipoUsuario" 
                            valor={sesion.tipoUsuario} 
                            disabled 
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <Campo 
                            etiqueta="Nombre" 
                            nombre="nombre" 
                            valor={datos.nombre} 
                            error={errores.nombre} 
                            onChange={cambiar} 
                        />
                    </div>
                    <div className="col-md-6">
                        <Campo 
                            etiqueta="Apellidos" 
                            nombre="apellidos" 
                            valor={datos.apellidos} 
                            error={errores.apellidos} 
                            onChange={cambiar} 
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <Campo 
                            etiqueta="Correo" 
                            nombre="correo" 
                            type="email" 
                            valor={datos.correo} 
                            error={errores.correo} 
                            onChange={cambiar} 
                        />
                    </div>
                    <div className="col-md-6">
                        <Campo
                            etiqueta="Nueva contraseña (déjala vacía para no cambiarla)"
                            nombre="contrasena" 
                            type="password" 
                            valor={datos.contrasena}
                            error={errores.contrasena} 
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
                />

                <button type="submit" className="btn btn-primary">Guardar cambios</button>
            </form>
        </div>
    )
}

export default Perfil