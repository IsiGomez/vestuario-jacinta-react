import { useState } from 'react'
import { Link } from 'react-router-dom'
import { obtenerCategorias, eliminarCategoria, contarProductosDeCategoria } from '../../data/categorias'

const cargarCategorias = () =>
obtenerCategorias().map((c) => ({ ...c, productos: contarProductosDeCategoria(c.id) }))


function CategoriasAdmin() {
    const [categorias, setCategorias] = useState(cargarCategorias)
    const [error, setError] = useState('')

    const eliminar = (categoria) => {
        if (categoria.productos > 0) return

        if (!window.confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) return

        try {
            eliminarCategoria(categoria.id)
            setCategorias(cargarCategorias())
            setError('')
        } catch (e) {
            setError(e.message)
        }
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="h3 mb-0">Categorías</h1>
                
                <Link to="/admin/categorias/nueva" className="btn btn-primary btn-sm">
                    <i className="bi bi-plus-lg me-1" /> Nueva categoría
                </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Productos</th>
                            <th className="text-end">Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {categorias.map((c) => (
                            <tr key={c.id}>
                                <td>{c.id}</td>
                                <td>{c.nombre}</td>
                                <td>{c.descripcion}</td>
                                <td>{c.productos}</td>
                                <td className="text-end text-nowrap">
                                    <Link
                                        to={`/admin/categorias/${c.id}/editar`}
                                        className="btn btn-outline-secondary btn-sm me-2"
                                    >
                                        Editar
                                    </Link>

                                    <span title={c.productos > 0 ? 'Tiene productos asociados' : ''}>
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm"
                                            disabled={c.productos > 0}
                                            onClick={() => eliminar(c)}
                                        >
                                            Eliminar
                                        </button>
                                    </span>
                                </td>
                            </tr>
                        ))}

                        {categorias.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center text-muted py-4">
                                    No hay categorías registradas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default CategoriasAdmin