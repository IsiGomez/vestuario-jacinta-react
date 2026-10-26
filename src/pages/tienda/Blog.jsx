import { Link } from 'react-router-dom'
import { obtenerBlogs } from '../../data/blogs'
import EncabezadoPagina from '../../components/EncabezadoPagina'

function Blog() {
    const blogs = obtenerBlogs()

    return (
        <div className="container pb-4">
            <EncabezadoPagina titulo="Blog" subtitulo="Noticias y curiosidades: historias, datos y tendencias de nuestra tienda" />

            {blogs.length === 0 ? (
                <div className="alert alert-info text-center">No hay artículos disponibles en el blog.</div>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 g-4">
                    {blogs.map((articulo) => (
                        <div className="col" key={articulo.id}>
                            <div className="card h-100 shadow-sm border-0">
                                <img 
                                    src={articulo.imagen} 
                                    className="card-img-top" 
                                    style={{ height: '250px', objectFit: 'cover', objectPosition: 'top' }}
                                    alt={articulo.titulo} 
                                />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title fw-bold mb-2" style={{ fontFamily: 'var(--jc-fuente-titulo)' }}>
                                        {articulo.titulo}
                                    </h5>
                                    <p className="card-text text-muted flex-grow-1">{articulo.extracto}</p>
                                    <Link to={`/blog/${articulo.id}`} className="btn btn-outline-primary mt-3 align-self-start">
                                        Leer artículo completo <i className="bi bi-arrow-right ms-1"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Blog