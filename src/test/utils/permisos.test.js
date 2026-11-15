import { ROLES, normalizarRol } from '../../utils/roles'
import { tienePermiso } from '../../utils/permisos'

describe('roles y permisos', () => {
    it('acepta los roles actuales y los de la API', () => {
        expect(normalizarRol('Administrador')).toBe(ROLES.ADMINISTRADOR)
        expect(normalizarRol('VENDEDOR')).toBe(ROLES.VENDEDOR)
        expect(normalizarRol('Cliente')).toBe(ROLES.CLIENTE)
        expect(normalizarRol('otro')).toBeNull()
    })

    it('limita al vendedor según la matriz', () => {
        for (const permiso of ['productos:ver', 'productos:crear', 'productos:editar',
            'categorias:ver', 'ordenes:ver', 'ordenes:cambiar-estado',
            'reportes:productos', 'productos:criticos']) {
            expect(tienePermiso(ROLES.VENDEDOR, permiso)).toBe(true)
        }
        for (const permiso of ['productos:eliminar', 'categorias:crear',
            'categorias:editar', 'categorias:eliminar', 'usuarios:ver',
            'usuarios:crear', 'usuarios:editar', 'usuarios:eliminar', 'reportes:ver']) {
            expect(tienePermiso(ROLES.VENDEDOR, permiso)).toBe(false)
        }
    })

    it('permite administración y rechaza acciones desconocidas', () => {
        expect(tienePermiso(ROLES.ADMINISTRADOR, 'usuarios:eliminar')).toBe(true)
        expect(tienePermiso(ROLES.ADMINISTRADOR, 'inventado:editar')).toBe(false)
    })

    it('separa compras propias de la gestión de órdenes', () => {
        expect(tienePermiso(ROLES.CLIENTE, 'ordenes:ver-propias')).toBe(true)
        expect(tienePermiso(ROLES.CLIENTE, 'ordenes:ver')).toBe(false)
        expect(tienePermiso(ROLES.CLIENTE, 'productos:crear')).toBe(false)
        expect(tienePermiso(null, 'perfil:editar')).toBe(false)
        expect(tienePermiso(null, 'productos:ver')).toBe(true)
        expect(tienePermiso(null, 'categorias:ver')).toBe(true)
    })
})
