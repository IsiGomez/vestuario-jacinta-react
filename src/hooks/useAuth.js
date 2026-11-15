import { useCallback, useContext } from 'react'
import { AuthContext } from '../context/authContext'
import { tienePermiso } from '../utils/permisos'

export function useAuth() {
    const contexto = useContext(AuthContext)
    const rol = contexto?.usuario?.tipoUsuario
    const puede = useCallback((permiso) => tienePermiso(rol, permiso), [rol])

    if (contexto === null) throw new Error('useAuth debe usarse dentro de <AuthProvider>')

    return { ...contexto, puede }
}
