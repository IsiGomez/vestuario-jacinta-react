import { Link, useParams } from 'react-router-dom'

function CompraExitosa() {
    const { ordenId } = useParams()

    return (
        <div className="container py-5 text-center">
            <div className="mb-4">
                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
            </div>
            <h1 className="h3 mb-2">¡Compra exitosa!</h1>
            <p className="text-muted mb-3">Gracias por tu compra. Hemos recibido tu pedido correctamente.</p>
            {ordenId && ordenId !== '0' && (
                <p className="mb-4">N° de orden: <strong>#{ordenId}</strong></p>
            )}
            <div className="d-flex gap-2 justify-content-center flex-wrap">
                <Link to="/productos" className="btn btn-primary">Seguir comprando</Link>
                <Link to="/" className="btn btn-outline-secondary">Volver al inicio</Link>
            </div>
        </div>
    )
}

export default CompraExitosa
