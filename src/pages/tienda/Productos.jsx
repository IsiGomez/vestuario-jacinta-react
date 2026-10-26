import { useState } from 'react'
import { obtenerProductos, disponiblesPrimero } from '../../data/productos'
import TarjetaProducto from '../../components/TarjetaProducto'
import EncabezadoPagina from '../../components/EncabezadoPagina'

function Productos() {
    const [productos] = useState(() => disponiblesPrimero(obtenerProductos()))

    return (
        <div className="container pb-4">
            <EncabezadoPagina titulo="Productos" subtitulo="Descubre todas nuestras prendas" />

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