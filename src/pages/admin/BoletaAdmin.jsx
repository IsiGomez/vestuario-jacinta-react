import { Link, useParams } from 'react-router-dom'
import { obtenerOrdenPorId, totalOrden } from '../../data/ordenes'
import { formatearPrecio, formatearFecha } from '../../utils/formato'

function BoletaAdmin() {
    const { id } = useParams()
    const orden = obtenerOrdenPorId(id)

    if (!orden) {
        return (
            <div>
                <div className="alert alert-warning">No existe una orden con id {id}.</div>
                <Link to="/admin/ordenes" className="btn btn-outline-secondary">Volver a órdenes</Link>
            </div>
        )
    }

    const { cliente, entrega } = orden

    return (
        <div style={{ maxWidth: '800px' }}>
            <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                    <h1 className="h3 mb-1">Boleta #{orden.numero}</h1>
                    <div className="text-muted">{formatearFecha(orden.fecha)}</div>
                </div>

                <span className={`badge fs-6 ${orden.estado === 'Pagada' ? 'bg-success' : 'bg-danger'}`}>
                    {orden.estado}
                </span>
            </div>

            <div className="row g-3 mb-3">
                <div className="col-md-6">
                    <div className="card h-100">
                        <div className="card-body">
                            <h2 className="h6">Cliente</h2>
                            <div>{cliente.nombre} {cliente.apellidos}</div>
                            <div className="text-muted">{cliente.correo}</div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card h-100">
                        <div className="card-body">
                            <h2 className="h6">Dirección de entrega</h2>
                            
                            <div>
                                {entrega.calle}
                                {entrega.departamento && `, Depto ${entrega.departamento}`}
                            </div>
                            
                            <div className="text-muted">{entrega.comuna}, {entrega.region}</div>
                            {entrega.indicaciones && <div className="small mt-1">{entrega.indicaciones}</div>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table align-middle">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th className="text-end">Precio</th>
                            <th className="text-end">Cantidad</th>
                            <th className="text-end">Subtotal</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orden.items.map((item) => (
                            <tr key={item.productoId}>
                                <td>{item.nombre}</td>
                                <td className="text-end">{formatearPrecio(item.precio)}</td>
                                <td className="text-end">{item.cantidad}</td>
                                <td className="text-end">{formatearPrecio(item.precio * item.cantidad)}</td>
                            </tr>
                        ))}
                    </tbody>

                    <tfoot>
                        <tr>
                            <th colSpan={3} className="text-end">Total</th>
                            <th className="text-end">{formatearPrecio(totalOrden(orden))}</th>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div className="d-flex gap-2">
                <Link to="/admin/ordenes" className="btn btn-outline-secondary">Volver a órdenes</Link>
                
                <button type="button" className="btn btn-primary" onClick={() => window.print()}>
                    <i className="bi bi-printer me-1" /> Imprimir
                </button>
            </div>
        </div>
    )
}

export default BoletaAdmin