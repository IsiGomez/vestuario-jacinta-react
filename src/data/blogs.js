import { leer, guardar, siguienteId, persistir } from '../utils/storage'

const CLAVE = 'jacinta_blogs'

const rutaImagen = (numero) =>
    `${import.meta.env.BASE_URL}assets/img/blog/blog${numero}.jpg`

const blogsIniciales = [
    {
        id: 1,
        titulo: "¿Por qué la polera básica era considerada ropa interior?",
        subtitulo: "Caso Curioso #1 | Historia de la moda",
        extracto: "Antes de ser el básico infalible de cualquier clóset, la polera blanca no podía verse en público y formaba parte del uniforme interior de la Marina.",
        contenido: "A principios del siglo XX, la clásica polera de cuello redondo fue adoptada por la Marina de los Estados Unidos como ropa interior ligera bajo el uniforme naval, con el objetivo de absorber la transpiración y proteger las chaquetas de gala. Mostrarse en público usando únicamente esta prenda se consideraba casi un escándalo social hasta la década de 1950, cuando estrellas de cine como Marlon Brando y James Dean la lucieron con orgullo y rebeldía en la pantalla grande. A partir de ese momento, la polera pasó de ser una pieza oculta a convertirse en el máximo símbolo de estilo juvenil, comodidad y simpleza en todo el mundo. Hoy en Vestuario Jacinta sigue siendo la prenda esencial e insustituible para cualquier momento del día.",
        imagen: rutaImagen(1)
    },
    {
        id: 2,
        titulo: "El verdadero propósito del quinto bolsillo",
        subtitulo: "Caso Curioso #2 | Historia de la moda",
        extracto: "Todos lo hemos visto en el bolsillo derecho de los pantalones de mezclilla, pero su diseño original no estaba pensado para monedas ni encendedores.",
        contenido: "Todos lo hemos visto en el bolsillo derecho de los pantalones de mezclilla, pero su diseño original no estaba pensado para monedas, boletos de transporte ni encendedores. A finales del siglo XIX, durante la época de la fiebre del oro y el surgimiento de los primeros jeans de trabajo, los vaqueros y mineros utilizaban relojes de bolsillo con cadena. Para evitar que estos costosos objetos se rayaran o rompieran al trabajar, se introdujo este diminuto bolsillo cosido específicamente para protegerlos. A pesar de que el uso del reloj de bolsillo desapareció con la llegada de los relojes de pulsera, las principales marcas mantuvieron este detalle como un ícono de diseño y tradición. Hoy en Vestuario Jacinta celebramos estos pequeños detalles que conectan la historia de la indumentaria con las prendas que vestimos a diario.",
        imagen: rutaImagen(2)
    }
]

export function obtenerBlogs() {
    const guardados = leer(CLAVE, null)
    if (guardados === null) {
        const iniciales = structuredClone(blogsIniciales)
        guardar(CLAVE, iniciales)
        return iniciales
    }
    return guardados
}

export function obtenerBlogPorId(id) {
    return obtenerBlogs().find((b) => b.id === Number(id)) ?? null
}

export function crearBlog(datos) {
    const blogs = obtenerBlogs()
    const nuevo = { ...datos, id: siguienteId(blogs) }
    persistir(CLAVE, [...blogs, nuevo])
    return nuevo
}

export function actualizarBlog(id, cambios) {
    const blogs = obtenerBlogs()
    const indice = blogs.findIndex((b) => b.id === Number(id))
    if (indice === -1) return null
    
    const actualizado = { ...blogs[indice], ...cambios, id: blogs[indice].id }
    const copia = [...blogs]
    copia[indice] = actualizado
    persistir(CLAVE, copia)
    return actualizado
}

export function eliminarBlog(id) {
    const blogs = obtenerBlogs()
    const filtrados = blogs.filter((b) => b.id !== Number(id))
    if (filtrados.length === blogs.length) return false
    
    persistir(CLAVE, filtrados)
    return true
}

export function restablecerBlogs() {
    const iniciales = structuredClone(blogsIniciales)
    persistir(CLAVE, iniciales)
    return iniciales
}