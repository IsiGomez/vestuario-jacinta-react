import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AuthContext } from './authContext'
import { login, guardarSesion, obtenerSesion } from '../services/authService'
import { borrarTokens, CLAVE_ACCESS_TOKEN, CLAVE_REFRESH_TOKEN } from '../services/api'
import { leer } from '../utils/storage'
import { ROLES } from '../utils/roles'

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [errorSesion, setErrorSesion] = useState('')
    const version = useRef(0)
    const cerrarSesion = useCallback(() => {
        version.current++
        borrarTokens()
        setUsuario(null)
        setCargando(false)
        setErrorSesion('')
    }, [])
    const refrescarSesion = useCallback(async () => {
        const actual = ++version.current
        setErrorSesion('')
        try {
            const datos = await obtenerSesion()
            if (actual === version.current) setUsuario(datos)
            return datos
        } catch (error) {
            if (actual === version.current) {
                if (error.status === 401) cerrarSesion()
                else setErrorSesion(error.message)
            }
            throw error
        } finally {
            if (actual === version.current) setCargando(false)
        }
    }, [cerrarSesion])
    useEffect(() => {
        localStorage.removeItem('jacinta_sesion')
        window.addEventListener('jacinta:sesion-expirada', cerrarSesion)
        if (leer(CLAVE_ACCESS_TOKEN) || leer(CLAVE_REFRESH_TOKEN)) refrescarSesion().catch(() => {})
        else setCargando(false)
        return () => {
            version.current++
            window.removeEventListener('jacinta:sesion-expirada', cerrarSesion)
        }
    }, [refrescarSesion, cerrarSesion])
    const iniciarSesion = useCallback(async (correo, contrasena) => {
        const actual = ++version.current
        const datos = await login(correo, contrasena)
        if (actual !== version.current) return null
        guardarSesion(datos)
        setUsuario(datos.usuario)
        setErrorSesion('')
        setCargando(false)
        return datos.usuario
    }, [])
    const valor = useMemo(() => ({ usuario, cargando, errorSesion,
        estaLogueado: usuario !== null, esAdmin: usuario?.tipoUsuario === ROLES.ADMINISTRADOR,
        esPersonal: [ROLES.ADMINISTRADOR, ROLES.VENDEDOR].includes(usuario?.tipoUsuario),
        iniciarSesion, cerrarSesion, refrescarSesion,
    }), [usuario, cargando, errorSesion, iniciarSesion, cerrarSesion, refrescarSesion])
    return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
