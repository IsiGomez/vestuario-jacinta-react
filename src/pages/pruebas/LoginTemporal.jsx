import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function LoginTemporal() {
    const { usuario, iniciarSesion } = useAuth()
    const ubicacion = useLocation()
    const [correo, setCorreo] = useState('')
    const [contrasena, setContrasena] = useState('')
    const [error, setError] = useState('')

    // A dónde ir con sesión iniciada
    const destinoPara = (u) => ubicacion.state?.desde ?? (u.tipoUsuario === 'Administrador' ? '/admin' : '/')

    // No mostrar el login
    if (usuario) return <Navigate to={destinoPara(usuario)} replace />

    const enviar = (e) => {
        e.preventDefault()
        if (!iniciarSesion(correo, contrasena)) setError('Correo o contraseña incorrectos')
    }

    return (
        <form className="mx-auto py-4" style={{ maxWidth: '400px' }} onSubmit={enviar}>
            <h1 className="h3 mb-3">Iniciar sesión</h1>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-3">
                <label htmlFor="correo" className="form-label">Correo</label>
                <input id="correo" 
                    className="form-control" type="email" 
                    value={correo} 
                    onChange={(e) => setCorreo(e.target.value)} 
                />
            </div>
            
            <div className="mb-3">
                <label htmlFor="contrasena" className="form-label">Contraseña</label>
                <input id="contrasena" 
                    className="form-control" 
                    type="password" 
                    value={contrasena} 
                    onChange={(e) => setContrasena(e.target.value)} 
                />
            </div>
            
            <button className="btn btn-primary w-100" type="submit">Ingresar</button>
        </form>
    )
}

export default LoginTemporal