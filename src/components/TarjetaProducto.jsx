import { Link } from 'react-router-dom'

function TarjetaProducto({ producto, mostrarStock = false }) {
    const imagen = producto.colores?.[0]?.imagenes?.[0]
    const agotado = producto.stock <= 0
    const ruta = `/productos/${producto.id}`

    return (
        <div className={`producto${agotado ? ' producto-agotado' : ''}`}>
            {imagen && (
                <Link to={ruta} className="producto-imagen">
                    <img src={imagen} alt={producto.nombre} />
                    {agotado && <span className="badge bg-dark position-absolute start-0 m-2">Agotado</span>}
                    {mostrarStock && !agotado && (
                        <span className="badge bg-danger position-absolute end-0 m-2">¡Quedan {producto.stock}!</span>
                    )}
                </Link>
            )}
            
            <h3 className="producto-nombre">
                <Link to={ruta}>{producto.nombre}</Link>
            </h3>
            <p className="producto-info">
                {producto.genero} · {producto.tallas?.join(' / ')}
            </p>
            <p className="producto-precio">${producto.precio?.toLocaleString('es-CL')}</p>
            {agotado && !imagen && <span className="badge bg-dark mb-2">Agotado</span>}
            <Link
                to={ruta}
                className={`btn w-100 mt-auto stretched-link ${agotado ? 'btn-outline-secondary' : 'btn-primary btn-tienda'}`}
            >
                Ver detalle
            </Link>
        </div>
    )
}

export default TarjetaProducto