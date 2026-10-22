import { leer, guardar, siguienteId, persistir } from '../utils/storage'
import { obtenerProductos } from './productos'

const CLAVE = 'jacinta_categorias'

const categoriasIniciales = [
    {
        id: 1,
        nombre: 'Camisas',
        descripcion: 'Camisas de manga corta y manga larga para hombre y mujer.',
    },
]


export function obtenerCategorias() {
    const guardadas = leer(CLAVE, null)

    if (guardadas === null) {
        const iniciales = structuredClone(categoriasIniciales)
        guardar(CLAVE, iniciales)

        return iniciales
    }

    return guardadas
}


export function obtenerCategoriaPorId(id) {
    return obtenerCategorias().find((c) => c.id === Number(id)) ?? null
}


export function contarProductosDeCategoria(id) {
    return obtenerProductos().filter((p) => p.categoriaId === Number(id)).length
}


const nombreRepetido = (lista, nombre, idActual = null) =>
lista.some((c) => c.id !== idActual && c.nombre.trim().toLowerCase() === nombre.trim().toLowerCase())



export function crearCategoria(datos) {
    const categorias = obtenerCategorias()

    if (nombreRepetido(categorias, datos.nombre)) {
        throw new Error('Ya existe una categoría con ese nombre')
    }

    const nueva = { ...datos, id: siguienteId(categorias) }

    persistir(CLAVE, [...categorias, nueva])

    return nueva
}


export function actualizarCategoria(id, cambios) {
    const categorias = obtenerCategorias()
    const indice = categorias.findIndex((c) => c.id === Number(id))

    if (indice === -1) return null

    if (cambios.nombre !== undefined && nombreRepetido(categorias, cambios.nombre, categorias[indice].id)) {
        throw new Error('Ya existe una categoría con ese nombre')
    }

    const actualizada = { ...categorias[indice], ...cambios, id: categorias[indice].id }
    const copia = [...categorias]

    copia[indice] = actualizada
    persistir(CLAVE, copia)

    return actualizada
}


export function eliminarCategoria(id) {
    if (contarProductosDeCategoria(id) > 0) {
        throw new Error('No se puede eliminar: la categoría tiene productos asociados')
    }

    const categorias = obtenerCategorias()
    const filtradas = categorias.filter((c) => c.id !== Number(id))

    if (filtradas.length === categorias.length) return false

    persistir(CLAVE, filtradas)

    return true
}