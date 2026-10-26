import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Campo from '../../components/Campo'
import { validarRequerido } from '../../utils/validaciones'
import EncabezadoPagina from '../../components/EncabezadoPagina'

const VALORES_INICIALES = { correo: '', contrasena: '' }

function validar(datos) {
    const errores = {
        correo: validarRequerido(datos.correo, 'El correo'),
        contrasena: validarRequerido(datos.contrasena, 'La contraseña'),
    }

    return Object.fromEntries(Object.entries(errores).filter(([, mensaje]) => mensaje))
}


function Login() {
    const { usuario, iniciarSesion } = useAuth()
    const ubicacion = useLocation()

    const [datos, setDatos] = useState(VALORES_INICIALES)
    const [errores, setErrores] = useState({})
    const [errorLogin, setErrorLogin] = useState('')

    const desde = ubicacion.state?.desde
    const destinoPara = (u) => desde ?? (u.tipoUsuario === 'Administrador' ? '/admin' : '/')

    if (usuario) return <Navigate to={destinoPara(usuario)} replace />

    const cambiar = (e) => {
        const { name, value } = e.target

        setDatos((anterior) => ({ ...anterior, [name]: value }))
        setErrores((anterior) => ({ ...anterior, [name]: undefined }))
        setErrorLogin('')
    }

    const enviar = (e) => {
        e.preventDefault()

        const erroresEncontrados = validar(datos)
        setErrores(erroresEncontrados)

        if (Object.keys(erroresEncontrados).length > 0) return

        if (!iniciarSesion(datos.correo, datos.contrasena)) {
            setErrorLogin('Correo o contraseña incorrectos')
        }
    }

    
    return (
        <>
            <EncabezadoPagina titulo="Iniciar sesión" subtitulo="Ingresa para continuar con tu compra" />
        <div className="auth-pagina">
            <div className="auth-tarjeta auth-tarjeta-estrecha mx-auto">

                {errorLogin && <div className="alert alert-danger" role="alert">{errorLogin}</div>}

                <form onSubmit={enviar} noValidate>
                    <Campo
                        etiqueta="Correo"
                        nombre="correo"
                        type="email"
                        valor={datos.correo}
                        error={errores.correo}
                        onChange={cambiar}
                        autoComplete="username"
                        placeholder="ejem.plo@duoc.cl"
                    />

                    <Campo
                        etiqueta="Contraseña"
                        nombre="contrasena"
                        type="password"
                        valor={datos.contrasena}
                        error={errores.contrasena}
                        onChange={cambiar}
                        autoComplete="current-password"
                        placeholder="1234"
                    />

                    <button type="submit" className="btn btn-auth btn-primary w-100 mt-2">Ingresar</button>
                </form>

                <p className="auth-pie">
                    ¿Aún no tienes cuenta?{' '}
                    <Link to="/registro" state={ubicacion.state}>Crear una cuenta</Link>
                </p>
            </div>
        </div>
        </>
    )
}

export default Login