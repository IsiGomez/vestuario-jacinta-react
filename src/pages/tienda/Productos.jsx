import { obtenerProductosTienda } from '../../services/productoService'
import { disponiblesPrimero } from '../../utils/catalogo'
import { useRecurso } from '../../hooks/useRecurso'
import TarjetaProducto from '../../components/TarjetaProducto'
import EncabezadoPagina from '../../components/EncabezadoPagina'

function Productos() {
    const { datos, cargando, error } = useRecurso(obtenerProductosTienda)
    const productos = disponiblesPrimero(datos ?? [])

    return (
        <div className="container pb-4">
            <EncabezadoPagina titulo="Productos" subtitulo="Descubre todas nuestras prendas" />

            {error && <div role="alert" className="alert alert-danger">{error}</div>}
            {cargando && <p role="status">Cargando productos...</p>}

            {!cargando && !error && productos.length === 0 && (
                <div className="alert alert-info">No hay productos disponibles.</div>
            )}

            {productos.length > 0 && (
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