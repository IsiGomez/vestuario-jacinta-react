import { useState } from 'react'
import { Link } from 'react-router-dom'
import { obtenerOrdenes } from '../../data/ordenes'
import { resumenVentas, productosMasVendidos } from '../../utils/reportes'
import { formatearPrecio } from '../../utils/formato'
import TarjetaResumen from '../../components/TarjetaResumen'

function ReportesAdmin() {
    const [reporte] = useState(() => {
        const ordenes = obtenerOrdenes()

        return {
            ventas: resumenVentas(ordenes),
            masVendidos: productosMasVendidos(ordenes),
        }
    })

    const { ventas, masVendidos } = reporte

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1">Reportes</h1>
                    <p className="text-muted mb-0">Resumen de ventas (solo órdenes pagadas)</p>
                </div>

                <div>
                    <Link to="/admin/reportes/productos" className="btn btn-outline-secondary btn-md">
                        <i className="bi bi-box-seam me-1" /> Ver Reporte de Productos
                    </Link>
                </div>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6 col-lg-3">
                    <TarjetaResumen titulo="Ventas totales" valor={formatearPrecio(ventas.montoTotal)} icono="bi-cash-coin" color="success" />
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                    <TarjetaResumen titulo="Órdenes pagadas" valor={ventas.pagadas} icono="bi-bag-check" color="primary" />
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                    <TarjetaResumen titulo="Ticket promedio" valor={formatearPrecio(ventas.ticketPromedio)} icono="bi-receipt" color="secondary" />
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                    <TarjetaResumen titulo="Pagos fallidos" valor={ventas.fallidas} icono="bi-x-octagon" color="danger" />
                </div>
            </div>

            <hr></hr>

            <h2 className="h5">Productos más vendidos</h2>
            
            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th className="text-end">Unidades vendidas</th>
                            <th className="text-end">Monto</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {masVendidos.map((p) => (
                            <tr key={p.productoId}>
                                <td>{p.nombre}</td>
                                <td className="text-end">{p.unidades}</td>
                                <td className="text-end">{formatearPrecio(p.monto)}</td>
                            </tr>
                        ))}

                        {masVendidos.length === 0 && (
                            <tr>
                                <td colSpan={3} className="text-center text-muted py-4">
                                    Todavía no hay ventas registradas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ReportesAdmin