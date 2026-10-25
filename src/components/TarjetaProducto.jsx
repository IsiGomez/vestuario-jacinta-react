import { Link } from 'react-router-dom'

function TarjetaProducto({ producto }) {
    const imagen = producto.colores?.[0]?.imagenes?.[0]
    const agotado = producto.stock <= 0
    const ruta = `/productos/${producto.id}`

    return (
        <div className="card shadow-sm">
            {imagen && (
                <Link to={ruta}>
                    <img
                        src={imagen}
                        alt={producto.nombre}
                        className="card-img-top"
                    />
                    {agotado && <span className="badge bg-dark position-absolute start-0 m-2">Agotado</span>}
                </Link>
            )}
            <div className="card-body d-flex flex-column">
                <h5 className="card-title mb-1">
                    <Link to={ruta} className="text-dark text-decoration-none">
                        {producto.nombre}
                    </Link>
                </h5>
                <p className="text-muted small mb-2">
                    {producto.genero} · {producto.tallas?.join(' / ')}
                </p>
                <div className="mt-auto">
                    <div className="mb-2">
                        <p className="fw-bold mb-0">${producto.precio?.toLocaleString('es-CL')}</p>
                        {agotado && !imagen && <span className="badge bg-dark">Agotado</span>}
                    </div>
                    <Link to={ruta} className={`btn w-100 ${agotado ? 'btn-outline-secondary' : 'btn-primary'}`}>
                        Ver detalle
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default TarjetaProducto