import { color, TALLAS } from '../../utils/catalogo'

const base = { categoriaId: 1, stockCritico: 5, tallas: TALLAS, activo: true }

export const camisaCortaHombre = {
    ...base, id: 1, nombre: 'Camisa manga corta hombre', genero: 'hombre', tipo: 'cam_corta',
    precio: 14990, stock: 25, descripcion: 'Camisa de manga corta, corte cómodo para el día a día.',
    colores: [color('hombre', 'cam_corta', 'Azul', 'azul'), color('hombre', 'cam_corta', 'Rojo', 'rojo')],
}
export const camisaLargaHombre = {
    ...base, id: 2, nombre: 'Camisa manga larga hombre', genero: 'hombre', tipo: 'cam_larga',
    precio: 17990, stock: 3, descripcion: 'Camisa de manga larga, ideal para looks casuales.',
    colores: [color('hombre', 'cam_larga', 'Gris', 'gris'), color('hombre', 'cam_larga', 'Negro', 'negro')],
}
export const camisaCortaMujer = {
    ...base, id: 3, nombre: 'Camisa manga corta mujer', genero: 'mujer', tipo: 'cam_corta',
    precio: 14990, stock: 12, descripcion: 'Camisa de manga corta, liviana y fresca.',
    colores: [color('mujer', 'cam_corta', 'Celeste', 'celeste')],
}
export const camisaLargaMujer = {
    ...base, id: 4, nombre: 'Camisa manga larga mujer', genero: 'mujer', tipo: 'cam_larga',
    precio: 17990, stock: 8, descripcion: 'Camisa de manga larga en un negro versátil.',
    colores: [color('mujer', 'cam_larga', 'Negro', 'negro')],
}

export const productosIniciales = [camisaCortaHombre, camisaLargaHombre, camisaCortaMujer, camisaLargaMujer]
export const categoriasIniciales = [{ id: 1, nombre: 'Camisas', descripcion: 'Camisas', productos: 4 }]