import { useState } from 'react'
import { Link } from 'react-router-dom'
import { obtenerProductos } from '../../data/productos'

function Productos() {
    const [productos] = useState(obtenerProductos().filter(p => p.stock > 0))

    return (
        <div className="container py-4">
            <header className="mb-4">
                <h1 className="h2 mb-1">Productos</h1>
                <p className="text-muted mb-0">Descubre todas nuestras prendas</p>
            </header>

            {productos.length === 0 ? (
                <div className="alert alert-info">No hay productos disponibles.</div>
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

export default Productos