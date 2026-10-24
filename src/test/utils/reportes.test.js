import { describe, it, expect, vi, afterEach } from 'vitest'
import {
    resumenInventario,
    inventarioPorCategoria,
    resumenVentas,
    productosMasVendidos,
    ordenesPorEstado,
    ventasPorMes,
} from '../../utils/reportes'

afterEach(() => {
    vi.useRealTimers()
})

const producto = (extra) => ({ id: 1, categoriaId: 1, precio: 1000, stock: 10, stockCritico: 3, ...extra })
const item = (productoId, nombre, precio, cantidad) => ({ productoId, nombre, precio, cantidad })
const orden = (id, estado, items, fecha = '2026-10-01T10:00:00') => ({ id, estado, items, fecha })


describe('resumenInventario', () => {
    it('devuelve ceros con una lista vacía', () => {
        expect(resumenInventario([])).toEqual({ totalProductos: 0, unidades: 0, valorInventario: 0, criticos: 0 })
    })

    it('suma unidades, valor (precio × stock) y cuenta los críticos', () => {
        const productos = [
            producto({ id: 1, precio: 1000, stock: 10, stockCritico: 3 }),
            producto({ id: 2, precio: 2000, stock: 3, stockCritico: 3 }), // borde: crítico
            producto({ id: 3, precio: 500, stock: 0, stockCritico: 2 }), // agotado: crítico
        ]
        expect(resumenInventario(productos)).toEqual({
            totalProductos: 3,
            unidades: 13,
            valorInventario: 10000 + 6000 + 0,
            criticos: 2,
        })
    })
})


describe('inventarioPorCategoria', () => {
    const categorias = [{ id: 1, nombre: 'Camisas' }, { id: 2, nombre: 'Poleras' }]

    it('agrupa por nombre de categoría acumulando productos, unidades y valor', () => {
        const productos = [
            producto({ id: 1, categoriaId: 1, precio: 1000, stock: 2 }),
            producto({ id: 2, categoriaId: 1, precio: 500, stock: 4 }),
            producto({ id: 3, categoriaId: 2, precio: 100, stock: 1 }),
        ]
        const resultado = inventarioPorCategoria(productos, categorias)
        expect(resultado).toContainEqual({ categoria: 'Camisas', productos: 2, unidades: 6, valor: 4000 })
        expect(resultado).toContainEqual({ categoria: 'Poleras', productos: 1, unidades: 1, valor: 100 })
    })

    it('ordena de mayor a menor valor', () => {
        const productos = [
            producto({ id: 1, categoriaId: 2, precio: 100, stock: 1 }),
            producto({ id: 2, categoriaId: 1, precio: 1000, stock: 5 }),
        ]
        expect(inventarioPorCategoria(productos, categorias).map((f) => f.categoria)).toEqual(['Camisas', 'Poleras'])
    })

    it('usa "Sin categoría" cuando el id no existe', () => {
        const resultado = inventarioPorCategoria([producto({ categoriaId: 99 })], categorias)
        expect(resultado[0].categoria).toBe('Sin categoría')
    })

    it('devuelve [] sin productos', () => {
        expect(inventarioPorCategoria([], categorias)).toEqual([])
    })
})


describe('resumenVentas', () => {
    it('devuelve ceros sin órdenes (ticket promedio 0, sin dividir por cero)', () => {
        expect(resumenVentas([])).toEqual({ pagadas: 0, fallidas: 0, pendientes: 0, montoTotal: 0, ticketPromedio: 0 })
    })

    it('solo suma el monto de las órdenes pagadas y cuenta cada estado', () => {
        const ordenes = [
            orden(1, 'Pagada', [item(1, 'A', 1000, 2)]),   // 2000
            orden(2, 'Pagada', [item(1, 'A', 1000, 1)]),   // 1000
            orden(3, 'Pago fallido', [item(1, 'A', 9999, 1)]),
            orden(4, 'Pendiente', [item(1, 'A', 9999, 1)]),
        ]
        expect(resumenVentas(ordenes)).toEqual({
            pagadas: 2, fallidas: 1, pendientes: 1, montoTotal: 3000, ticketPromedio: 1500,
        })
    })

    it('redondea el ticket promedio', () => {
        const ordenes = [
            orden(1, 'Pagada', [item(1, 'A', 100, 1)]),
            orden(2, 'Pagada', [item(1, 'A', 100, 1)]),
            orden(3, 'Pagada', [item(1, 'A', 101, 1)]),
        ]
        expect(resumenVentas(ordenes).ticketPromedio).toBe(100) // 301 / 3 = 100.33
    })
})


