export const ESTADOS_ORDEN = ['PAGADA', 'PAGO_FALLIDO', 'PENDIENTE']

export const ETIQUETAS_ESTADO = Object.freeze({
    PAGADA: 'Pagada',
    PAGO_FALLIDO: 'Pago fallido',
    PENDIENTE: 'Pendiente',
})

export const COLOR_ESTADO = Object.freeze({
    PAGADA: 'success',
    PAGO_FALLIDO: 'danger',
    PENDIENTE: 'warning',
})

export const etiquetaEstado = (estado) => ETIQUETAS_ESTADO[estado] ?? estado