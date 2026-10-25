import { Link, useParams } from 'react-router-dom'
import { obtenerCategorias } from '../../data/categorias'
import { obtenerProductos } from '../../data/productos'

function Categoria() {
    const { categoria } = useParams()
    const nombreCategoria = decodeURIComponent(categoria || '')
    const categorias = obtenerCategorias()
    const categoriaEncontrada = categorias.find(
        (c) => c.nombre.toLowerCase() === nombreCategoria.toLowerCase()
    )
    const productos = obtenerProductos().filter(
        (p) => categoriaEncontrada && p.categoriaId === categoriaEncontrada.id && p.stock > 0
    )

    if (!categoriaEncontrada) {
        return (
            <div className="container py-5 text-center">
                <h2 className="h4 mb-3">Categoría no encontrada</h2>
                <Link to="/categorias" className="btn btn-primary">Volver a categorías</Link>
            </div>
        )
    }

    return (
        <div className="container py-4">
            <nav className="mb-3">
                <Link to="/categorias" className="text-decoration-none">&larr; Volver a categorías</Link>
            </nav>
            <header className="mb-4">
                <h1 className="h2 mb-1">{categoriaEncontrada.nombre}</h1>
                {categoriaEncontrada.descripcion && (
                    <p className="text-muted mb-0">{categoriaEncontrada.descripcion}</p>
                )}
            </header>

            {productos.length === 0 ? (
                <div className="alert alert-info">No hay productos disponibles en esta categoría.</div>
            ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                    {productos.map((producto) => {
                        const color = producto.colores?.[0]
                        const imagen = color?.imagenes?.[0]
                        return (
                            <div className="col" key={producto.id}>
                                <div className="card h-100 shadow-sm">
                                    {imagen && (
                                        <Link to={`/productos/${producto.id}`} className="text-decoration-none">
                                            <img
                                                src={imagen}
                                                alt={producto.nombre}
                                                className="card-img-top"
                                                style={{ objectFit: 'cover', height: '280px' }}
                                            />
                                        </Link>
                                    )}
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title mb-1">
                                            <Link to={`/productos/${producto.id}`} className="text-dark text-decoration-none">
                                                {producto.nombre}
                                            </Link>
                                        </h5>
                                        <p className="text-muted small mb-2">
                                            {producto.genero} · {producto.tallas?.join(' / ')}
                                        </p>
                                        <div className="mt-auto">
                                            <p className="fw-bold mb-2">${producto.precio?.toLocaleString('es-CL')}</p>
                                            <Link to={`/productos/${producto.id}`} className="btn btn-primary w-100">
                                                Ver detalle
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default Categoria
