import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// Protege rutas según la sesión.
function RutaProtegida({ roles, children }) {
  const { usuario } = useAuth()
  const ubicacion = useLocation()

  if (!usuario) return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />
  if (roles && !roles.includes(usuario.tipoUsuario)) return <Navigate to="/" replace />
  return children
}

export default RutaProtegida