import { apiFetch, CLAVE_ACCESS_TOKEN } from './api'
import { leer } from '../utils/storage'

export const obtenerOrdenes = () => apiFetch('/ordenes')
export const obtenerOrdenPorId = (id) => apiFetch(`/ordenes/${id}`)

export const obtenerOrdenesDeUsuario = (usuarioId) => apiFetch(`/ordenes/usuario/${usuarioId}`)
export const actualizarEstadoOrden = (id, estado) =>
    apiFetch(`/ordenes/${id}/estado`, { method: 'PATCH', body: { estado } })

async function asegurarSesion() {
    if (!leer(CLAVE_ACCESS_TOKEN)) return
    try {
        await apiFetch('/auth/me')
    } catch {
    }
}

// datos: { cliente, entrega, items: [{ productoId, cantidad, talla, color }] }
// Precio, usuario y estado los decide el servidor.
export async function crearOrden(datos) {
    await asegurarSesion()
    return apiFetch('/ordenes', { method: 'POST', body: datos })
}