import { describe, it, expect } from 'vitest'
import { TALLAS, TIPOS, COLORES, COLORES_CON_FOTOS, color, disponiblesPrimero } from '../../utils/catalogo'

describe('constantes', () => {
    it('las tallas disponibles son S, M, L y XL', () => {
        expect(TALLAS).toEqual(['S', 'M', 'L', 'XL'])
    })

    it('los tipos y colores tienen nombres fáciles de leer', () => {
        expect(TIPOS.cam_corta).toBe('Camisa manga corta')
        expect(COLORES.purpura).toBe('Púrpura')
    })

    it('las fotos de los colores usan solo tipos y colores válidos', () => {
        for (const [ruta, claves] of Object.entries(COLORES_CON_FOTOS)) {
            const [, tipo] = ruta.split('/')
            expect(TIPOS, ruta).toHaveProperty(tipo)
            for (const clave of claves) expect(COLORES, `${ruta}/${clave}`).toHaveProperty(clave)
        }
    })
})


describe('color', () => {
    it('genera el color con sus 4 imágenes en las carpetas correctas', () => {
        const c = color('hombre', 'cam_corta', 'Azul', 'azul')
        expect(c.nombre).toBe('Azul')
        expect(c.clave).toBe('azul')
        expect(c.imagenes).toEqual([
            '/assets/img/productos/hombre/cam_corta/azul_1.jpg',
            '/assets/img/productos/hombre/cam_corta/azul_2.jpg',
            '/assets/img/productos/hombre/cam_corta/azul_3.jpg',
            '/assets/img/productos/hombre/cam_corta/azul_4.jpg',
        ])
    })
})



describe('disponiblesPrimero', () => {
    it('deja los productos con stock primero y los agotados al final, sin alterar el orden dentro de cada grupo', () => {
        const productos = [{ id: 1, stock: 0 }, { id: 2, stock: 5 }, { id: 3, stock: 0 }, { id: 4, stock: 1 }]
        expect(disponiblesPrimero(productos).map((p) => p.id)).toEqual([2, 4, 1, 3])
    })

    it('no modifica la lista original', () => {
        const productos = [{ id: 1, stock: 0 }, { id: 2, stock: 5 }]
        disponiblesPrimero(productos)
        expect(productos.map((p) => p.id)).toEqual([1, 2])
    })
})