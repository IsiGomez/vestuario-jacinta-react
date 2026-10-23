import { describe, it, expect } from 'vitest'
import { formatearPrecio, formatearRun, formatearFecha } from '../../utils/formato'

describe('formatearPrecio', () => {
    it('formatea en pesos chilenos con separador de miles', () => {
        const texto = formatearPrecio(14990).replace(/\s+/g, ' ')
        expect(texto).toBe('$14.990')
    })
 
    it('formatea el cero', () => {
        expect(formatearPrecio(0).replace(/\s+/g, ' ')).toBe('$0')
    })
 
    it('no usa decimales (CLP)', () => {
        expect(formatearPrecio(1500000)).toBe('$1.500.000')
    })
})


describe('formatearRun', () => {
    it('agrega puntos y guion a un RUN sin formato', () => {
        expect(formatearRun('190110222')).toBe('19.011.022-2')
    })
 
    it('acepta un RUN que ya viene formateado', () => {
        expect(formatearRun('19.011.022-2')).toBe('19.011.022-2')
    })
 
    it('convierte la K del dígito verificador a mayúscula', () => {
        expect(formatearRun('12345678k')).toBe('12.345.678-K')
    })
 
    it('formatea RUN de 7 dígitos en el cuerpo', () => {
        expect(formatearRun('1234567-8')).toBe('1.234.567-8')
    })
  
    it('tolera null y undefined', () => {
        expect(formatearRun(null)).toBe('')
        expect(formatearRun(undefined)).toBe('')
    })
})


describe('formatearFecha', () => {
    it('devuelve un texto con el día y el año', () => {
        const texto = formatearFecha('2026-09-01T15:30:00')
        expect(texto).toContain('2026')
        expect(texto).toContain('01')
    })
 
    it('incluye la hora (3:30 p. m.)', () => {
        expect(formatearFecha('2026-09-01T15:30:00')).toMatch(/3:30/)
    })
})