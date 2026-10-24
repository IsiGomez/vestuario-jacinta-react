import { describe, it, expect } from 'vitest'
import {
    obtenerCategorias,
    obtenerCategoriaPorId,
    contarProductosDeCategoria,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
} from '../../data/categorias'
import { eliminarProducto, obtenerProductos } from '../../data/productos'


describe('obtenerCategorias', () => {
    it('siembra la categoría inicial "Camisas"', () => {
        const categorias = obtenerCategorias()
        expect(categorias).toHaveLength(1)
        expect(categorias[0]).toMatchObject({ id: 1, nombre: 'Camisas' })
    })

    it('respeta lo ya guardado', () => {
        localStorage.setItem('jacinta_categorias', '[]')
        expect(obtenerCategorias()).toEqual([])
    })
})


describe('obtenerCategoriaPorId', () => {
    it('encuentra por id (number o string)', () => {
        expect(obtenerCategoriaPorId(1).nombre).toBe('Camisas')
        expect(obtenerCategoriaPorId('1').nombre).toBe('Camisas')
    })

    it('devuelve null si no existe', () => {
        expect(obtenerCategoriaPorId(50)).toBeNull()
    })
})


describe('contarProductosDeCategoria', () => {
    it('cuenta los productos asociados', () => {
        expect(contarProductosDeCategoria(1)).toBe(4)
    })

    it('devuelve 0 si no hay productos', () => {
        expect(contarProductosDeCategoria(99)).toBe(0)
    })
})


describe('crearCategoria', () => {
    it('crea con el siguiente id y persiste', () => {
        const nueva = crearCategoria({ nombre: 'Poleras', descripcion: 'Poleras varias' })
        expect(nueva.id).toBe(2)
        expect(obtenerCategorias()).toHaveLength(2)
    })

    it('rechaza nombre repetido sin distinguir mayúsculas ni espacios', () => {
        expect(() => crearCategoria({ nombre: '  camisas ', descripcion: 'x' }))
            .toThrow('Ya existe una categoría con ese nombre')
        expect(obtenerCategorias()).toHaveLength(1)
    })
})


describe('actualizarCategoria', () => {
    it('actualiza campos y mantiene el id', () => {
        const actualizada = actualizarCategoria(1, { id: 9, descripcion: 'Nueva descripción' })
        expect(actualizada.id).toBe(1)
        expect(actualizada.descripcion).toBe('Nueva descripción')
        expect(actualizada.nombre).toBe('Camisas')
    })

    it('devuelve null si no existe', () => {
        expect(actualizarCategoria(99, { nombre: 'X' })).toBeNull()
    })

    it('permite conservar su propio nombre', () => {
        expect(() => actualizarCategoria(1, { nombre: 'camisas' })).not.toThrow()
    })

    it('rechaza el nombre de otra categoría', () => {
        crearCategoria({ nombre: 'Poleras', descripcion: 'x' })
        expect(() => actualizarCategoria(2, { nombre: 'Camisas' }))
            .toThrow('Ya existe una categoría con ese nombre')
    })

    it('no valida el nombre si no viene en los cambios', () => {
        crearCategoria({ nombre: 'Poleras', descripcion: 'x' })
        expect(() => actualizarCategoria(2, { descripcion: 'otra' })).not.toThrow()
    })
})


describe('eliminarCategoria', () => {
    it('no permite eliminar una categoría con productos asociados', () => {
        expect(() => eliminarCategoria(1)).toThrow(/tiene productos asociados/)
        expect(obtenerCategorias()).toHaveLength(1)
    })

    it('elimina una categoría sin productos', () => {
        crearCategoria({ nombre: 'Poleras', descripcion: 'x' })
        expect(eliminarCategoria(2)).toBe(true)
        expect(obtenerCategoriaPorId(2)).toBeNull()
    })

    it('permite eliminar la categoría cuando ya no tiene productos', () => {
        obtenerProductos().forEach((p) => eliminarProducto(p.id))
        expect(eliminarCategoria(1)).toBe(true)
    })

    it('devuelve false si la categoría no existe', () => {
        expect(eliminarCategoria(99)).toBe(false)
    })
})