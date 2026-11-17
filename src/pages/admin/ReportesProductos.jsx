import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { obtenerProductos, obtenerProductosCriticos } from '../../services/productoService'
import { obtenerCategorias } from '../../services/categoriaService'
import { useRecurso } from '../../hooks/useRecurso'
import { resumenInventario, inventarioPorCategoria } from '../../utils/reportes'
import { formatearPrecio } from '../../utils/formato'
import TarjetaResumen from '../../components/TarjetaResumen'

function ReportesProductos() {
    const { datos: productos, cargando, error } = useRecurso(obtenerProductos)
    const { datos: categorias } = useRecurso(obtenerCategorias)
    const { datos: criticos } = useRecurso(obtenerProductosCriticos)

    const { resumen, porCategoria } = useMemo(() => {
        const activos = (productos ?? []).filter((p) => p.activo)

        return {
            resumen: { ...resumenInventario(activos), criticos: criticos?.length ?? 0 },
            porCategoria: inventarioPorCategoria(activos, categorias ?? []),
        }
    }, [productos, categorias, criticos])

    return (
        <div className="pagina">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="h3 mb-0">Reporte de productos</h1>
                
                <div className="d-flex gap-2">
                    <Link to="/admin/reportes" className="btn btn-outline-secondary btn-sm">
                        <i className="bi bi-arrow-left me-1" /> Ir a reportes
                    </Link>

                    <Link to="/admin/productos" className="btn btn-outline-secondary btn-sm">
                        <i className="bi bi-arrow-left me-1" /> Ir a productos
                    </Link>
                </div>
            </div>

            {error && <div role="alert" className="alert alert-danger">{error}</div>}
            {cargando && <p role="status">Cargando reporte...</p>}

            <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6 col-lg-3">
                    <TarjetaResumen titulo="Productos" valor={resumen.totalProductos} icono="bi-box-seam" color="primary" />
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                    <TarjetaResumen titulo="Unidades en stock" valor={resumen.unidades} icono="bi-stack" color="success" />
                </div>

                <div className="col-12 col-sm-6 col-lg-3">
                    <TarjetaResumen titulo="Valor del inventario" valor={formatearPrecio(resumen.valorInventario)} icono="bi-cash-coin" color="secondary" />
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                    <TarjetaResumen titulo="Productos críticos" valor={resumen.criticos} icono="bi-exclamation-triangle" color="danger" />
                </div>
            </div>

            <h2 className="h5">Inventario por categoría</h2>
            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead>
                        <tr>
                            <th>Categoría</th>
                            <th className="text-end">Productos</th>
                            <th className="text-end">Unidades</th>
                            <th className="text-end">Valor</th>
                        </tr>
                    </thead>

                    <tbody>
                        {porCategoria.map((fila) => (
                            <tr key={fila.categoria}>
                                <td>{fila.categoria}</td>
                                <td className="text-end">{fila.productos}</td>
                                <td className="text-end">{fila.unidades}</td>
                                <td className="text-end">{formatearPrecio(fila.valor)}</td>
                            </tr>
                        ))}

                        {!cargando && !error && porCategoria.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center text-muted py-4">
                                    No hay productos registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ReportesProductos