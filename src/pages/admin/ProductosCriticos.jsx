import { useState } from 'react'
import { Link } from 'react-router-dom'
import { obtenerProductosCriticos } from '../../data/productos'
import MiniaturaImagen from '../../components/MiniaturaImagen';

function ProductosCriticos() {
    const [criticos] = useState(() => obtenerProductosCriticos().sort((a, b) => a.stock - b.stock))

    return (
        <div className="pagina">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="h3 mb-0">Productos críticos</h1>
                
                <Link to="/admin/productos" className="btn btn-outline-secondary btn-sm">
                    <i className="bi bi-arrow-left me-1" /> Volver a productos
                </Link>
            </div>


            {criticos.length === 0 ? (
                <div className="alert alert-success">
                    Todos los productos tienen stock sobre su nivel crítico.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead>
                            <tr>
                                <th>Imagen</th>
                                <th className="text-center">ID</th>
                                <th>Nombre</th>
                                <th className="text-center">Stock actual</th>
                                <th className="text-center">Cantidad crítica del stock</th>
                                <th className="text-center">Estado</th>
                                <th className="text-center">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {criticos.map((p) => {
                                const primeraImagen = p.colores?.[0]?.imagenes?.[0];
                                
                                return ( 
                                    <tr key={p.id}>
                                        <td>
                                            <MiniaturaImagen src={primeraImagen} alt={p.nombre} />
                                        </td>
                                        <td className="text-center">{p.id}</td>
                                        <th>{p.nombre}</th>
                                        <td className="text-center">{p.stock}</td>
                                        <td className="text-center">{p.stockCritico}</td>
                                        <td className="text-center">
                                            {p.stock === 0
                                                ? <span className="badge bg-dark">Agotado</span>
                                                : <span className="badge bg-danger">Crítico</span>}
                                        </td>
                                        
                                        <td className="text-center">
                                            <Link
                                                to={`/admin/productos/${p.id}/editar`}
                                                className="btn btn-outline-secondary btn-sm w-100"
                                            >
                                                Editar stock
                                            </Link>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default ProductosCriticos