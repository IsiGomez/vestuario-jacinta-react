import { Link, useParams } from 'react-router-dom'
import { obtenerUsuarioPorId } from '../../data/usuarios'
import { obtenerOrdenesDeUsuario, totalOrden } from '../../data/ordenes'
import { formatearPrecio, formatearFecha } from '../../utils/formato'
import TarjetaResumen from '../../components/TarjetaResumen'

function HistorialCompras() {
    const { id } = useParams()
    const usuario = obtenerUsuarioPorId(id)

    if (!usuario) {
        return (
            <div>
                <div className="alert alert-warning">No existe un usuario con id {id}.</div>
                <Link to="/admin/usuarios" className="btn btn-outline-secondary">Volver a usuarios</Link>
            </div>
        )
    }

    const ordenes = obtenerOrdenesDeUsuario(usuario).sort((a, b) => b.fecha.localeCompare(a.fecha))
    const pagadas = ordenes.filter((o) => o.estado === 'Pagada')
    const totalGastado = pagadas.reduce((suma, o) => suma + totalOrden(o), 0)

    return (
        <div className="pagina">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h1 className="h3 mb-0">Historial de compras</h1>
                    <div className="text-muted">{usuario.nombre} {usuario.apellidos} · {usuario.correo}</div>
                </div>

                <Link to="/admin/usuarios" className="btn btn-outline-secondary btn-sm">
                    <i className="bi bi-arrow-left me-1" /> Volver a usuarios
                </Link>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                    <TarjetaResumen titulo="Compras pagadas" valor={pagadas.length} icono="bi-bag-check" color="success" />
                </div>
                <div className="col-12 col-md-6">
                    <TarjetaResumen titulo="Total gastado" valor={formatearPrecio(totalGastado)} icono="bi-cash-coin" color="primary" />
                </div>
            </div>

            {ordenes.length === 0 ? (
                <div className="alert alert-info">Este usuario todavía no tiene compras.</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead>
                            <tr>
                                <th>N°</th>
                                <th>Fecha</th>
                                <th>Total</th>
                                <th>Estado</th>
                                <th className="text-end">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {ordenes.map((o) => (
                                <tr key={o.id}>
                                    <td>#{o.numero}</td>
                                    <td>{formatearFecha(o.fecha)}</td>
                                    <td>{formatearPrecio(totalOrden(o))}</td>
                                    <td>
                                        <span className={`badge text-bg-${o.estado === 'Pagada' ? 'success' : o.estado === 'Pago fallido' ? 'danger' : 'warning'}`}>
                                            {o.estado}
                                        </span>
                                    </td>
                                    <td className="text-end">
                                        <Link to={`/admin/ordenes/${o.id}`} className="btn btn-outline-secondary btn-sm">
                                            Ver boleta
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default HistorialCompras