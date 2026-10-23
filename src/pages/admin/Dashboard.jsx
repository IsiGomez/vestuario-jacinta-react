import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { obtenerOrdenes, totalOrden } from '../../data/ordenes'
import { obtenerProductos } from '../../data/productos'
import { obtenerUsuarios } from '../../data/usuarios'
import {
    resumenVentas,
    resumenInventario,
    productosMasVendidos,
    ordenesPorEstado,
    ventasPorMes,
} from '../../utils/reportes'
import { formatearPrecio, formatearFecha } from '../../utils/formato'
import TarjetaResumen from '../../components/TarjetaResumen'

const COLOR_ESTADO = {
    'Pagada': 'success',
    'Pago fallido': 'danger',
    'Pendiente': 'warning',
}

function Dashboard() {
    const { usuario } = useAuth()

    const [datos] = useState(() => {
        const ordenes = obtenerOrdenes()
        const productos = obtenerProductos()

        return {
            totalOrdenes: ordenes.length,
            ventas: resumenVentas(ordenes),
            inventario: resumenInventario(productos),
            porMes: ventasPorMes(ordenes, 6),
            porEstado: ordenesPorEstado(ordenes),
            masVendidos: productosMasVendidos(ordenes, 3),
            clientes: obtenerUsuarios().filter((u) => u.tipoUsuario === 'Cliente').length,
            recientes: [...ordenes].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 5),
            criticos: productos
                .filter((p) => p.stock <= p.stockCritico)
                .sort((a, b) => a.stock - b.stock)
                .slice(0, 5),
        }
    })

    const { totalOrdenes, ventas, inventario, porMes, porEstado, masVendidos, clientes, recientes, criticos } = datos
    const maxMonto = Math.max(...porMes.map((m) => m.monto), 1)

    return (
        <div className="pagina">
            <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1">Hola, {usuario.nombre}</h1>
                    <p className="text-muted mb-0">Resumen general de la tienda</p>
                </div>

                <div className="d-flex gap-2">
                    <Link to="/admin/productos/nuevo" className="btn btn-outline-secondary btn-sm">
                        <i className="bi bi-plus-lg me-1" /> Nuevo producto
                    </Link>
                    <Link to="/admin/ordenes" className="btn btn-outline-secondary btn-sm">
                        <i className="bi bi-receipt me-1" /> Ver órdenes
                    </Link>
                </div>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6 col-xl-3">
                    <TarjetaResumen
                        titulo="Ventas totales"
                        valor={formatearPrecio(ventas.montoTotal)}
                        icono="bi-cash-coin"
                        color="success"
                        detalle={`Ticket promedio ${formatearPrecio(ventas.ticketPromedio)}`}
                    />
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <TarjetaResumen
                        titulo="Órdenes"
                        valor={totalOrdenes}
                        icono="bi-receipt"
                        color="primary"
                        detalle={`${ventas.pagadas} pagadas · ${ventas.pendientes} pendientes · ${ventas.fallidas} fallidas`}
                    />
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <TarjetaResumen
                        titulo="Productos críticos"
                        valor={inventario.criticos}
                        icono="bi-exclamation-triangle"
                        color="danger"
                        detalle={`de ${inventario.totalProductos} productos`}
                    />
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <TarjetaResumen
                        titulo="Clientes"
                        valor={clientes}
                        icono="bi-people"
                        color="secondary"
                        detalle="Usuarios registrados"
                    />
                </div>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-12 col-lg-8">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h2 className="h6 mb-3">Ventas de los últimos 6 meses</h2>

                            <div className="dash-grafico d-flex gap-2 align-items-end">
                                {porMes.map((m) => (
                                    <div
                                        key={m.clave}
                                        className="dash-col flex-fill text-center"
                                        title={`${m.ordenes} orden(es) pagada(s)`}
                                    >
                                        <div className="dash-valor small text-muted text-truncate">
                                            {m.monto > 0 ? formatearPrecio(m.monto) : '—'}
                                        </div>
                                        <div className="dash-area d-flex align-items-end justify-content-center">
                                            {m.monto > 0 && (
                                                <div
                                                    className="dash-barra bg-primary rounded-top w-100"
                                                    style={{ height: `${Math.max((m.monto / maxMonto) * 100, 4)}%` }}
                                                />
                                            )}
                                        </div>
                                        <div className="small fw-semibold text-capitalize mt-1">{m.etiqueta}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h2 className="h6 mb-3">Órdenes por estado</h2>

                            {totalOrdenes === 0 ? (
                                <p className="text-muted small mb-0">Todavía no hay órdenes.</p>
                            ) : (
                                <>
                                    <div className="progress dash-progreso mb-3">
                                        {porEstado.map((e) => (
                                            <div
                                                key={e.estado}
                                                className={`progress-bar bg-${COLOR_ESTADO[e.estado]}`}
                                                style={{ width: `${(e.cantidad / totalOrdenes) * 100}%` }}
                                                title={`${e.estado}: ${e.cantidad}`}
                                            />
                                        ))}
                                    </div>

                                    <ul className="list-unstyled small mb-4">
                                        {porEstado.map((e) => (
                                            <li key={e.estado} className="d-flex justify-content-between">
                                                <span>
                                                    <span className={`badge bg-${COLOR_ESTADO[e.estado]} me-2`}>&nbsp;</span>
                                                    {e.estado}
                                                </span>
                                                <span className="fw-semibold">{e.cantidad}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}

                            <h2 className="h6 mb-2">Más vendidos</h2>
                            {masVendidos.length === 0 ? (
                                <p className="text-muted small mb-0">Sin ventas registradas.</p>
                            ) : (
                                <ol className="small ps-3 mb-0">
                                    {masVendidos.map((p) => (
                                        <li key={p.productoId} className='mb-1'>
                                            {p.nombre} <span className="text-muted">· {p.unidades} uds.</span>
                                        </li>
                                    ))}
                                </ol>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-3">
                <div className="col-12 col-xl-7">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h2 className="h6 mb-0">Últimas órdenes</h2>
                                <Link to="/admin/ordenes" className="small">Ver todas</Link>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-sm table-hover align-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th>N°</th>
                                            <th>Cliente</th>
                                            <th>Fecha</th>
                                            <th>Total</th>
                                            <th className="text-center">Estado</th>
                                            <th className='text-end'>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recientes.map((o) => (
                                            <tr key={o.id}>
                                                <td className="fw-semibold">#{o.numero}</td>
                                                <td>{o.cliente.nombre} {o.cliente.apellidos}</td>
                                                <td>{formatearFecha(o.fecha)}</td>
                                                <td>{formatearPrecio(totalOrden(o))}</td>
                                                <td className="text-center">
                                                    <span className={`badge text-bg-${COLOR_ESTADO[o.estado] ?? 'secondary'}`}>
                                                        {o.estado}
                                                    </span>
                                                </td>
                                                <td className="text-end">
                                                    <Link to={`/admin/ordenes/${o.id}`} className="btn btn-outline-secondary btn-sm">
                                                        Boleta
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}

                                        {recientes.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="text-center text-muted py-3">
                                                    Todavía no hay órdenes.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-xl-5">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h2 className="h6 mb-0">Stock crítico</h2>
                                <Link to="/admin/productos/criticos" className="small">Ver todos</Link>
                            </div>

                            {criticos.length === 0 ? (
                                <div className="alert alert-success mb-0">
                                    Todos los productos tienen stock sobre su nivel crítico.
                                </div>
                            ) : (
                                <ul className="list-group list-group-flush">
                                    {criticos.map((p) => (
                                        <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                                            <div>
                                                <div className="fw-semibold">{p.nombre}</div>
                                                <div className="small text-muted">
                                                    Stock {p.stock} · crítico en {p.stockCritico}
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                {p.stock === 0
                                                    ? <span className="badge bg-dark">Agotado</span>
                                                    : <span className="badge bg-danger">Crítico</span>}
                                                <Link to={`/admin/productos/${p.id}/editar`} className="btn btn-outline-secondary btn-sm">
                                                    Editar
                                                </Link>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard