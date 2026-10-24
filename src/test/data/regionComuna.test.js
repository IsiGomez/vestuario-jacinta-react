import { describe, it, expect } from 'vitest'
import { regiones, obtenerRegiones, obtenerComunas } from '../../data/regionComuna'

describe('obtenerRegiones', () => {
    it('devuelve las 16 regiones de Chile', () => {
        expect(obtenerRegiones()).toHaveLength(16)
    })

    it('devuelve solo nombres (strings) sin repetir', () => {
        const nombres = obtenerRegiones()
        expect(nombres.every((n) => typeof n === 'string')).toBe(true)
        expect(new Set(nombres).size).toBe(nombres.length)
    })

    it('incluye Valparaíso y la Región Metropolitana', () => {
        expect(obtenerRegiones()).toEqual(
            expect.arrayContaining(['Valparaíso', 'Región Metropolitana'])
        )
    })
})


describe('obtenerComunas', () => {
    it('devuelve las comunas de una región existente', () => {
        expect(obtenerComunas('Arica y Parinacota')).toEqual(['Arica', 'Camarones', 'General Lagos', 'Putre'])
    })

    it('Valparaíso incluye Viña del Mar', () => {
        expect(obtenerComunas('Valparaíso')).toContain('Viña del Mar')
    })

    it('devuelve [] para una región inexistente o vacía', () => {
        expect(obtenerComunas('Atlantis')).toEqual([])
        expect(obtenerComunas('')).toEqual([])
        expect(obtenerComunas(undefined)).toEqual([])
    })

    it('devuelve una copia: mutarla no altera los datos originales', () => {
        const comunas = obtenerComunas('Arica y Parinacota')
        comunas.push('Falsa')
        expect(obtenerComunas('Arica y Parinacota')).toHaveLength(4)
    })
})


describe('integridad de los datos', () => {
    it('toda región tiene al menos una comuna', () => {
        for (const r of regiones) {
            expect(r.comunas.length, r.region).toBeGreaterThan(0)
        }
    })

    it('no hay comunas repetidas dentro de una misma región', () => {
        for (const r of regiones) {
            expect(new Set(r.comunas).size, r.region).toBe(r.comunas.length)
        }
    })
})