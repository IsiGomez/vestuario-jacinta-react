import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// Protege rutas según la sesión.
function RutaProtegida({ roles, children }) {
  const { usuario, cargando, errorSesion, refrescarSesion } = useAuth()
  const ubicacion = useLocation()

  if (cargando) return <p role="status">Cargando sesión...</p>
  if (errorSesion) return <div role="alert">{errorSesion} <button onClick={() => refrescarSesion().catch(() => {})}>Reintentar</button></div>
  if (!usuario) return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />
  if (roles && !roles.includes(usuario.tipoUsuario)) return <Navigate to="/" replace />
  return children
}

export default RutaProtegida