import { Link } from 'react-router-dom'

function CompraError() {
    return (
        <div className="container py-5 text-center">
            <div className="mb-4">
                <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: '4rem' }}></i>
            </div>
            <h1 className="h3 mb-2">No se pudo realizar el pago</h1>
            <p className="text-muted mb-4">Hubo un problema al procesar tu compra. Por favor, intenta nuevamente.</p>
            <div className="d-flex gap-2 justify-content-center flex-wrap">
                <Link to="/carrito" className="btn btn-primary">Volver al carrito</Link>
                <Link to="/productos" className="btn btn-outline-secondary">Ir al catálogo</Link>
            </div>
        </div>
    )
}

export default CompraError
