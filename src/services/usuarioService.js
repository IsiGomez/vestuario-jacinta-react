import { apiFetch } from './api'
import { ROLES } from '../utils/roles'
export const TIPOS_USUARIO = Object.values(ROLES)
const preparar = (datos) => ({ ...datos, fechaNacimiento: datos.fechaNacimiento || null })
export const obtenerUsuarios = () => apiFetch('/usuarios')
export const obtenerUsuarioPorId = (id) => apiFetch(`/usuarios/${id}`)
export const crearUsuario = (datos) => apiFetch('/usuarios', { method: 'POST', body: preparar(datos) })
export const actualizarUsuario = (id, datos) => apiFetch(`/usuarios/${id}`, { method: 'PUT', body: preparar(datos) })
export const actualizarPerfil = (datos) => apiFetch('/usuarios/perfil', { method: 'PUT', body: preparar(datos) })
export const eliminarUsuario = (id) => apiFetch(`/usuarios/${id}`, { method: 'DELETE' })
