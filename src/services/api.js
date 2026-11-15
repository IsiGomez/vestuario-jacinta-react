import { leer, guardar } from '../utils/storage'

export const CLAVE_ACCESS_TOKEN = 'jacinta_access_token'
export const CLAVE_REFRESH_TOKEN = 'jacinta_refresh_token'
let renovando = null
const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '')

export function guardarAccessToken(token) {
    if (!guardar(CLAVE_ACCESS_TOKEN, token)) {
        throw new Error('No se pudo guardar el token')
    }
}

export class ApiError extends Error {
    constructor(status, datos) {
        super(datos?.mensaje || datos?.detail || `Error HTTP ${status}`)
        this.name = 'ApiError'
        this.status = status
        this.datos = datos
    }
}

async function solicitar(ruta, { body, headers, autenticado = true, ...opciones } = {}) {
    if (!API_URL) throw new Error('Falta configurar VITE_API_URL')

    const cabeceras = new Headers(headers)
    cabeceras.set('Accept', 'application/json')
    const token = leer(CLAVE_ACCESS_TOKEN)
    if (autenticado && typeof token === 'string' && token) {
        cabeceras.set('Authorization', `Bearer ${token}`)
    }

    const esJson = body !== null && typeof body === 'object'
        && !(body instanceof FormData) && !(body instanceof Blob)
        && !(body instanceof URLSearchParams) && !(body instanceof ArrayBuffer)
        && !ArrayBuffer.isView(body)
    if (esJson) {
        body = JSON.stringify(body)
        cabeceras.set('Content-Type', 'application/json')
    }

    const respuesta = await fetch(`${API_URL}/${ruta.replace(/^\/+/, '')}`, {
        ...opciones, headers: cabeceras, body,
    })
    const texto = await respuesta.text()
    let datos = texto || null
    if (texto && respuesta.headers.get('Content-Type')?.includes('json')) {
        datos = JSON.parse(texto)
    }
    if (!respuesta.ok) throw new ApiError(respuesta.status, datos)
    return datos
}

export function guardarTokens(accessToken, refreshToken) {
    guardarAccessToken(accessToken)
    if (!guardar(CLAVE_REFRESH_TOKEN, refreshToken)) {
        guardarAccessToken(null)
        throw new Error('No se pudo guardar la sesión')
    }
}
export function borrarTokens() {
    localStorage.removeItem(CLAVE_ACCESS_TOKEN)
    localStorage.removeItem(CLAVE_REFRESH_TOKEN)
    localStorage.removeItem('jacinta_sesion')
}
function expirar() {
    borrarTokens()
    window.dispatchEvent(new Event('jacinta:sesion-expirada'))
}
async function renovar() {
    if (renovando) return renovando
    const refreshToken = leer(CLAVE_REFRESH_TOKEN)
    if (!refreshToken) throw new ApiError(401, { mensaje: 'Sesión vencida' })
    renovando = solicitar('/auth/refresh', {
        method: 'POST', autenticado: false, body: { refreshToken },
    }).then((datos) => {
        if (leer(CLAVE_REFRESH_TOKEN) !== refreshToken) throw new ApiError(401, { mensaje: 'La sesión cambió' })
        guardarAccessToken(datos.accessToken)
    }).catch((error) => {
        if (error.status === 401 && leer(CLAVE_REFRESH_TOKEN) === refreshToken) expirar()
        throw error
    }).finally(() => { renovando = null })
    return renovando
}
export async function apiFetch(ruta, opciones = {}) {
    const usado = leer(CLAVE_ACCESS_TOKEN)
    try {
        return await solicitar(ruta, opciones)
    } catch (error) {
        if (error.status !== 401 || opciones.autenticado === false || !leer(CLAVE_REFRESH_TOKEN)) throw error
        if (leer(CLAVE_ACCESS_TOKEN) === usado) await renovar()
        try { return await solicitar(ruta, opciones) }
        catch (segundoError) {
            if (segundoError.status === 401) expirar()
            throw segundoError
        }
    }
}
