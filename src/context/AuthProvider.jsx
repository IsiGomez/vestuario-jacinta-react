import { useCallback, useMemo, useState } from 'react'
import { AuthContext } from './AuthContext'
import { autenticar, obtenerUsuarioPorId } from '../data/usuarios'
import { leer, guardar } from '../utils/storage'

const CLAVE_SESION = 'jacinta_sesion'

function cargarSesion() {
    const id = leer(CLAVE_SESION, null)
    if (id === null) return null
    
    const usuario = obtenerUsuarioPorId(id)
    if (!usuario) return null
    
    const sinHash = { ...usuario }
    delete sinHash.contrasena
    
    return sinHash
}


export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(cargarSesion)

    const iniciarSesion = useCallback((correo, contrasena) => {
        const encontrado = autenticar(correo, contrasena)
        if (!encontrado) return null

        guardar(CLAVE_SESION, encontrado.id)
        setUsuario(encontrado)

        return encontrado
    }, [])

    const cerrarSesion = useCallback(() => {
        guardar(CLAVE_SESION, null)
        setUsuario(null)
    }, [])

    const refrescarSesion = useCallback(() => setUsuario(cargarSesion()), [])

    const valor = useMemo(
        () => ({
        usuario,
        estaLogueado: usuario !== null,
        esAdmin: usuario?.tipoUsuario === 'Administrador',
        iniciarSesion,
        cerrarSesion,
        refrescarSesion,
        }),
        [usuario, iniciarSesion, cerrarSesion, refrescarSesion],
    )

    return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}