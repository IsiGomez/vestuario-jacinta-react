
export const formatearPrecio = (valor) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(valor)

export function formatearRun(run) {
    const limpio = String(run ?? '').replace(/[.\-\s]/g, '').toUpperCase()

    if (limpio.length < 2) return limpio

    const cuerpo = limpio.slice(0, -1)
    const dv = limpio.slice(-1)

    return `${cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${dv}`
}

export const formatearFecha = (fecha) =>
    new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(fecha))