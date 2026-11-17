import { useState } from 'react'
import { Link } from 'react-router-dom'
import { obtenerOrdenes, actualizarEstadoOrden } from '../../services/ordenService'
import { useRecurso } from '../../hooks/useRecurso'
import { useAuth } from '../../hooks/useAuth'
import { ESTADOS_ORDEN, COLOR_ESTADO, etiquetaEstado } from '../../utils/estadosOrden'
import { formatearPrecio, formatearFecha } from '../../utils/formato'

function OrdenesAdmin() {
    const { datos, cargando, error: errorCarga, recargar } = useRecurso(obtenerOrdenes)
    const { puede } = useAuth()
    const [filtroEstado, setFiltroEstado] = useState('')
    const [error, setError] = useState('')

    const ordenes = datos ?? []
    const visibles = filtroEstado ? ordenes.filter((o) => o.estado === filtroEstado) : ordenes

    const cambiarEstado = async (id, nuevoEstado) => {
        try {
            await actualizarEstadoOrden(id, nuevoEstado)
            setError('')
        } catch (err) {
            setError(err.message)
        } finally {
            recargar()
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
                        <option key={estado} value={estado}>{etiquetaEstado(estado)}</option>
                    ))}
                </select>
            </div>

            {(error || errorCarga) && <div role="alert" className="alert alert-danger">{error || errorCarga}</div>}
            {cargando && <p role="status">Cargando órdenes...</p>}

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
                                <td className="text-start">{formatearPrecio(o.total)}</td>
                                <td>
                                    <div className="d-flex ordenes-estado">
                                        <select
                                            className={`form-select form-select-sm fw-semibold text-${COLOR_ESTADO[o.estado]} border-${COLOR_ESTADO[o.estado]}`}
                                            value={o.estado}
                                            onChange={(e) => cambiarEstado(o.id, e.target.value)}
                                            disabled={!puede('ordenes:cambiar-estado')}
                                            aria-label="Cambiar estado de orden"
                                        >
                                            {ESTADOS_ORDEN.map((est) => (
                                                <option key={est} value={est} className="text-dark">
                                                    {etiquetaEstado(est)}
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

                        {!cargando && !errorCarga && visibles.length === 0 && (
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