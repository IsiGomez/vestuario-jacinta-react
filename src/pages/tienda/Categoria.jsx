import { Link, useParams } from 'react-router-dom'
import { obtenerCategorias } from '../../data/categorias'
import { obtenerProductos, disponiblesPrimero } from '../../data/productos'
import TarjetaProducto from '../../components/TarjetaProducto'
import EncabezadoPagina from '../../components/EncabezadoPagina'

function Categoria() {
    const { categoria } = useParams()
    const nombreCategoria = decodeURIComponent(categoria || '')
    const categorias = obtenerCategorias()
    const categoriaEncontrada = categorias.find(
        (c) => c.nombre.toLowerCase() === nombreCategoria.toLowerCase()
    )

    if (!categoriaEncontrada) {
        return (
            <div className="container py-5 text-center">
                <h2 className="h4 mb-3">Categoría no encontrada</h2>
                <Link to="/categorias" className="btn btn-primary">Volver a categorías</Link>
            </div>
        )
    }

    const productos = disponiblesPrimero(
        obtenerProductos().filter((p) => p.categoriaId === categoriaEncontrada.id)
    )

    return (
        <div className="container pb-4">
            <EncabezadoPagina titulo={categoriaEncontrada.nombre} subtitulo={categoriaEncontrada.descripcion} />
            <nav className="mb-3">
                <Link to="/categorias" className="text-decoration-none">« Volver a categorías</Link>
            </nav>

            {productos.length === 0 ? (
                <div className="alert alert-info">No hay productos disponibles en esta categoría.</div>
            ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                    {productos.map((producto) => (
                        <div className="col" key={producto.id}>
                            <TarjetaProducto producto={producto} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Categoria