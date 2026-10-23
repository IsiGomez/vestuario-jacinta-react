function TarjetaResumen({ titulo, valor, icono, color = 'primary', detalle }) {
    return (
        <div className={`card text-bg-${color} h-100 shadow-sm`}>
            <div className="card-body d-flex align-items-center justify-content-between">
                <div>
                    <div className="small text-uppercase">{titulo}</div>
                    <div className="display-6 fw-semibold">{valor}</div>
                    {detalle && <div className="small">{detalle}</div>}
                </div>
                <i className={`bi ${icono} fs-1 opacity-75`} />
            </div>
        </div>
    )
}

export default TarjetaResumen