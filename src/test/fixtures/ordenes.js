const entrega = { calle: 'Los Aromos 1234', departamento: '', region: 'Región Metropolitana de Santiago', comuna: 'Providencia', indicaciones: '' }
const item = (productoId, nombre, precio, cantidad) => ({ productoId, nombre, precio, cantidad, talla: null, color: null })

const cortaHombre = (cantidad) => item(1, 'Camisa manga corta hombre', 14990, cantidad)
const largaHombre = (cantidad) => item(2, 'Camisa manga larga hombre', 17990, cantidad)
const largaMujer = (cantidad) => item(4, 'Camisa manga larga mujer', 17990, cantidad)

export const orden1 = {
    id: 1, numero: '2026090101', fecha: '2026-09-01T10:30:00', usuarioId: 2, estado: 'PAGADA', total: 47970,
    cliente: { nombre: 'Camila', apellidos: 'Rojas Pérez', correo: 'camila.rojas@gmail.com' }, entrega,
    items: [cortaHombre(2), largaMujer(1)],
}
export const orden2 = {
    id: 2, numero: '2026091502', fecha: '2026-09-15T16:45:00', usuarioId: 3, estado: 'PAGO_FALLIDO', total: 17990,
    cliente: { nombre: 'Pedro', apellidos: 'Soto Díaz', correo: 'pedro.soto@gmail.com' }, entrega,
    items: [largaHombre(1)],
}
export const orden3 = {
    id: 3, numero: '2026100203', fecha: '2026-10-02T12:10:00', usuarioId: 2, estado: 'PAGADA', total: 44970,
    cliente: { nombre: 'Camila', apellidos: 'Rojas Pérez', correo: 'camila.rojas@gmail.com' }, entrega,
    items: [cortaHombre(3)],
}
export const orden4 = {
    id: 4, numero: '2026101004', fecha: '2026-10-10T09:15:00', usuarioId: 4, estado: 'PAGADA', total: 50970,
    cliente: { nombre: 'Luis', apellidos: 'Pérez Mora', correo: 'luis.perez@gmail.com' }, entrega,
    items: [cortaHombre(1), largaMujer(2)],
}

export const ordenesDeLaApi = [orden4, orden3, orden2, orden1]