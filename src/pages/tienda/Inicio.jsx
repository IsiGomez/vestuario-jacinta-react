import { Link, useNavigate } from 'react-router-dom'
import { obtenerProductos } from '../../data/productos'

function Inicio() {
    const navigate = useNavigate()

    // Los <Link> son enlaces: con Espacio no se activan (solo con Enter). Esto los hace actuar como botón.
    const activarConEspacio = (ruta) => (e) => {
        if (e.key === ' ') {
            e.preventDefault()
            navigate(ruta)
        }
    }

    const productosDestacados = obtenerProductos()
        .filter((p) => p.stock > 0)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 4)

    return (
        <>
            <section className="hero pt-5 pb-4">
                <div className="container text-center pt-4 pb-2">
                    <h1 className="display-3 fw-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Vestuario Jacinta</h1>
                    <p className="lead text-muted mb-0">Tu clóset ideal para cada momento, desde 1956.</p>
                </div>
            </section>

            <section className="container pt-3 pb-5">
                <header className="titulo-seccion text-center mb-5">
                    <h2 className="h3 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Descubre nuestras novedades</h2>
                    <p className="text-muted mb-0">Vuelta de stock y nueva colección</p>
                </header>
                <div className="row g-4">
                    <div className="col-12 col-lg-6 text-center videos-intro">
                        <h3 className="titulo-video h5 mb-3">Vuelta de stock</h3>
                        <video controls className="w-100 rounded">
                            <source src={`${import.meta.env.BASE_URL}assets/video/back-stock.mp4`} type="video/mp4" />
                            Tu navegador no soporta la reproducción de este video.
                        </video>
                    </div>
                    <div className="col-12 col-lg-6 text-center videos-intro">
                        <h3 className="titulo-video h5 mb-3">Nueva colección</h3>
                        <video controls className="w-100 rounded">
                            <source src={`${import.meta.env.BASE_URL}assets/video/new-collection.mp4`} type="video/mp4" />
                            Tu navegador no soporta la reproducción de este video.
                        </video>
                    </div>
                </div>
            </section>

            <section className="seccion-stock py-5">
                <div className="container">
                    <header className="titulo-stock text-center mb-5">
                        <h2 className="h3 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>¡Se están agotando!</h2>
                        <p className="text-muted mb-0">Los productos con menor stock</p>
                    </header>

                    {productosDestacados.length === 0 ? (
                        <div className="alert alert-info alert-tienda text-center">No hay productos con stock disponible.</div>
                    ) : (
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                            {productosDestacados.map((producto) => {
                                const color = producto.colores?.[0]
                                const imagen = color?.imagenes?.[0]

                                return (
                                    <div className="col" key={producto.id}>
                                        <div className="card h-100 shadow-sm border-0">
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
                                                        <span className="badge bg-danger">¡Quedan {producto.stock}!</span>
                                                    </div>
                                                    <Link to={`/productos/${producto.id}`} role="button" onKeyDown={activarConEspacio(`/productos/${producto.id}`)} className="btn btn-primary btn-tienda w-100">
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
                        <Link to="/productos" role="button" onKeyDown={activarConEspacio('/productos')} className="btn btn-primary btn-tienda btn-lg px-5">
                            Ver todo el catálogo
                        </Link>
                    </div>
                </div>
            </section>

            <footer className="footer py-4">
                <div className="container">
                    <div className="row g-3 text-center">
                        <div className="col-12 col-md-6">
                            <div className="footer-bloque h-100">
                                <h5 className="mb-3">Vestuario Jacinta</h5>
                                <p className="mb-0">Tu clóset ideal para cada momento, desde 1956.</p>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="py-3">
                                <h5 className="mb-3">Síguenos</h5>
                                <div className="footer-redes d-flex justify-content-center gap-3">
                                    <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
                                        <i className="bi bi-instagram" />
                                    </a>
                                    <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook">
                                        <i className="bi bi-facebook" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="my-3" />
                    <p className="text-center mb-0">&copy; {new Date().getFullYear()} Vestuario Jacinta. Todos los derechos reservados.</p>
                </div>
            </footer>
        </>
    )
}

export default Inicio