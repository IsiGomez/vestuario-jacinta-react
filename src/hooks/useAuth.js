import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

// const { usuario, estaLogueado, esAdmin, iniciarSesion, cerrarSesion, refrescarSesion }
export function useAuth() {
    const contexto = useContext(AuthContext)
    
    if (contexto === null) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
    
    return contexto
}