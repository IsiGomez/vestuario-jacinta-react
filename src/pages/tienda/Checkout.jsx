import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCarrito } from '../../context/CarritoContext'
import { useAuth } from '../../hooks/useAuth'
import { crearOrden } from '../../data/ordenes'

const OPCIONES_ENTREGA = [
    { id: 'domicilio', nombre: 'Despacho a domicilio', costo: 0 },
    { id: 'retiro', nombre: 'Retiro en tienda', costo: 0 },
]

function Checkout() {
    const { carrito, obtenerTotal, vaciarCarrito } = useCarrito()
    const { usuario } = useAuth()
    const navigate = useNavigate()

    const [datos, setDatos] = useState({
        nombre: usuario?.nombre || '',
        correo: usuario?.correo || '',
        telefono: usuario?.telefono || '',
        direccion: usuario?.direccion || '',
        region: usuario?.region || '',
        comuna: usuario?.comuna || '',
        entrega: 'domicilio',
        notas: '',
    })

    const [errores, setErrores] = useState({})

    if (carrito.length === 0) {
        return (
            <div className="container py-5 text-center">
                <h2 className="h4 mb-3">No hay productos en el carrito</h2>
                <Link to="/productos" className="btn btn-primary">Ir al catálogo</Link>
            </div>
        )
    }

    const total = obtenerTotal()

    const cambiar = (e) => {
        const { name, value } = e.target
        setDatos((prev) => ({ ...prev, [name]: value }))
        setErrores((prev) => ({ ...prev, [name]: '' }))
    }

    const validar = () => {
        const nuevosErrores = {}
        if (!datos.nombre.trim()) nuevosErrores.nombre = 'Ingresa tu nombre'
        if (!datos.correo.trim()) nuevosErrores.correo = 'Ingresa tu correo'
        else if (!/\S+@\S+\.\S+/.test(datos.correo)) nuevosErrores.correo = 'Correo inválido'
        if (!datos.telefono.trim()) nuevosErrores.telefono = 'Ingresa tu teléfono'
        if (datos.entrega === 'domicilio') {
            if (!datos.direccion.trim()) nuevosErrores.direccion = 'Ingresa tu dirección'
            if (!datos.region.trim()) nuevosErrores.region = 'Ingresa tu región'
            if (!datos.comuna.trim()) nuevosErrores.comuna = 'Ingresa tu comuna'
        }
        setErrores(nuevosErrores)
        return Object.keys(nuevosErrores).length === 0
    }

    const finalizar = (e) => {
        e.preventDefault()
        if (!validar()) return

        try {
            const orden = crearOrden({
                usuarioId: usuario?.id || null,
                items: carrito.map((item) => ({
                    productoId: item.id,
                    nombre: item.nombre,
                    precio: item.precio,
                    cantidad: item.cantidad,
                    talla: item.talla,
                    color: item.color?.nombre,
                    imagen: item.imagen,
                })),
                total,
                datosEntrega: datos,
                estado: 'Pendiente',
            })
            vaciarCarrito()
            navigate(`/compra/exitosa/${orden.id}`)
        } catch (error) {
            navigate('/compra/error/0')
        }
    }

    return (
        <div className="container py-4">
            <nav className="mb-3">
                <Link to="/carrito" className="text-decoration-none">&larr; Volver al carrito</Link>
            </nav>
            <header className="mb-4">
                <h1 className="h3 mb-1">Checkout - Paso de pago</h1>
                <p className="text-muted mb-0">Ingresa tus datos y selecciona la opción de entrega</p>
            </header>

            <div className="row g-4">
                <div className="col-12 col-lg-8">
                    <form onSubmit={finalizar}>
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h5 className="card-title mb-3">Datos del cliente</h5>
                                <div className="row g-3">
                                    <div className="col-12 col-md-6">
                                        <label className="form-label">Nombre completo</label>
                                        <input type="text" className={`form-control ${errores.nombre ? 'is-invalid' : ''}`} name="nombre" value={datos.nombre} onChange={cambiar} />
                                        {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className="form-label">Correo electrónico</label>
                                        <input type="email" className={`form-control ${errores.correo ? 'is-invalid' : ''}`} name="correo" value={datos.correo} onChange={cambiar} />
                                        {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className="form-label">Teléfono</label>
                                        <input type="tel" className={`form-control ${errores.telefono ? 'is-invalid' : ''}`} name="telefono" value={datos.telefono} onChange={cambiar} />
                                        {errores.telefono && <div className="invalid-feedback">{errores.telefono}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h5 className="card-title mb-3">Opción de entrega</h5>
                                <div className="d-flex flex-column gap-2 mb-3">
                                    {OPCIONES_ENTREGA.map((opcion) => (
                                        <div className="form-check" key={opcion.id}>
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="entrega"
                                                id={opcion.id}
                                                value={opcion.id}
                                                checked={datos.entrega === opcion.id}
                                                onChange={cambiar}
                                            />
                                            <label className="form-check-label" htmlFor={opcion.id}>
                                                {opcion.nombre}
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                {datos.entrega === 'domicilio' && (
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label className="form-label">Dirección de envío</label>
                                            <input type="text" className={`form-control ${errores.direccion ? 'is-invalid' : ''}`} name="direccion" value={datos.direccion} onChange={cambiar} />
                                            {errores.direccion && <div className="invalid-feedback">{errores.direccion}</div>}
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <label className="form-label">Región</label>
                                            <input type="text" className={`form-control ${errores.region ? 'is-invalid' : ''}`} name="region" value={datos.region} onChange={cambiar} />
                                            {errores.region && <div className="invalid-feedback">{errores.region}</div>}
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <label className="form-label">Comuna</label>
                                            <input type="text" className={`form-control ${errores.comuna ? 'is-invalid' : ''}`} name="comuna" value={datos.comuna} onChange={cambiar} />
                                            {errores.comuna && <div className="invalid-feedback">{errores.comuna}</div>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h5 className="card-title mb-3">Notas (opcional)</h5>
                                <textarea className="form-control" name="notas" rows="3" value={datos.notas} onChange={cambiar} placeholder="Indicaciones para la entrega"></textarea>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg w-100">
                            Confirmar compra
                        </button>
                    </form>
                </div>

                <div className="col-12 col-lg-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Resumen de compra</h5>
                            {carrito.map((item, idx) => (
                                <div key={idx} className="d-flex gap-2 mb-2">
                                    <div style={{ width: '60px', height: '60px' }}>
                                        {item.imagen && <img src={item.imagen} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="mb-0 small fw-semibold">{item.nombre}</p>
                                        <p className="mb-0 small text-muted">{item.cantidad} x ${item.precio?.toLocaleString('es-CL')}</p>
                                        {item.talla && <p className="mb-0 small text-muted">Talla: {item.talla}</p>}
                                    </div>
                                </div>
                            ))}
                            <hr />
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Subtotal</span>
                                <span>${total.toLocaleString('es-CL')}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <span className="text-muted">Envío</span>
                                <span className="text-success">Gratis</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between">
                                <span className="fw-bold">Total</span>
                                <span className="fw-bold">${total.toLocaleString('es-CL')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout
