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
        <div className="pagina">
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
                            <th className = "text-center">ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Productos</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {categorias.map((c) => (
                            <tr key={c.id}>
                                <td className = "text-center">{c.id}</td>
                                <td>{c.nombre}</td>
                                <td>{c.descripcion}</td>
                                <td>{c.productos}</td>
                                <td className="text-nowrap">
                                    <div className="acciones">
                                        <Link
                                            to={`/admin/categorias/${c.id}/editar`}
                                            className="btn btn-outline-secondary btn-sm"
                                        >
                                            <i className="bi bi-pencil me-1" /> Editar
                                        </Link>

                                        <span title={c.productos > 0 ? 'Tiene productos asociados' : ''}>
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger btn-sm"
                                                disabled={c.productos > 0}
                                                onClick={() => eliminar(c)}
                                            >
                                                <i className="bi bi-trash me-1" /> Eliminar
                                            </button>
                                        </span>
                                    </div>
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