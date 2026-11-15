import { useEffect, useState, useCallback } from 'react'
export function useRecurso(cargar, clave = null) {
    const [datos, setDatos] = useState(null)
    const [error, setError] = useState('')
    const [cargando, setCargando] = useState(true)
    const [revision, setRevision] = useState(0)
    const recargar = useCallback(() => setRevision((r) => r + 1), [])
    useEffect(() => {
        let activo = true
        setCargando(true)
        setError('')
        Promise.resolve().then(() => cargar(clave)).then((valor) => {
            if (activo) setDatos(valor)
        }).catch((e) => {
            if (activo) { setDatos(null); setError(e.message) }
        }).finally(() => { if (activo) setCargando(false) })
        return () => { activo = false }
    }, [cargar, clave, revision])
    return { datos, error, cargando, recargar }
}
