import { ROLES, normalizarRol } from './roles'

const PUBLICOS = ['productos:ver', 'categorias:ver']
const PERFIL = ['perfil:ver', 'perfil:editar', 'ordenes:ver-propias']

export const PERMISOS = Object.freeze({
    [ROLES.ADMINISTRADOR]: Object.freeze([
        ...PUBLICOS, ...PERFIL,
        'productos:crear', 'productos:editar', 'productos:eliminar',
        'categorias:crear', 'categorias:editar', 'categorias:eliminar',
        'usuarios:ver', 'usuarios:crear', 'usuarios:editar', 'usuarios:eliminar',
        'ordenes:ver', 'ordenes:cambiar-estado',
        'reportes:ver', 'reportes:productos', 'productos:criticos',
    ]),
    [ROLES.VENDEDOR]: Object.freeze([
        ...PUBLICOS, ...PERFIL,
        'productos:crear', 'productos:editar',
        'ordenes:ver', 'ordenes:cambiar-estado',
        'reportes:productos', 'productos:criticos',
    ]),
    [ROLES.CLIENTE]: Object.freeze([...PUBLICOS, ...PERFIL]),
})

export function tienePermiso(rol, permiso) {
    if (PUBLICOS.includes(permiso)) return true
    return PERMISOS[normalizarRol(rol)]?.includes(permiso) ?? false
}
