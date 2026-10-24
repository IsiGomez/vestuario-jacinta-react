import { useState } from 'react'
import { Link } from 'react-router-dom'
import { obtenerProductos,  eliminarProducto} from '../../data/productos'
import { obtenerCategorias } from '../../data/categorias'
import MiniaturaImagen from '../../components/MiniaturaImagen';
import {formatearPrecio} from '../../utils/formato'


function ProductosAdmin() {
    const [productos, setProductos] = useState(obtenerProductos)
    const [error, setError] = useState('')

    const [nombresCategoria] = useState(() => Object.fromEntries(obtenerCategorias().map((c) => [c.id, c.nombre])))

    const eliminar = (producto) => {
        if (!window.confirm(`¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`)) return

        try {
            eliminarProducto(producto.id)
            setProductos(obtenerProductos())
            setError('')
        } catch (e) {
            setError(e.message)
        }
    }

    return (
        <div className = "pagina">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="h3 mb-0">Productos</h1>
                
                <div className="d-flex gap-2">
                    <Link to="/admin/reportes/productos" className="btn btn-outline-primary btn-sm">
                        <i className="bi bi-file-earmark-bar-graph me-1" /> Ver Reporte
                    </Link>
                    <Link to="/admin/productos/criticos" className="btn btn-outline-danger btn-sm">
                        <i className="bi bi-exclamation-triangle me-1" /> Críticos
                    </Link>
                    <Link to="/admin/productos/nuevo" className="btn btn-primary btn-sm">
                        <i className="bi bi-plus-lg me-1" /> Nuevo producto
                    </Link>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th className = "text-center">ID</th>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Género</th>
                            <th>Precio</th>
                            <th className = "text-center">Stock</th>
                            <th className = "text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((p) => {
                            const primeraImagen = p.colores?.[0]?.imagenes?.[0];

                            return (
                                <tr key={p.id}>
                                    <td>
                                        <MiniaturaImagen src={primeraImagen} alt={p.nombre} />
                                    </td>
                                    <td className = "text-center">{p.id}</td>
                                    <td>{p.nombre}</td>
                                    <td>{nombresCategoria[p.categoriaId] ?? 'Sin categoría'}</td>
                                    <td className = "text-capitalize">{p.genero}</td>
                                    <td>{formatearPrecio(p.precio)}</td>
                                    <td className="text-center">
                                        <span className={`badge ${p.stock <= p.stockCritico ? 'bg-danger' : 'bg-success'}`}>
                                            {p.stock}
                                        </span>
                                    </td>

                                    <td className="text-nowrap">
                                        <div className="acciones">
                                            <Link
                                                to={`/admin/productos/${p.id}/editar`}
                                                className="btn btn-outline-secondary btn-sm"
                                            >
                                                <i className="bi bi-pencil" /> Editar
                                            </Link>

                                            <button
                                                type="button"
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => eliminar(p)}
                                            >
                                                <i className="bi bi-trash" /> Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}

                        {productos.length === 0 && (
                            <tr>
                                <td colSpan={8} className="text-center text-muted py-4">
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

export default ProductosAdmin