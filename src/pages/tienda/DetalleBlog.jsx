import { Link, useParams, Navigate } from 'react-router-dom'
import { obtenerBlogPorId } from '../../data/blogs'

function DetalleBlog() {
    const { id } = useParams()
    const articulo = obtenerBlogPorId(id)

    if (!articulo) {
        return <Navigate to="/blog" replace />
    }

    return (
        <div className="container py-4">
            <nav className="mb-4">
                <Link to="/blog" className="text-decoration-none d-inline-flex align-items-center">« Volver a las noticias</Link>
            </nav>

            <article>
                <header className="mb-4 text-center">
                    <span className="badge bg-secondary mb-2 px-3 py-2">{articulo.subtitulo}</span>
                    <h1 className="display-6 fw-bold" style={{ fontFamily: 'var(--jc-fuente-titulo)' }}>
                        {articulo.titulo}
                    </h1>
                </header>

                <img 
                    src={articulo.imagen} 
                    className="w-100 rounded-3 mb-4" 
                    style={{ height: '450px', objectFit: 'cover', objectPosition: 'top' }}
                    alt={articulo.titulo} 
                />

                <div 
                    className="shadow-sm"
                    style={{
                        backgroundColor: 'var(--jc-durazno-claro)',
                        padding: '25px',
                        lineHeight: '1.8',
                        borderRadius: '10px',
                        textAlign: 'justify',
                        color: 'var(--jc-texto)'
                    }}
                >
                    <p className="mb-0">
                        {articulo.contenido}
                    </p>
                </div>
            </article>
        </div>
    )
}

export default DetalleBlog