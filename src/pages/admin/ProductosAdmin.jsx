import { useState } from 'react'
import { Link } from 'react-router-dom'
import { obtenerProductos } from '../../data/productos'

const formatearPrecio = (valor) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(valor)

function ProductosAdmin() {
    const [productos] = useState(obtenerProductos)

    return (
        <div class = "p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="h3 mb-0">Productos</h1>
                <Link to="/admin/productos/nuevo" className="btn btn-primary btn-sm">
                    <i className="bi bi-plus-lg me-1" /> Nuevo producto
                </Link>
            </div>

            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead>
                        <tr>
                            <th class = "text-center">ID</th>
                            <th>Nombre</th>
                            <th>Género</th>
                            <th>Precio</th>
                            <th class = "text-center">Stock</th>
                            <th className = "text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((p) => (
                            <tr key={p.id}>
                                <td class = "text-center">{p.id}</td>
                                <td>{p.nombre}</td>
                                <td className = "text-capitalize">{p.genero}</td>
                                <td>{formatearPrecio(p.precio)}</td>
                                <td class="text-center">
                                    <span className={`badge ${p.stock <= p.stockCritico ? 'bg-danger' : 'bg-success'}`}>
                                        {p.stock}
                                    </span>
                                </td>
                                <td className="text-center">
                                    <Link
                                        to={`/admin/productos/${p.id}/editar`}
                                        className="btn btn-outline-secondary btn-sm"
                                    >
                                        Editar
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ProductosAdmin