describe('productosMasVendidos', () => {
    const ordenes = [
        orden(1, 'Pagada', [item(1, 'Camisa', 1000, 2), item(2, 'Polerón', 3000, 1)]),
        orden(2, 'Pagada', [item(1, 'Camisa', 1000, 3)]),
        orden(3, 'Pago fallido', [item(2, 'Polerón', 3000, 50)]),
    ]

    it('acumula unidades y monto por producto, ordenados por unidades', () => {
        expect(productosMasVendidos(ordenes)).toEqual([
            { productoId: 1, nombre: 'Camisa', unidades: 5, monto: 5000 },
            { productoId: 2, nombre: 'Polerón', unidades: 1, monto: 3000 },
        ])
    })

    it('ignora las órdenes no pagadas', () => {
        const resultado = productosMasVendidos(ordenes)
        expect(resultado.find((p) => p.productoId === 2).unidades).toBe(1)
    })

    it('respeta el límite', () => {
        expect(productosMasVendidos(ordenes, 1)).toHaveLength(1)
    })

    it('el límite por defecto es 5', () => {
        const muchas = [orden(1, 'Pagada', [1, 2, 3, 4, 5, 6, 7].map((n) => item(n, `P${n}`, 100, 1)))]
        expect(productosMasVendidos(muchas)).toHaveLength(5)
    })

    it('devuelve [] sin ventas', () => {
        expect(productosMasVendidos([])).toEqual([])
    })
})


describe('ordenesPorEstado', () => {
    it('devuelve una entrada por cada estado, incluso con cantidad 0', () => {
        const ordenes = [orden(1, 'Pagada', []), orden(2, 'Pagada', []), orden(3, 'Pago fallido', [])]
        expect(ordenesPorEstado(ordenes)).toEqual([
            { estado: 'Pagada', cantidad: 2 },
            { estado: 'Pago fallido', cantidad: 1 },
            { estado: 'Pendiente', cantidad: 0 },
        ])
    })
})


describe('ventasPorMes', () => {
    const fijarHoy = () => {
        vi.useFakeTimers({ toFake: ['Date'] })
        vi.setSystemTime(new Date('2026-10-22T12:00:00'))
    }

    it('devuelve la cantidad de meses pedida (6 por defecto) terminando en el mes actual', () => {
        fijarHoy()
        const meses = ventasPorMes([])
        expect(meses).toHaveLength(6)
        expect(meses.map((m) => m.clave)).toEqual(['2026-4', '2026-5', '2026-6', '2026-7', '2026-8', '2026-9'])
        expect(ventasPorMes([], 3)).toHaveLength(3)
    })

    it('cruza el cambio de año hacia atrás', () => {
        vi.useFakeTimers({ toFake: ['Date'] })
        vi.setSystemTime(new Date('2026-02-10T12:00:00'))
        expect(ventasPorMes([], 4).map((m) => m.clave)).toEqual(['2025-10', '2025-11', '2026-0', '2026-1'])
    })

    it('las etiquetas no llevan punto y los meses vacíos parten en 0', () => {
        fijarHoy()
        for (const m of ventasPorMes([])) {
            expect(m.etiqueta).not.toContain('.')
            expect(m.etiqueta.length).toBeGreaterThan(0)
            expect(m).toMatchObject({ monto: 0, ordenes: 0 })
        }
    })

    it('suma solo órdenes pagadas dentro de la ventana, en su mes', () => {
        fijarHoy()
        const ordenes = [
            orden(1, 'Pagada', [item(1, 'A', 1000, 1)], '2026-10-02T10:00:00'),
            orden(2, 'Pagada', [item(1, 'A', 1000, 2)], '2026-10-15T10:00:00'),
            orden(3, 'Pagada', [item(1, 'A', 500, 1)], '2026-09-01T10:00:00'),
            orden(4, 'Pago fallido', [item(1, 'A', 9999, 1)], '2026-10-03T10:00:00'),
            orden(5, 'Pagada', [item(1, 'A', 9999, 1)], '2020-01-01T10:00:00'), // fuera de la ventana
        ]
        const meses = ventasPorMes(ordenes)
        expect(meses.at(-1)).toMatchObject({ clave: '2026-9', monto: 3000, ordenes: 2 })
        expect(meses.at(-2)).toMatchObject({ clave: '2026-8', monto: 500, ordenes: 1 })
        expect(meses.reduce((s, m) => s + m.monto, 0)).toBe(3500)
    })
})