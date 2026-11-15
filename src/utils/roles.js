export const ROLES = Object.freeze({
    ADMINISTRADOR: 'ADMINISTRADOR',
    VENDEDOR: 'VENDEDOR',
    CLIENTE: 'CLIENTE',
})

export function normalizarRol(rol) {
    const valor = typeof rol === 'string' ? rol.trim().toUpperCase() : ''
    return Object.values(ROLES).includes(valor) ? valor : null
}
