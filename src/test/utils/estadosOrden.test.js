import { ESTADOS_ORDEN, ETIQUETAS_ESTADO, COLOR_ESTADO, etiquetaEstado } from '../../utils/estadosOrden'

describe('estadosOrden', () => {
    it('usa los mismos estados que el enum del backend', () => {
        expect([...ESTADOS_ORDEN].sort()).toEqual(['PAGADA', 'PAGO_FALLIDO', 'PENDIENTE'])
    })

    it('cada estado tiene etiqueta y color', () => {
        for (const estado of ESTADOS_ORDEN) {
            expect(ETIQUETAS_ESTADO[estado], estado).toBeTruthy()
            expect(COLOR_ESTADO[estado], estado).toBeTruthy()
        }
    })

    it('traduce el enum a texto legible', () => {
        expect(etiquetaEstado('PAGO_FALLIDO')).toBe('Pago fallido')
        expect(etiquetaEstado('PAGADA')).toBe('Pagada')
    })

    it('un estado desconocido se muestra tal cual', () => {
        expect(etiquetaEstado('OTRO')).toBe('OTRO')
    })
})