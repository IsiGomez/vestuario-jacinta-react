import { useState } from 'react'
import { Link } from 'react-router-dom'
import { obtenerProductos,  eliminarProducto} from '../../data/productos'
import MiniaturaImagen from '../../components/MiniaturaImagen';

const formatearPrecio = (valor) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(valor)

function ProductosAdmin() {
    const [productos, setProductos] = useState(obtenerProductos)
    const [error, setError] = useState('')

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
        <div class = "p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="h3 mb-0">Productos</h1>
                
                <Link to="/admin/productos/nuevo" className="btn btn-primary btn-sm">
                    <i className="bi bi-plus-lg me-1" /> Nuevo producto
                </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th class = "text-center">ID</th>
                            <th>Nombre</th>
                            <th>Género</th>
                            <th>Precio</th>
                            <th class = "text-center">Stock</th>
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
                                            className="btn btn-outline-secondary btn-sm me-2"
                                        >
                                            Editar
                                        </Link>
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => eliminar(p)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}

                        {productos.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center text-muted py-4">
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