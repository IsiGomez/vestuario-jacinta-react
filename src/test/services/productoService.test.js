import {
    obtenerProductos, obtenerProductosTienda, obtenerProductosCriticos,
    obtenerProductoPorId, crearProducto, actualizarProducto, eliminarProducto,
} from '../../services/productoService'
import { apiFetch } from '../../services/api'

vi.mock('../../services/api', () => ({ apiFetch: vi.fn() }))

const deApi = {
    id: 1, nombre: 'Camisa manga corta hombre', genero: 'hombre', tipo: 'cam_corta', categoriaId: 1,
    precio: 14990, stock: 25, stockCritico: 5, descripcion: 'Camisa', tallas: ['S', 'M'],
    colores: ['azul', 'rojo'], activo: true,
}

describe('productoService', () => {
    beforeEach(() => {
        apiFetch.mockReset()
    })

    it('convierte las claves de color de la API en objetos con nombre e imágenes', async () => {
        apiFetch.mockResolvedValue([deApi])

        const [producto] = await obtenerProductos()

        expect(apiFetch).toHaveBeenCalledWith('/productos')
        expect(producto.colores.map((c) => c.clave)).toEqual(['azul', 'rojo'])
        expect(producto.colores[0].nombre).toBe('Azul')
        expect(producto.colores[0].imagenes).toHaveLength(4)
        expect(producto.colores[0].imagenes[0]).toBe('/assets/img/productos/hombre/cam_corta/azul_1.jpg')
    })

    it('el catálogo de la tienda pide los productos sin token', async () => {
        apiFetch.mockResolvedValue([deApi])

        await obtenerProductosTienda()

        expect(apiFetch).toHaveBeenCalledWith('/productos', { autenticado: false })
    })

    it('usa los endpoints de críticos y de detalle', async () => {
        apiFetch.mockResolvedValueOnce([deApi]).mockResolvedValueOnce(deApi)

        await obtenerProductosCriticos()
        const producto = await obtenerProductoPorId(1)

        expect(apiFetch).toHaveBeenNthCalledWith(1, '/productos/criticos')
        expect(apiFetch).toHaveBeenNthCalledWith(2, '/productos/1')
        expect(producto.colores[1].nombre).toBe('Rojo')
    })

    it('al guardar envía solo las claves de color', async () => {
        apiFetch.mockResolvedValue(deApi)
        const datos = { ...deApi, colores: [{ nombre: 'Azul', clave: 'azul', imagenes: [] }, 'rojo'] }

        await crearProducto(datos)
        await actualizarProducto(1, datos)

        expect(apiFetch).toHaveBeenNthCalledWith(1, '/productos', {
            method: 'POST', body: { ...deApi, colores: ['azul', 'rojo'] },
        })
        expect(apiFetch).toHaveBeenNthCalledWith(2, '/productos/1', {
            method: 'PUT', body: { ...deApi, colores: ['azul', 'rojo'] },
        })
    })

    it('elimina con DELETE', async () => {
        apiFetch.mockResolvedValue(null)

        await eliminarProducto(3)

        expect(apiFetch).toHaveBeenCalledWith('/productos/3', { method: 'DELETE' })
    })
})