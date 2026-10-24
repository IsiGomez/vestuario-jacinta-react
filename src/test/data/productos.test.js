import { describe, it, expect } from 'vitest'
import {
    TALLAS,
    TIPOS,
    COLORES,
    COLORES_CON_FOTOS,
    color,
    obtenerProductos,
    obtenerProductoPorId,
    obtenerProductosCriticos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    restablecerProductos,
} from '../../data/productos'
import { leer } from '../../utils/storage'

const datosNuevos = (extra = {}) => ({
    nombre: 'Polerón con capucha unisex',
    genero: 'unisex',
    tipo: 'poleron_capucha',
    categoriaId: 1,
    precio: 29990,
    stock: 10,
    stockCritico: 3,
    descripcion: 'Polerón abrigado.',
    tallas: TALLAS,
    colores: [],
    ...extra,
})


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


describe('obtenerProductos', () => {
    it('carga los 4 productos iniciales y los guarda', () => {
        const productos = obtenerProductos()
        expect(productos).toHaveLength(4)
        expect(leer('jacinta_productos')).toEqual(productos)
    })

    it('cada producto inicial tiene sus datos obligatorios', () => {
        for (const p of obtenerProductos()) {
            expect(p).toEqual(expect.objectContaining({
                id: expect.any(Number),
                nombre: expect.any(String),
                precio: expect.any(Number),
                stock: expect.any(Number),
                stockCritico: expect.any(Number),
            }))
            expect(p.colores.length).toBeGreaterThan(0)
        }
    })

    it('los colores de cada producto inicial coinciden con la lista de fotos', () => {
        for (const p of obtenerProductos()) {
            const esperadas = COLORES_CON_FOTOS[`${p.genero}/${p.tipo}`]
            expect(p.colores.map((c) => c.clave), p.nombre).toEqual(esperadas)
        }
    })

    it('respeta la información que ya estaba guardada', () => {
        localStorage.setItem('jacinta_productos', '[]')
        expect(obtenerProductos()).toEqual([])
    })
})


describe('obtenerProductoPorId', () => {
    it('encuentra el producto usando su número o texto de id', () => {
        expect(obtenerProductoPorId(1).nombre).toBe('Camisa manga corta hombre')
        expect(obtenerProductoPorId('2').id).toBe(2)
    })

    it('devuelve null si el producto no existe', () => {
        expect(obtenerProductoPorId(99)).toBeNull()
    })
})


describe('obtenerProductosCriticos', () => {
    it('muestra los productos con stock bajo o igual al límite crítico', () => {
        const criticos = obtenerProductosCriticos()
        expect(criticos.map((p) => p.id)).toEqual([2]) 
    })

    it('si el stock es igual al límite crítico, también se considera bajo stock', () => {
        actualizarProducto(1, { stock: 5 })
        expect(obtenerProductosCriticos().map((p) => p.id)).toEqual(expect.arrayContaining([1, 2]))
    })

    it('un producto sin stock entra en la lista de críticos', () => {
        actualizarProducto(3, { stock: 0 })
        expect(obtenerProductosCriticos().map((p) => p.id)).toContain(3)
    })
})


describe('crearProducto', () => {
    it('asigna un nuevo id y guarda el producto', () => {
        const creado = crearProducto(datosNuevos())
        expect(creado.id).toBe(5)
        expect(obtenerProductos()).toHaveLength(5)
        expect(obtenerProductoPorId(5).nombre).toBe('Polerón con capucha unisex')
    })

    it('ignora cualquier id que se intente enviar por los datos', () => {
        expect(crearProducto(datosNuevos({ id: 99 })).id).toBe(5)
    })
})


describe('actualizarProducto', () => {
    it('actualiza únicamente los datos que se envían', () => {
        const actualizado = actualizarProducto(1, { precio: 19990 })
        expect(actualizado.precio).toBe(19990)
        expect(actualizado.nombre).toBe('Camisa manga corta hombre')
        expect(obtenerProductoPorId(1).precio).toBe(19990)
    })

    it('no permite cambiar el id del producto', () => {
        expect(actualizarProducto(1, { id: 77 }).id).toBe(1)
    })

    it('devuelve null si se intenta actualizar un producto que no existe', () => {
        expect(actualizarProducto(99, { precio: 1000 })).toBeNull()
    })

    it('acepta el id escrito como texto', () => {
        expect(actualizarProducto('1', { stock: 1 }).stock).toBe(1)
    })
})


describe('eliminarProducto', () => {
    it('elimina el producto y confirma con verdadero', () => {
        expect(eliminarProducto(1)).toBe(true)
        expect(obtenerProductoPorId(1)).toBeNull()
        expect(obtenerProductos()).toHaveLength(3)
    })

    it('devuelve falso si el producto no existe y no modifica la lista', () => {
        expect(eliminarProducto(99)).toBe(false)
        expect(obtenerProductos()).toHaveLength(4)
    })
})


describe('restablecerProductos', () => {
    it('vuelve a dejar los productos como al principio', () => {
        crearProducto(datosNuevos())
        eliminarProducto(1)
        const iniciales = restablecerProductos()
        expect(iniciales).toHaveLength(4)
        expect(obtenerProductos().map((p) => p.id)).toEqual([1, 2, 3, 4])
    })
})