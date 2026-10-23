import { useState } from 'react'
import { Link } from 'react-router-dom'
import { obtenerOrdenes, totalOrden, ESTADOS_ORDEN, actualizarEstadoOrden } from '../../data/ordenes'
import { formatearPrecio, formatearFecha } from '../../utils/formato'

function OrdenesAdmin() {
    const [ordenes, setOrdenes] = useState(() => [...obtenerOrdenes()].sort((a, b) => b.fecha.localeCompare(a.fecha)))
    const [filtroEstado, setFiltroEstado] = useState('')
    const [error, setError] = useState('')

    const visibles = filtroEstado ? ordenes.filter((o) => o.estado === filtroEstado) : ordenes

    const cambiarEstado = (id, nuevoEstado) => {
        try {
            actualizarEstadoOrden(id, nuevoEstado)
            setOrdenes([...obtenerOrdenes()].sort((a, b) => b.fecha.localeCompare(a.fecha)))
            setError('')
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="pagina">
            <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
                <h1 className="h3 mb-0">Órdenes / Boletas</h1>

                <select
                    className="form-select form-select-sm w-auto"
                    aria-label="Filtrar por estado"
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                >
                    <option value="">Todos los estados</option>
                    {ESTADOS_ORDEN.map((estado) => (
                        <option key={estado} value={estado}>{estado}</option>
                    ))}
                </select>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead>
                        <tr>
                            <th>N° Orden</th>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th className="text-start">Total</th>
                            <th className="text-center">Estado</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibles.map((o) => (
                            <tr key={o.id}>
                                <td className='fw-semibold'>#{o.numero}</td>
                                <td>{formatearFecha(o.fecha)}</td>
                                <td>
                                    {o.cliente.nombre} {o.cliente.apellidos}
                                    <div className="small text-muted">{o.cliente.correo}</div>
                                </td>
                                <td className="text-start">{formatearPrecio(totalOrden(o))}</td>
                                <td>
                                    <div className="d-flex ordenes-estado">
                                        <select
                                            className={`form-select form-select-sm fw-semibold ${
                                                o.estado === 'Pagada' 
                                                    ? 'text-success border-success' 
                                                    : o.estado === 'Pago fallido' 
                                                    ? 'text-danger border-danger' 
                                                    : 'text-warning border-warning'
                                            }`}
                                            value={o.estado}
                                            onChange={(e) => cambiarEstado(o.id, e.target.value)}
                                            aria-label="Cambiar estado de orden"
                                        >
                                            {ESTADOS_ORDEN.map((est) => (
                                                <option key={est} value={est} className="text-dark">
                                                    {est}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </td>
                                <td className="text-end">
                                    <Link to={`/admin/ordenes/${o.id}`} className="btn btn-outline-secondary btn-sm w-100">
                                        Ver boleta
                                    </Link>
                                </td>
                            </tr>
                        ))}

                        {visibles.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center text-muted py-4">
                                    No hay órdenes para mostrar.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default OrdenesAdmin