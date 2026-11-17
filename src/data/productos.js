import { leer, guardar, siguienteId, persistir } from '../utils/storage'
import { color, TALLAS, TIPOS, COLORES, COLORES_CON_FOTOS, disponiblesPrimero } from '../utils/catalogo'

const CLAVE = 'jacinta_productos'

export { color, TALLAS, TIPOS, COLORES, COLORES_CON_FOTOS, disponiblesPrimero }

const productosIniciales = [
    {
        id: 1,
        nombre: 'Camisa manga corta hombre',
        genero: 'hombre',
        tipo: 'cam_corta',
        categoriaId: 1,
        precio: 14990,
        stock: 25,
        stockCritico: 5,
        descripcion: 'Camisa de manga corta, corte cómodo para el día a día.',
        tallas: TALLAS,
        colores: [
            color('hombre', 'cam_corta', 'Azul', 'azul'),
            color('hombre', 'cam_corta', 'Rojo', 'rojo'),
        ],
    },
    {
        id: 2,
        nombre: 'Camisa manga larga hombre',
        genero: 'hombre',
        tipo: 'cam_larga',
        categoriaId: 1,
        precio: 17990,
        stock: 3,
        stockCritico: 5,
        descripcion: 'Camisa de manga larga, ideal para looks casuales o semiformales.',
        tallas: TALLAS,
        colores: [
            color('hombre', 'cam_larga', 'Gris', 'gris'),
            color('hombre', 'cam_larga', 'Negro', 'negro'),
            color('hombre', 'cam_larga', 'Rojo', 'rojo'),
        ],
    },
    {
        id: 3,
        nombre: 'Camisa manga corta mujer',
        genero: 'mujer',
        tipo: 'cam_corta',
        categoriaId: 1,
        precio: 14990,
        stock: 12,
        stockCritico: 5,
        descripcion: 'Camisa de manga corta, liviana y fresca.',
        tallas: TALLAS,
        colores: [
            color('mujer', 'cam_corta', 'Celeste', 'celeste'),
            color('mujer', 'cam_corta', 'Púrpura', 'purpura'),
            color('mujer', 'cam_corta', 'Rojo', 'rojo'),
        ],
    },
    {
        id: 4,
        nombre: 'Camisa manga larga mujer',
        genero: 'mujer',
        tipo: 'cam_larga',
        categoriaId: 1,
        precio: 17990,
        stock: 8,
        stockCritico: 5,
        descripcion: 'Camisa de manga larga en un negro versátil.',
        tallas: TALLAS,
        colores: [
            color('mujer', 'cam_larga', 'Negro', 'negro')
        ],
    },
]


export function obtenerProductos() {
    const guardados = leer(CLAVE, null)
    
    if (guardados === null) {
        const iniciales = structuredClone(productosIniciales)
        guardar(CLAVE, iniciales)
        
        return iniciales
    }

    return guardados
}


export function obtenerProductoPorId(id) {
    return obtenerProductos().find((p) => p.id === Number(id)) ?? null
}

export function obtenerProductosCriticos() {
    return obtenerProductos().filter((p) => p.stock <= p.stockCritico)
}


export function crearProducto(datos) {
    const productos = obtenerProductos()
    const nuevo = { ...datos, id: siguienteId(productos) }
    
    persistir(CLAVE, [...productos, nuevo])
    
    return nuevo
}


export function actualizarProducto(id, cambios) {
    const productos = obtenerProductos()
    const indice = productos.findIndex((p) => p.id === Number(id))
    
    if (indice === -1) return null
    
    const actualizado = { ...productos[indice], ...cambios, id: productos[indice].id }
    const copia = [...productos]
    
    copia[indice] = actualizado
    persistir(CLAVE, copia)
    
    return actualizado
}


export function eliminarProducto(id) {
  const productos = obtenerProductos()
  const filtrados = productos.filter((p) => p.id !== Number(id))
  
  if (filtrados.length === productos.length) return false
  
  persistir(CLAVE, filtrados)
  
  return true
}


export class StockInsuficienteError extends Error {}


function agruparPorProducto(items) {
    const total = new Map()

    for (const { productoId, cantidad } of items) {
        total.set(productoId, (total.get(productoId) ?? 0) + cantidad)
    }

    return total
}


export function descontarStock(items) {
    const productos = obtenerProductos()
    const pedido = agruparPorProducto(items)

    for (const [id, cantidad] of pedido) {
        const producto = productos.find((p) => p.id === id)

        if (!producto) throw new StockInsuficienteError('Un producto de tu carrito ya no está disponible')
        if (producto.stock < cantidad) {
            throw new StockInsuficienteError(
                producto.stock === 0
                    ? `"${producto.nombre}" está agotado`
                    : `Solo quedan ${producto.stock} unidades de "${producto.nombre}"`
            )
        }
    }

    persistir(CLAVE, productos.map((p) => (pedido.has(p.id) ? { ...p, stock: p.stock - pedido.get(p.id) } : p)))
}


export function reponerStock(items) {
    const productos = obtenerProductos()
    const devuelto = agruparPorProducto(items)

    persistir(CLAVE, productos.map((p) => (devuelto.has(p.id) ? { ...p, stock: p.stock + devuelto.get(p.id) } : p)))
}


export function restablecerProductos() {
    const iniciales = structuredClone(productosIniciales)
    
    persistir(CLAVE, iniciales)
    
    return iniciales
}