import { Link } from 'react-router-dom'
import { useCarrito } from '../../context/CarritoContext'
import EncabezadoPagina from '../../components/EncabezadoPagina'

function Carrito() {
    const { carrito, quitarCantidad, actualizarCantidad, eliminarProducto, vaciarCarrito, obtenerTotal, disponibleParaAgregar } = useCarrito()

    if (carrito.length === 0) {
        return (
            <div className="container py-5 text-center">
                <h1 className="h3 mb-3">Tu carrito está vacío</h1>
                <p className="text-muted mb-4">Agrega productos desde el catálogo para comenzar tu compra</p>
                <Link to="/productos" className="btn btn-primary">Ir al catálogo</Link>
            </div>
        )
    }

    const total = obtenerTotal()

    return (
        <div className="container pb-4">
            <EncabezadoPagina titulo="Carrito de compras" subtitulo={`${carrito.length} producto(s) en tu carrito`} />
            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-outline-danger" onClick={vaciarCarrito}>
                    Vaciar carrito
                </button>
            </div>

            <div className="row g-4">
                <div className="col-12 col-lg-8">
                    <div className="card shadow-sm">
                        <div className="card-body p-0">
                            {carrito.map((item, idx) => {
                                const subtotal = item.precio * item.cantidad
                                return (
                                    <div key={`${item.id}-${item.talla}-${item.color?.clave}-${idx}`} className="d-flex flex-column flex-md-row gap-3 p-3 border-bottom">
                                        <div className="d-flex justify-content-center align-items-center" style={{ width: '150px', height: '150px' }}>
                                            {item.imagen ? (
                                                <img
                                                    src={item.imagen}
                                                    alt={item.nombre}
                                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                                />
                                            ) : (
                                                <div className="bg-light w-100 h-100 d-flex align-items-center justify-content-center">
                                                    <span className="text-muted small">Sin imagen</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow-1">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <div>
                                                    <h5 className="mb-1">{item.nombre}</h5>
                                                    <p className="text-muted small mb-1">
                                                        {item.color?.nombre && <span>Color: {item.color.nombre}</span>}
                                                        {item.color?.nombre && item.talla && <span> · </span>}
                                                        {item.talla && <span>Talla: {item.talla}</span>}
                                                    </p>
                                                </div>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => eliminarProducto(idx)}>
                                                    Eliminar
                                                </button>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                                <div className="d-flex align-items-center gap-2">
                                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => quitarCantidad(idx, 1)}>
                                                        -
                                                    </button>
                                                    <span className="px-2">{item.cantidad}</span>
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary"
                                                        disabled={disponibleParaAgregar(item.id) <= 0}
                                                        onClick={() => actualizarCantidad(idx, item.cantidad + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <div className="text-end">
                                                    <p className="text-muted small mb-1">${item.precio?.toLocaleString('es-CL')} c/u</p>
                                                    <p className="fw-bold mb-0">${subtotal.toLocaleString('es-CL')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Resumen de compra</h5>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Subtotal</span>
                                <span>${total.toLocaleString('es-CL')}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <span className="text-muted">Envío</span>
                                <span className="text-success">Gratis</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between mb-3">
                                <span className="fw-bold">Total</span>
                                <span className="fw-bold">${total.toLocaleString('es-CL')}</span>
                            </div>
                            <Link to="/checkout" className="btn btn-primary w-100 mb-2">
                                Ir a pagar
                            </Link>
                            <Link to="/productos" className="btn btn-outline-secondary w-100">
                                Seguir comprando
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Carrito