import { totalOrden } from '../data/ordenes'

export function resumenInventario(productos) {
    return {
        totalProductos: productos.length,
        unidades: productos.reduce((suma, p) => suma + p.stock, 0),
        valorInventario: productos.reduce((suma, p) => suma + p.precio * p.stock, 0),
        criticos: productos.filter((p) => p.stock <= p.stockCritico).length,
    }
}


export function inventarioPorCategoria(productos, categorias) {
    const nombres = Object.fromEntries(categorias.map((c) => [c.id, c.nombre]))
    const grupos = {}

    productos.forEach((p) => {
        const nombre = nombres[p.categoriaId] ?? 'Sin categoría'
        const grupo = grupos[nombre] ?? { categoria: nombre, productos: 0, unidades: 0, valor: 0 }

        grupo.productos += 1
        grupo.unidades += p.stock
        grupo.valor += p.precio * p.stock
        grupos[nombre] = grupo
    })

    return Object.values(grupos).sort((a, b) => b.valor - a.valor)
}


export function resumenVentas(ordenes) {
    const pagadas = ordenes.filter((o) => o.estado === 'Pagada')
    const montoTotal = pagadas.reduce((suma, o) => suma + totalOrden(o), 0)

    return {
        pagadas: pagadas.length,
        fallidas: ordenes.length - pagadas.length,
        montoTotal,
        ticketPromedio: pagadas.length === 0 ? 0 : Math.round(montoTotal / pagadas.length),
    }
}


export function productosMasVendidos(ordenes, limite = 5) {
    const ventas = {}

    ordenes
        .filter((o) => o.estado === 'Pagada')
        .forEach((o) => {
            o.items.forEach((item) => {
                const actual = ventas[item.productoId] ?? { productoId: item.productoId, nombre: item.nombre, unidades: 0, monto: 0 }

                actual.unidades += item.cantidad
                actual.monto += item.precio * item.cantidad
                ventas[item.productoId] = actual
            })
        })

    return Object.values(ventas)
        .sort((a, b) => b.unidades - a.unidades)
        .slice(0, limite)
}