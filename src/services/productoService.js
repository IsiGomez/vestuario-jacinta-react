import { apiFetch } from './api'
import { color, COLORES } from '../utils/catalogo'

const desdeApi = (p) => ({
    ...p,
    colores: p.colores.map((clave) => color(p.genero, p.tipo, COLORES[clave] ?? clave, clave)),
})

const haciaApi = (datos) => ({
    ...datos,
    colores: datos.colores.map((c) => (typeof c === 'string' ? c : c.clave)),
})

const lista = (productos) => productos.map(desdeApi)

export const obtenerProductos = () => apiFetch('/productos').then(lista)

export const obtenerProductosTienda = () => apiFetch('/productos', { autenticado: false }).then(lista)
export const obtenerProductosCriticos = () => apiFetch('/productos/criticos').then(lista)
export const obtenerProductoPorId = (id) => apiFetch(`/productos/${id}`).then(desdeApi)
export const obtenerProductoTienda = (id) => apiFetch(`/productos/${id}`, { autenticado: false }).then(desdeApi)
export const crearProducto = (datos) => apiFetch('/productos', { method: 'POST', body: haciaApi(datos) }).then(desdeApi)
export const actualizarProducto = (id, datos) =>
    apiFetch(`/productos/${id}`, { method: 'PUT', body: haciaApi(datos) }).then(desdeApi)
export const eliminarProducto = (id) => apiFetch(`/productos/${id}`, { method: 'DELETE' })