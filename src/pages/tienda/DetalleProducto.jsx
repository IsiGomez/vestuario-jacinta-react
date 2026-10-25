import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { obtenerProductoPorId } from '../../data/productos'
import { useCarrito } from '../../context/CarritoContext'

function DetalleProducto() {
    const { id } = useParams()
    const producto = obtenerProductoPorId(id)
    const { agregarProducto, disponibleParaAgregar, unidadesEnCarrito } = useCarrito()

    const [colorSeleccionado, setColorSeleccionado] = useState(0)
    const [tallaSeleccionada, setTallaSeleccionada] = useState(null)
    const [imagenActiva, setImagenActiva] = useState(0)
    const [cantidad, setCantidad] = useState(1)
    const [mensaje, setMensaje] = useState(null)

    useEffect(() => {
        setImagenActiva(0)
    }, [colorSeleccionado, id])

    if (!producto) {
        return (
            <div className="container py-5 text-center">
                <h2 className="h4 mb-3">Producto no encontrado</h2>
                <Link to="/productos" className="btn btn-primary">Volver al catálogo</Link>
            </div>
        )
    }

    const colores = producto.colores || []
    const colorActual = colores[colorSeleccionado]
    const imagenes = colorActual?.imagenes || []
    const tallas = producto.tallas || []

    const tallaActual = tallaSeleccionada ?? tallas[0] ?? null

    // El stock es por producto: se descuenta lo que ya hay en el carrito (de cualquier talla o color)
    const disponible = disponibleParaAgregar(producto.id)
    const enCarrito = unidadesEnCarrito(producto.id)
    const cantidadElegida = Math.min(Math.max(cantidad, 1), Math.max(disponible, 1))

    const cambiarCantidad = (valor) =>
        setCantidad(Math.min(Math.max(Math.floor(Number(valor)) || 1, 1), disponible))

    const agregar = () => {
        if (tallas.length > 0 && !tallaActual) {
            setMensaje({ tipo: 'warning', texto: 'Selecciona una talla' })
            return
        }

        agregarProducto(producto, cantidadElegida, tallaActual, colorActual)
        setMensaje({
            tipo: 'success',
            texto: cantidadElegida === 1 ? 'Producto agregado al carrito.' : `${cantidadElegida} unidades agregadas al carrito.`,
        })
        setCantidad(1)
    }

    const cambiarColor = (idx) => {
        setColorSeleccionado(idx)
        setImagenActiva(0)
    }

    const irAnterior = () => {
        setImagenActiva((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1))
    }

    const irSiguiente = () => {
        setImagenActiva((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1))
    }

    return (
        <div className="container py-4">
            <nav className="mb-3">
                <Link to="/productos" className="text-decoration-none">« Volver al catálogo</Link>
            </nav>

            <div className="row g-4">
                <div className="col-12 col-md-6">
                    {imagenes.length > 0 ? (
                        <div>
                            <div
                                className="position-relative d-flex align-items-center justify-content-center bg-white border rounded"
                                style={{ height: '500px', overflow: 'hidden' }}
                            >
                                <img
                                    src={imagenes[imagenActiva]}
                                    alt={`${producto.nombre} - ${colorActual?.nombre} - vista ${imagenActiva + 1}`}
                                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                                />
                                {imagenes.length > 1 && (
                                    <>
                                        <button
                                            className="btn btn-light position-absolute start-0 ms-2"
                                            onClick={irAnterior}
                                            aria-label="Imagen anterior"
                                        >
                                            &#10094;
                                        </button>
                                        <button
                                            className="btn btn-light position-absolute end-0 me-2"
                                            onClick={irSiguiente}
                                            aria-label="Imagen siguiente"
                                        >
                                            &#10095;
                                        </button>
                                    </>
                                )}
                            </div>
                            {imagenes.length > 1 && (
                                <div className="d-flex gap-2 mt-2 flex-wrap justify-content-center">
                                    {imagenes.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setImagenActiva(idx)}
                                            className={`border rounded p-0 ${idx === imagenActiva ? 'border-primary' : 'border-secondary'}`}
                                            style={{ background: 'white' }}
                                        >
                                            <img
                                                src={img}
                                                alt={`Miniatura ${idx + 1}`}
                                                style={{ width: '70px', height: '70px', objectFit: 'contain' }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-light d-flex align-items-center justify-content-center border rounded" style={{ height: '500px' }}>
                            <span className="text-muted">Sin imagen</span>
                        </div>
                    )}
                </div>

                <div className="col-12 col-md-6">
                    <h1 className="h3 mb-2">{producto.nombre}</h1>
                    <p className="text-muted mb-2 text-capitalize">{producto.genero} · {producto.tipo?.replace('_', ' ')}</p>
                    <p className="h4 fw-bold mb-3">${producto.precio?.toLocaleString('es-CL')}</p>
                    
                    {producto.descripcion && <p className="mb-3">{producto.descripcion}</p>}

                    {colores.length > 1 && (
                        <div className="mb-3">
                            <p className="fw-semibold mb-2">Color: {colorActual?.nombre}</p>
                            <div className="d-flex gap-2">
                                {colores.map((c, idx) => (
                                    <button
                                        key={idx}
                                        className={`btn btn-sm ${idx === colorSeleccionado ? 'btn-primary' : 'btn-outline-secondary'}`}
                                        onClick={() => cambiarColor(idx)}
                                    >
                                        {c.nombre}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {colores.length === 1 && (
                        <div className="mb-3">
                            <p className="fw-semibold mb-2">Color: {colorActual?.nombre}</p>
                        </div>
                    )}

                    {tallas.length > 0 && (
                        <div className="mb-3">
                            <p className="fw-semibold mb-2">Talla</p>
                            <div className="d-flex gap-2 flex-wrap">
                                {tallas.map((talla) => (
                                    <button
                                        key={talla}
                                        className={`btn btn-sm ${tallaActual === talla ? 'btn-primary' : 'btn-outline-secondary'}`}
                                        onClick={() => setTallaSeleccionada(talla)}
                                    >
                                        {talla}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <p className="mb-3">
                        <span className={`badge ${producto.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                            {producto.stock > 0 ? `Stock: ${producto.stock}` : 'Agotado'}
                        </span>
                        {enCarrito > 0 && <span className="text-muted small ms-2">Ya tienes {enCarrito} en tu carrito</span>}
                    </p>

                    {disponible > 0 && (
                        <div className="mb-3">
                            <label htmlFor="cantidad" className="fw-semibold mb-2 d-block">Cantidad</label>
                            <div className="input-group" style={{ maxWidth: '10rem' }}>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    aria-label="Disminuir cantidad"
                                    disabled={cantidadElegida <= 1}
                                    onClick={() => cambiarCantidad(cantidadElegida - 1)}
                                >
                                    &minus;
                                </button>
                                <input
                                    id="cantidad"
                                    type="number"
                                    className="form-control text-center"
                                    min={1}
                                    max={disponible}
                                    value={cantidadElegida}
                                    onChange={(e) => cambiarCantidad(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    aria-label="Aumentar cantidad"
                                    disabled={cantidadElegida >= disponible}
                                    onClick={() => cambiarCantidad(cantidadElegida + 1)}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    )}

                    {mensaje && (
                        <div className={`alert alert-${mensaje.tipo}`} role="alert">
                            {mensaje.texto}{' '}
                            {mensaje.tipo === 'success' && <Link to="/carrito" className="alert-link">Ver carrito</Link>}
                        </div>
                    )}

                    <button
                        className="btn btn-primary btn-lg w-100"
                        disabled={disponible === 0}
                        onClick={agregar}
                    >
                        {producto.stock === 0
                            ? 'Agotado'
                            : disponible === 0
                                ? 'Ya tienes todo el stock en tu carrito'
                                : 'Agregar al carrito'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DetalleProducto