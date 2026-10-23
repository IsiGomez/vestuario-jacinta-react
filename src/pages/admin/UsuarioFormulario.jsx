import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { crearUsuario, actualizarUsuario, obtenerUsuarioPorId, TIPOS_USUARIO } from '../../data/usuarios'
import { useAuth } from '../../hooks/useAuth'
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
    fechaNacimiento: '',
    tipoUsuario: 'Cliente',
    region: '',
    comuna: '',
    direccion: '',
}

const usuarioAFormulario = (u) => ({
    run: u.run,
    nombre: u.nombre,
    apellidos: u.apellidos,
    correo: u.correo,
    contrasena: '',
    fechaNacimiento: u.fechaNacimiento ?? '',
    tipoUsuario: u.tipoUsuario,
    region: u.region,
    comuna: u.comuna,
    direccion: u.direccion,
})

function validar(datos, esEdicion) {
    const errores = {
        run: validarRun(datos.run),
        nombre: validarNombre(datos.nombre),
        apellidos: validarApellidos(datos.apellidos),
        correo: validarCorreo(datos.correo),
        contrasena: esEdicion && !datos.contrasena ? null : validarContrasena(datos.contrasena),
        fechaNacimiento: validarFechaNacimiento(datos.fechaNacimiento),
        region: validarRequerido(datos.region, 'La región'),
        comuna: validarRequerido(datos.comuna, 'La comuna'),
        direccion: validarDireccion(datos.direccion),
    }

    return Object.fromEntries(Object.entries(errores).filter(([, mensaje]) => mensaje))
}

function UsuarioFormulario() {
    const navegar = useNavigate()
    const { usuario: sesion, refrescarSesion } = useAuth()

    const { id } = useParams()
    const esEdicion = id !== undefined
    const usuario = esEdicion ? obtenerUsuarioPorId(id) : null

    const [datos, setDatos] = useState(() => (usuario ? usuarioAFormulario(usuario) : VALORES_INICIALES))
    const [errores, setErrores] = useState({})
    const [errorGuardado, setErrorGuardado] = useState('')

    if (esEdicion && !usuario) {
        return (
            <div>
                <div className="alert alert-warning">No existe un usuario con id {id}.</div>
                <Link to="/admin/usuarios" className="btn btn-outline-secondary">Volver al listado</Link>
            </div>
        )
    }

    const editandoseASiMismo = esEdicion && Number(id) === sesion.id

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

        const erroresEncontrados = validar(datos, esEdicion)
        setErrores(erroresEncontrados)

        if (Object.keys(erroresEncontrados).length > 0) return

        const campos = {
            run: normalizarRun(datos.run),
            nombre: datos.nombre.trim(),
            apellidos: datos.apellidos.trim(),
            correo: datos.correo.trim(),
            fechaNacimiento: datos.fechaNacimiento,
            tipoUsuario: datos.tipoUsuario,
            region: datos.region,
            comuna: datos.comuna,
            direccion: datos.direccion.trim(),
        }

        // Solo se envía si escribieron algo; si no, se conserva la actual
        if (datos.contrasena) campos.contrasena = datos.contrasena

        try {
            if (esEdicion) {
                actualizarUsuario(id, campos)
                if (editandoseASiMismo) refrescarSesion()
            } else {
                crearUsuario(campos)
            }
            navegar('/admin/usuarios')
        } catch (err) {
            setErrorGuardado(err.message)
        }
    }

    return (
        <div className="pagina" style={{ maxWidth: '720px' }}>
            <h1 className="h3 mb-3">{esEdicion ? 'Editar usuario' : 'Nuevo usuario'}</h1>

            {errorGuardado && <div className="alert alert-danger">{errorGuardado}</div>}

            <form onSubmit={enviar} noValidate className="card form-card p-4">
                <div className="row">
                    <div className="col-md-6">
                        <Campo 
                            etiqueta="RUN" 
                            nombre="run" 
                            valor={datos.run} 
                            error={errores.run} 
                            onChange={cambiar}
                            placeholder="Ej: 19.011.022-2 o 190110222" 
                            maxLength={12} 
                        />
                    </div>

                    <div className="col-md-6">
                        <Campo 
                            etiqueta="Tipo de usuario" 
                            nombre="tipoUsuario" 
                            as="select" 
                            valor={datos.tipoUsuario}
                            onChange={cambiar} 
                            disabled={editandoseASiMismo}>

                            {TIPOS_USUARIO.map((tipo) => (
                                <option key={tipo} value={tipo}>{tipo}</option>
                            ))}
                        </Campo>
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
                            etiqueta="Contraseña"
                            ayuda={esEdicion ? 'Déjala vacía para mantener la actual' : undefined}
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

                <Campo etiqueta="Dirección" nombre="direccion" valor={datos.direccion} error={errores.direccion} onChange={cambiar} />

                <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                        {esEdicion ? 'Guardar cambios' : 'Guardar'}
                    </button>
                    <Link to="/admin/usuarios" className="btn btn-outline-secondary">Cancelar</Link>
                </div>
            </form>
        </div>
    )
}

export default UsuarioFormulario