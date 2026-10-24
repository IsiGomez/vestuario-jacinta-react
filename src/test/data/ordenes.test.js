import { describe, it, expect, vi, afterEach } from 'vitest'
import {
    ESTADOS_ORDEN,
    totalOrden,
    obtenerOrdenes,
    obtenerOrdenPorId,
    obtenerOrdenesDeUsuario,
    crearOrden,
    actualizarEstadoOrden,
    restablecerOrdenes,
} from '../../data/ordenes'

afterEach(() => {
    vi.useRealTimers()
})

const datosOrden = (extra = {}) => ({
    cliente: { nombre: 'Ana', apellidos: 'Gómez', correo: 'ana@gmail.com' },
    entrega: { calle: 'Calle 1', departamento: '', region: 'Valparaíso', comuna: 'Viña del Mar', indicaciones: '' },
    items: [{ productoId: 1, nombre: 'Camisa', precio: 10000, cantidad: 2 }],
    ...extra,
})


describe('ESTADOS_ORDEN', () => {
    it('define los tres estados posibles de una orden', () => {
        expect(ESTADOS_ORDEN).toEqual(['Pagada', 'Pago fallido', 'Pendiente'])
    })
})


describe('totalOrden', () => {
    it('calcula la suma multiplicando el precio por la cantidad de cada producto', () => {
        expect(totalOrden({ items: [
            { precio: 14990, cantidad: 2 },
            { precio: 17990, cantidad: 1 },
        ] })).toBe(47970)
    })

    it('devuelve 0 si la orden no tiene productos', () => {
        expect(totalOrden({ items: [] })).toBe(0)
    })

    it('calcula bien los totales de las órdenes iniciales', () => {
        expect(totalOrden(obtenerOrdenPorId(1))).toBe(14990 * 2 + 17990)
        expect(totalOrden(obtenerOrdenPorId(3))).toBe(14990 * 3)
    })
})


describe('obtenerOrdenes / obtenerOrdenPorId', () => {
    it('carga las 4 órdenes iniciales', () => {
        expect(obtenerOrdenes()).toHaveLength(4)
    })

    it('las órdenes iniciales tienen un estado válido y un número único', () => {
        const ordenes = obtenerOrdenes()
        for (const o of ordenes) expect(ESTADOS_ORDEN).toContain(o.estado)
        expect(new Set(ordenes.map((o) => o.numero)).size).toBe(ordenes.length)
    })

    it('encuentra la orden por id, ya sea en número o texto', () => {
        expect(obtenerOrdenPorId(2).cliente.nombre).toBe('Pedro')
        expect(obtenerOrdenPorId('2').numero).toBe('2026091502')
    })

    it('devuelve null si la orden no existe', () => {
        expect(obtenerOrdenPorId(99)).toBeNull()
    })
})


describe('obtenerOrdenesDeUsuario', () => {
    it('encuentra las órdenes por correo sin importar si hay mayúsculas', () => {
        const ordenes = obtenerOrdenesDeUsuario({ id: 50, correo: ' CAMILA.Rojas@gmail.com ' })
        expect(ordenes.map((o) => o.id)).toEqual([1, 3])
    })

    it('también busca por el id de usuario aunque el correo sea diferente', () => {
        crearOrden(datosOrden({ usuarioId: 7 }))
        const ordenes = obtenerOrdenesDeUsuario({ id: 7, correo: 'otro@gmail.com' })
        expect(ordenes).toHaveLength(1)
    })

    it('devuelve una lista vacía si no hay coincidencias', () => {
        expect(obtenerOrdenesDeUsuario({ id: 99, correo: 'nadie@gmail.com' })).toEqual([])
    })
})


describe('crearOrden', () => {
    it('asigna un número de orden consecutivo, estado "Pagada" y usuario nulo por defecto', () => {
        const nueva = crearOrden(datosOrden())
        expect(nueva.id).toBe(5)
        expect(nueva.estado).toBe('Pagada')
        expect(nueva.usuarioId).toBeNull()
    })

    it('crea el número de orden usando la fecha actual (AAAAMMDD) más el número de id', () => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2026-10-22T12:00:00Z'))
        expect(crearOrden(datosOrden()).numero).toBe('2026102205')
    })

    it('guarda la fecha en formato estándar', () => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2026-10-22T12:00:00Z'))
        expect(crearOrden(datosOrden()).fecha).toBe('2026-10-22T12:00:00.000Z')
    })

    it('permite indicar un estado y un usuario diferente al crear', () => {
        const nueva = crearOrden(datosOrden({ estado: 'Pendiente', usuarioId: 3 }))
        expect(nueva).toMatchObject({ estado: 'Pendiente', usuarioId: 3 })
    })

    it('guarda la nueva orden correctamente', () => {
        crearOrden(datosOrden())
        expect(obtenerOrdenes()).toHaveLength(5)
    })

    it('impide que datos externos modifiquen el id o número automático', () => {
        const nueva = crearOrden(datosOrden({ id: 99, numero: 'x', fecha: 'y' }))
        expect(nueva.id).toBe(5)
        expect(nueva.numero).not.toBe('x')
        expect(nueva.fecha).not.toBe('y')
    })
})


describe('actualizarEstadoOrden', () => {
    it('cambia el estado de la orden y lo guarda', () => {
        const actualizada = actualizarEstadoOrden(2, 'Pagada')
        expect(actualizada.estado).toBe('Pagada')
        expect(obtenerOrdenPorId(2).estado).toBe('Pagada')
    })

    it('no modifica los demás datos de la orden', () => {
        const antes = obtenerOrdenPorId(2)
        const despues = actualizarEstadoOrden(2, 'Pendiente')
        expect(despues).toEqual({ ...antes, estado: 'Pendiente' })
    })

    it('devuelve null si la orden no existe', () => {
        expect(actualizarEstadoOrden(99, 'Pagada')).toBeNull()
    })
})


describe('restablecerOrdenes', () => {
    it('restaura las órdenes a su estado inicial', () => {
        crearOrden(datosOrden())
        actualizarEstadoOrden(1, 'Pendiente')
        restablecerOrdenes()
        expect(obtenerOrdenes()).toHaveLength(4)
        expect(obtenerOrdenPorId(1).estado).toBe('Pagada')
    })
})