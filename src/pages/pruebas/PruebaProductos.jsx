import { useState } from 'react'
import {
  obtenerProductos,
  obtenerProductosCriticos,
  crearProducto,
  eliminarProducto,
  restablecerProductos,
} from '../../data/productos'


function PruebaProductos() {
    const [productos, setProductos] = useState(obtenerProductos)
    const [error, setError] = useState('')

    const ejecutar = (accion) => {
        try {
            accion()
            setProductos(obtenerProductos())
            setError('')
        
        } catch (e) {
            setError(e.message)
        }
    }

    const agregarDePrueba = () =>
        ejecutar(() =>
            crearProducto({
                nombre: `Producto de prueba ${productos.length + 1}`,
                genero: 'mujer',
                tipo: 'cam_corta',
                precio: 9990,
                stock: 2,
                stockCritico: 5,
                descripcion: 'Creado desde la prueba.',
                tallas: ['S', 'M'],
                colores: [],
            }),
        )

    return (
        <section className="mb-5">
            <h2 className="mb-3">Prueba de Productos (CRUD)</h2>
            
            <div className="d-flex flex-wrap gap-2 mb-3">
                <button className="btn btn-primary" onClick={agregarDePrueba}>Crear producto</button>
                
                <button className="btn btn-outline-secondary" onClick={() => ejecutar(restablecerProductos)}>
                    Restablecer
                </button>
                
                <span className="ms-auto align-self-center">Críticos: {obtenerProductosCriticos().length}</span>
            </div>
            
            {error && <div className="alert alert-danger">{error}</div>}
            
            <ul className="list-group">
                {productos.map((p) => (
                    <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>
                            {p.nombre} · ${p.precio.toLocaleString('es-CL')} · stock {p.stock}
                            {p.stock <= p.stockCritico && <span className="badge text-bg-warning ms-2">crítico</span>}
                        </span>
                        
                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => ejecutar(() => eliminarProducto(p.id))}
                        >
                            Eliminar
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default PruebaProductos