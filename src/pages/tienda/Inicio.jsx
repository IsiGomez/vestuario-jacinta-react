import { Link } from 'react-router-dom'
import { obtenerProductos } from '../../data/productos'
import Footer from '../../components/Footer'
import TarjetaProducto from '../../components/TarjetaProducto'

function Inicio() {

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
                            {productosDestacados.map((producto) => (
                                <div className="col" key={producto.id}>
                                    <TarjetaProducto producto={producto} mostrarStock />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-5">
                        <Link to="/productos" role="button" className="btn btn-primary btn-tienda btn-lg px-5">
                            Ver todo el catálogo
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    )
}

export default Inicio