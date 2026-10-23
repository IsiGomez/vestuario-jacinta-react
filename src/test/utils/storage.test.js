import { describe, it, expect, vi } from 'vitest'
import { leer, guardar, persistir, siguienteId } from '../../utils/storage'

describe('leer', () => {
    it('devuelve null por defecto si la clave no existe', () => {
        expect(leer('no_existe')).toBeNull()
    })

    it('devuelve el valor por defecto indicado', () => {
        expect(leer('no_existe', [])).toEqual([])
    })

    it('parsea el JSON guardado', () => {
        localStorage.setItem('k', JSON.stringify({ a: 1 }))
        expect(leer('k')).toEqual({ a: 1 })
    })

    it('devuelve el valor por defecto si el JSON está corrupto', () => {
        localStorage.setItem('k', '{no es json')
        expect(leer('k', 'respaldo')).toBe('respaldo')
    })

    it('distingue un valor null guardado de una clave inexistente', () => {
        localStorage.setItem('k', 'null')
        expect(leer('k', 'respaldo')).toBeNull()
    })

    it('devuelve el valor por defecto si localStorage lanza error', () => {
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
            throw new Error('bloqueado')
        })
        expect(leer('k', 'respaldo')).toBe('respaldo')
    })
})


describe('guardar', () => {
    it('guarda como JSON y devuelve true', () => {
        expect(guardar('k', { a: [1, 2] })).toBe(true)
        expect(localStorage.getItem('k')).toBe('{"a":[1,2]}')
    })

    it('devuelve false si localStorage falla', () => {
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('lleno')
        })
        expect(guardar('k', 1)).toBe(false)
    })
})


describe('persistir', () => {
    it('guarda la lista sin lanzar error', () => {
        persistir('lista', [1, 2, 3])
        expect(leer('lista')).toEqual([1, 2, 3])
    })

    it('lanza un error descriptivo si no puede guardar', () => {
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('lleno')
        })
        expect(() => persistir('lista', [])).toThrow(/No se pudo guardar/)
    })
})


describe('siguienteId', () => {
    it('devuelve 1 para una lista vacía', () => {
        expect(siguienteId([])).toBe(1)
    })

    it('devuelve el máximo id + 1', () => {
        expect(siguienteId([{ id: 1 }, { id: 7 }, { id: 3 }])).toBe(8)
    })

    it('no reutiliza ids de elementos eliminados en medio de la lista', () => {
        expect(siguienteId([{ id: 1 }, { id: 3 }])).toBe(4)
    })
})