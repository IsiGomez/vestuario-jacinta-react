function EncabezadoPagina({ titulo, subtitulo }) {
    return (
        <section className="hero encabezado-pagina py-4 mb-4">
            <div className="container text-center">
                <h1 className="display-5 fw-bold mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>{titulo}</h1>
                {subtitulo && <p className="lead text-muted mb-0">{subtitulo}</p>}
            </div>
        </section>
    )
}

export default EncabezadoPagina