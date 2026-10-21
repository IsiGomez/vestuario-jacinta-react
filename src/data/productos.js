import { leer, guardar, siguienteId, persistir } from '../utils/storage'

const CLAVE = 'jacinta_productos'

// /assets/img/productos/<genero>/<tipo>/<color>_<n>.jpg
// Las 4 vistas de cada color son _1 a _4.
const rutaImagen = (genero, tipo, clave, n) =>  `/assets/img/productos/${genero}/${tipo}/${clave}_${n}.jpg`

const imagenesDeColor = (genero, tipo, clave) => [1, 2, 3, 4].map((n) => rutaImagen(genero, tipo, clave, n))


export const color = (genero, tipo, nombre, clave) => ({
    nombre,
    clave,
    imagenes: imagenesDeColor(genero, tipo, clave),
})

export const TALLAS = ['S', 'M', 'L', 'XL']
export const TIPOS = {
    cam_corta: 'Camisa manga corta',
    cam_larga: 'Camisa manga larga',
    poleron_capucha: 'Polerón con capucha',
    poleron_cuello_alto: 'Polerón cuello alto',
}
export const COLORES = {
    azul: 'Azul',
    rojo: 'Rojo',
    gris: 'Gris',
    negro: 'Negro',
    celeste: 'Celeste',
    purpura: 'Púrpura',
}
export const COLORES_CON_FOTOS = {
    'hombre/cam_corta': ['azul', 'rojo'],
    'hombre/cam_larga': ['gris', 'negro', 'rojo'],
    'mujer/cam_corta': ['celeste', 'purpura', 'rojo'],
    'mujer/cam_larga': ['negro'],
    'unisex/poleron_capucha': ['gris', 'negro'],
    'unisex/poleron_cuello_alto': ['negro', 'purpura'],
}


const productosIniciales = [
    {
        id: 1,
        nombre: 'Camisa manga corta hombre',
        genero: 'hombre',
        tipo: 'cam_corta',
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


export function restablecerProductos() {
    const iniciales = structuredClone(productosIniciales)
    
    persistir(CLAVE, iniciales)
    
    return iniciales
}