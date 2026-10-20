import { leer, guardar, siguienteId } from '../utils/storage'

const CLAVE = 'jacinta_productos'

// /assets/img/productos/<genero>/<tipo>/<color>_<n>.jpg
// Las 4 vistas de cada color son _1 a _4.
const rutaImagen = (genero, tipo, clave, n) =>  `/assets/img/productos/${genero}/${tipo}/${clave}_${n}.jpg`

const imagenesDeColor = (genero, tipo, clave) => [1, 2, 3, 4].map((n) => rutaImagen(genero, tipo, clave, n))


const color = (genero, tipo, nombre, clave) => ({
    nombre,
    clave,
    imagenes: imagenesDeColor(genero, tipo, clave),
})

const TALLAS = ['S', 'M', 'L', 'XL']

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


function persistir(lista) {
    if (!guardar(CLAVE, lista)) {
        throw new Error('No se pudo guardar: el almacenamiento del navegador está lleno o no disponible')
    }
}



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
    
    persistir([...productos, nuevo])
    
    return nuevo
}


export function actualizarProducto(id, cambios) {
    const productos = obtenerProductos()
    const indice = productos.findIndex((p) => p.id === Number(id))
    
    if (indice === -1) return null
    
    const actualizado = { ...productos[indice], ...cambios, id: productos[indice].id }
    const copia = [...productos]
    
    copia[indice] = actualizado
    persistir(copia)
    
    return actualizado
}


export function eliminarProducto(id) {
  const productos = obtenerProductos()
  const filtrados = productos.filter((p) => p.id !== Number(id))
  
  if (filtrados.length === productos.length) return false
  
  persistir(filtrados)
  
  return true
}


export function restablecerProductos() {
    const iniciales = structuredClone(productosIniciales)
    
    persistir(iniciales)
    
    return iniciales
}