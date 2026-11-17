const rutaImagen = (genero, tipo, clave, n) =>
`${import.meta.env.BASE_URL}assets/img/productos/${genero}/${tipo}/${clave}_${n}.jpg`

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

export const disponiblesPrimero = (productos) =>
    [...productos].sort((a, b) => Number(a.stock <= 0) - Number(b.stock <= 0))