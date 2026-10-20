import { useState } from 'react'

function ProductoPruebaCard({ producto }) {
    const [indiceColor, setIndiceColor] = useState(0)
    const [indiceVista, setIndiceVista] = useState(0)
    const [rotas, setRotas] = useState([])

    const color = producto?.colores?.[indiceColor]
    const imagenes = color?.imagenes ?? []
    const principal = imagenes[indiceVista]
    const critico = producto ? producto.stock <= producto.stockCritico : false

    const elegirColor = (i) => {
        setIndiceColor(i)
        setIndiceVista(0)
    }
    const marcarRota = (src) => setRotas((previas) => (previas.includes(src) ? previas : [...previas, src]))

    if (!producto) {
        return <div className="alert alert-info">No hay información de producto disponible.</div>
    }

    return (
        <div className="card h-100">
            {principal ? (
                rotas.includes(principal) ? (
                    <div className="card-img-top d-flex align-items-center justify-content-center bg-light text-danger p-5">
                        Imagen no encontrada
                    </div>
                ) : (
                    <img
                        src={principal}
                        alt={`${producto.nombre} color ${color.nombre}, vista ${indiceVista + 1}`}
                        className="card-img-top"
                        height="550"
                        onError={() => marcarRota(principal)}
                    />
                )
            ) : (
                <div className="card-img-top bg-light text-muted p-5 text-center">Sin imágenes</div>
            )}


            <div className="card-body">
                <h3 className="h6 card-title">{producto.nombre}</h3>
                
                <p className="mb-1">
                    ${producto.precio.toLocaleString('es-CL')}
                </p>
                
                <p className="mb-2">
                    Stock {producto.stock}
                    {critico && <span className="badge text-bg-warning ms-2">crítico</span>}
                </p>

                {producto.colores.length > 0 && (
                    <div className="d-flex flex-wrap gap-1 mb-2">
                        {producto.colores.map((c, i) => (
                            <button
                                key={c.clave}
                                type="button"
                                className={`btn btn-sm ${i === indiceColor ? 'btn-dark' : 'btn-outline-dark'}`}
                                onClick={() => elegirColor(i)}
                            >
                                {c.nombre}
                            </button>
                        ))}
                    </div>
                )}

                <div className="d-flex gap-1 mb-2">
                    {imagenes.map((src, i) => (
                        <button
                            key={src}
                            type="button"
                            className={`btn p-0 border ${i === indiceVista ? 'border-dark' : ''}`}
                            onClick={() => setIndiceVista(i)}
                            aria-label={`Ver vista ${i + 1}`}
                        >
                            <img src={src} alt="" width="40" height="52" style={{ objectFit: 'cover' }} />
                        </button>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default ProductoPruebaCard