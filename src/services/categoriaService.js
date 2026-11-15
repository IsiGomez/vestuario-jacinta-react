import { apiFetch } from './api'
export const obtenerCategorias = () => apiFetch('/categorias')
export const obtenerCategoriaPorId = (id) => apiFetch(`/categorias/${id}`)
export const crearCategoria = (datos) => apiFetch('/categorias', { method: 'POST', body: datos })
export const actualizarCategoria = (id, datos) => apiFetch(`/categorias/${id}`, { method: 'PUT', body: datos })
export const eliminarCategoria = (id) => apiFetch(`/categorias/${id}`, { method: 'DELETE' })
