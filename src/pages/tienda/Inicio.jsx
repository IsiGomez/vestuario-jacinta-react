import { Link } from 'react-router-dom'
import { obtenerProductos } from '../../data/productos'

function Inicio() {
    const productosDestacados = obtenerProductos()
        .filter((p) => p.stock > 0)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 4)

    return (
        <>
            <section className="bg-light py-5">
                <div className="container text-center">
                    <h1 className="display-4 fw-bold mb-3">Vestuario Jacinta</h1>
                    <p className="lead text-muted mb-4">Tu clóset ideal para cada momento</p>
                    <Link to="/productos" className="btn btn-primary btn-lg px-4">
                        Ver catálogo
                    </Link>
                </div>
            </section>

            <section className="container py-5">
                <div className="row g-4">
                    <div className="col-12 col-md-6">
                        <div className="text-center">
                            <h2 className="h4 mb-3">Vuelta de stock</h2>
                            <video controls className="w-100 rounded shadow-sm">
                                <source src="/assets/video/back-stock.mp4" type="video/mp4" />
                                Tu navegador no soporta la reproducción de este video.
                            </video>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="text-center">
                            <h2 className="h4 mb-3">Nueva colección</h2>
                            <video controls className="w-100 rounded shadow-sm">
                                <source src="/assets/video/new-collection.mp4" type="video/mp4" />
                                Tu navegador no soporta la reproducción de este video.
                            </video>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container py-5">
                <header className="text-center mb-4">
                    <h2 className="h3 mb-2">Productos más solicitados</h2>
                    <p className="text-muted mb-0">Los que se están agotando más rápido</p>
                </header>

                {productosDestacados.length === 0 ? (
                    <div className="alert alert-info text-center">No hay productos con stock disponible.</div>
                ) : (
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                        {productosDestacados.map((producto) => {
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
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <p className="fw-bold mb-0">${producto.precio?.toLocaleString('es-CL')}</p>
                                                    <span className="badge bg-warning text-dark">¡Quedan {producto.stock}!</span>
                                                </div>
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

                <div className="text-center mt-5">
                    <Link to="/productos" className="btn btn-outline-primary btn-lg px-4">
                        Ver todo el catálogo
                    </Link>
                </div>
            </section>
        </>
    )
}

export default Inicio
