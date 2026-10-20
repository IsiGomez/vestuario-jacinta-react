import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

export function PruebaAuth() {
    const { usuario, estaLogueado, esAdmin, iniciarSesion, cerrarSesion, refrescarSesion } = useAuth()
    
    const [correo, setCorreo] = useState('admin@duoc.cl')
    const [contrasena, setContrasena] = useState('')
    const [error, setError] = useState('')

    const handleLogin = (e) => {
        e.preventDefault()
        setError('')
        const resultado = iniciarSesion(correo, contrasena)
        
        if (!resultado) {
            setError('Credenciales incorrectas o correo no válido.')
        } else {
            setContrasena('')
        }
    }

    return (
        <div className="container mt-5" style={{ maxWidth: '600px' }}>
            <div className="card shadow p-4">
                <h2 className="mb-4 text-center">Panel de Pruebas de Autenticación</h2>

                <div className="alert alert-secondary">
                    <p className="mb-1"><strong>¿Está logueado?:</strong> {estaLogueado ? 'Sí' : 'No'}</p>
                    <p className="mb-1"><strong>¿Es Admin?:</strong> {esAdmin ? 'Sí' : 'No'}</p>
                    <p className="mb-0"><strong>Usuario actual:</strong> {usuario ? JSON.stringify(usuario, null, 2) : 'Ninguno'}</p>
                </div>

                {!estaLogueado ? (
                    <form onSubmit={handleLogin}>
                        <h4 className="mb-3">Iniciar Sesión</h4>
                        
                        {error && <div className="alert alert-danger">{error}</div>}

                        <div className="mb-3">
                            <label className="form-label">Correo:</label>
                            <input
                                type="email"
                                className="form-control"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Contraseña:</label>
                            <input
                                type="password"
                                className="form-control"
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100">
                            Iniciar Sesión
                        </button>
                    </form>
                ) : (
                    <div>
                        <div className="alert alert-success">
                            ¡Bienvenido, <strong>{usuario?.nombre || usuario?.correo}</strong>!
                        </div>

                        <div className="d-grid gap-2">
                            <button className="btn btn-warning" onClick={refrescarSesion}>
                                Refrescar Sesión
                            </button>
                            <button className="btn btn-danger" onClick={cerrarSesion}>
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PruebaAuth