import { Link } from 'react-router-dom'
import { obtenerCategorias, contarProductosDeCategoria } from '../../data/categorias'

function Categorias() {
    const categorias = obtenerCategorias()

    return (
        <div className="container py-4">
            <header className="mb-4">
                <h1 className="h2 mb-1">Categorías</h1>
                <p className="text-muted mb-0">Explora nuestros productos por categoría</p>
            </header>

            {categorias.length === 0 ? (
                <div className="alert alert-info">No hay categorías disponibles.</div>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {categorias.map((categoria) => {
                        const cantidad = contarProductosDeCategoria(categoria.id)
                        return (
                            <div className="col" key={categoria.id}>
                                <div className="card h-100 shadow-sm">
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title mb-1">{categoria.nombre}</h5>
                                        {categoria.descripcion && (
                                            <p className="text-muted small mb-2">{categoria.descripcion}</p>
                                        )}
                                        <p className="text-muted small mb-3">{cantidad} producto(s)</p>
                                        <Link
                                            to={`/categorias/${encodeURIComponent(categoria.nombre)}`}
                                            className="btn btn-outline-primary mt-auto"
                                        >
                                            Ver productos
                                        </Link>
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

export default Categorias
