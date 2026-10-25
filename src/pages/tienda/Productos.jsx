import { useState } from 'react'
import { obtenerProductos, disponiblesPrimero } from '../../data/productos'
import TarjetaProducto from '../../components/TarjetaProducto'

function Productos() {
    const [productos] = useState(() => disponiblesPrimero(obtenerProductos()))

    return (
        <div className="container py-4">
            <header className="mb-4">
                <h1 className="h2 mb-1">Productos</h1>
                <p className="text-muted mb-0">Descubre todas nuestras prendas</p>
            </header>

            {productos.length === 0 ? (
                <div className="alert alert-info">No hay productos disponibles.</div>
            ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                    {productos.map((producto) => (
                        <div className="col" key={producto.id}>
                            <TarjetaProducto producto={producto} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Productos