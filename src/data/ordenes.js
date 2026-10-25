import { leer, guardar, siguienteId, persistir } from '../utils/storage'
import { descontarStock, reponerStock } from './productos'

const CLAVE = 'jacinta_ordenes'

export const ESTADOS_ORDEN = ['Pagada', 'Pago fallido', 'Pendiente']

const ESTADOS_QUE_RESERVAN = ['Pendiente', 'Pagada']

const entregaEjemplo = (calle, comuna) => ({
    calle,
    departamento: '',
    region: 'Región Metropolitana de Santiago',
    comuna,
    indicaciones: '',
})

const ordenesIniciales = [
    {
        id: 1,
        numero: '2026090101',
        fecha: '2026-09-01T15:30:00',
        usuarioId: null,
        cliente: { nombre: 'Camila', apellidos: 'Rojas Pérez', correo: 'camila.rojas@gmail.com' },
        entrega: entregaEjemplo('Los Aromos 1234', 'Providencia'),
        items: [
            { productoId: 1, nombre: 'Camisa manga corta hombre', precio: 14990, cantidad: 2 },
            { productoId: 4, nombre: 'Camisa manga larga mujer', precio: 17990, cantidad: 1 },
        ],
        estado: 'Pagada',
    },
    {
        id: 2,
        numero: '2026091502',
        fecha: '2026-09-15T11:05:00',
        usuarioId: null,
        cliente: { nombre: 'Pedro', apellidos: 'Soto Díaz', correo: 'pedro.soto@gmail.com' },
        entrega: entregaEjemplo('Av. Matta 560', 'Santiago'),
        items: [{ productoId: 4, nombre: 'Camisa manga larga mujer', precio: 17990, cantidad: 1 }],
        estado: 'Pago fallido',
    },
    {
        id: 3,
        numero: '2026100203',
        fecha: '2026-10-02T18:40:00',
        usuarioId: null,
        cliente: { nombre: 'Camila', apellidos: 'Rojas Pérez', correo: 'camila.rojas@gmail.com' },
        entrega: entregaEjemplo('Los Aromos 1234', 'Providencia'),
        items: [{ productoId: 1, nombre: 'Camisa manga corta hombre', precio: 14990, cantidad: 3 }],
        estado: 'Pagada',
    },
    {
        id: 4,
        numero: '2026101004',
        fecha: '2026-10-10T09:15:00',
        usuarioId: null,
        cliente: { nombre: 'Pedro', apellidos: 'Soto Díaz', correo: 'pedro.soto@gmail.com' },
        entrega: entregaEjemplo('Av. Matta 560', 'Santiago'),
        items: [
            { productoId: 4, nombre: 'Camisa manga larga mujer', precio: 17990, cantidad: 2 },
            { productoId: 1, nombre: 'Camisa manga corta hombre', precio: 14990, cantidad: 1 },
        ],
        estado: 'Pagada',
    },
]


function normalizarOrden(orden) {
    if (orden.cliente && orden.entrega) return orden

    const d = orden.datosEntrega ?? {}
    const [nombre = '', ...apellidos] = String(d.nombre ?? '').trim().split(/\s+/)

    return {
        ...orden,
        cliente: orden.cliente ?? { nombre, apellidos: apellidos.join(' '), correo: d.correo ?? '' },
        entrega: orden.entrega ?? {
            calle: d.direccion ?? '',
            departamento: '',
            region: d.region ?? '',
            comuna: d.comuna ?? '',
            indicaciones: d.notas ?? '',
        },
    }
}

export const totalOrden = (orden) =>
    orden.items.reduce((suma, item) => suma + item.precio * item.cantidad, 0)

export function obtenerOrdenes() {
    const guardadas = leer(CLAVE, null)

    if (guardadas === null) {
        const iniciales = structuredClone(ordenesIniciales)
        guardar(CLAVE, iniciales)

        return iniciales
    }

    return guardadas.map(normalizarOrden)
}

export function obtenerOrdenPorId(id) {
    return obtenerOrdenes().find((o) => o.id === Number(id)) ?? null
}

export function obtenerOrdenesDeUsuario(usuario) {
    const correo = usuario.correo.trim().toLowerCase()

    return obtenerOrdenes().filter(
        (o) => o.usuarioId === usuario.id || o.cliente.correo.trim().toLowerCase() === correo
    )
}

// usuarioId, cliente, entrega, items, estado
export function crearOrden(datos, { reservarStock = false } = {}) {
    if (!datos.cliente || !datos.entrega || !Array.isArray(datos.items) || datos.items.length === 0) {
        throw new Error('La orden debe incluir cliente, entrega e items')
    }

    const reserva = reservarStock && ESTADOS_QUE_RESERVAN.includes(datos.estado ?? 'Pagada')

    if (reserva) descontarStock(datos.items)

    const ordenes = obtenerOrdenes()
    const id = siguienteId(ordenes)
    const fecha = new Date()
    const dia = fecha.toISOString().slice(0, 10).replaceAll('-', '')
    const nueva = {
        usuarioId: null,
        estado: 'Pagada',
        ...datos,
        id,
        numero: `${dia}${String(id).padStart(2, '0')}`,
        fecha: fecha.toISOString(),
        // true = la orden tiene stock apartado. Las órdenes sin este campo nunca tocan el stock.
        ...(reserva ? { stockReservado: true } : {}),
    }

    persistir(CLAVE, [...ordenes, nueva])

    return nueva
}

export function actualizarEstadoOrden(id, nuevoEstado) {
    const ordenes = obtenerOrdenes()
    const indice = ordenes.findIndex((o) => o.id === Number(id))
    
    if (indice === -1) return null

    if (!ESTADOS_ORDEN.includes(nuevoEstado)) throw new Error('Estado de orden no válido')

    const orden = ordenes[indice]
    const debeReservar = ESTADOS_QUE_RESERVAN.includes(nuevoEstado)
    const cambios = { estado: nuevoEstado }

    if (orden.stockReservado === true && !debeReservar) {
        reponerStock(orden.items)
        cambios.stockReservado = false
    } else if (orden.stockReservado === false && debeReservar) {
        descontarStock(orden.items)
        cambios.stockReservado = true
    }

    const actualizada = { ...orden, ...cambios }
    const copia = [...ordenes]
    
    copia[indice] = actualizada
    persistir(CLAVE, copia)
    
    return actualizada
}

export function restablecerOrdenes() {
    const iniciales = structuredClone(ordenesIniciales)

    persistir(CLAVE, iniciales)

    return iniciales
}