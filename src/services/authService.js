import { apiFetch, guardarTokens } from './api'
export const registrar = (datos) => apiFetch('/auth/registro', { method: 'POST', body: datos, autenticado: false })
export async function login(correo, contrasena) {
    return apiFetch('/auth/login', { method: 'POST', body: { correo, contrasena }, autenticado: false })
}
export const guardarSesion = (datos) => guardarTokens(datos.accessToken, datos.refreshToken)
export const obtenerSesion = () => apiFetch('/auth/me')
