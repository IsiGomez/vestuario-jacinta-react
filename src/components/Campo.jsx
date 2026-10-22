function Campo({ etiqueta, nombre, valor, error, onChange, as: Control = 'input', children, ...resto }) {
    const clase = Control === 'select' ? 'form-select' : 'form-control'

    return (
        <div className="mb-3">
            <label htmlFor={nombre} className="form-label">{etiqueta}</label>
            
            <Control
                id={nombre}
                name={nombre}
                value={valor}
                onChange={onChange}
                className={`${clase} ${error ? 'is-invalid' : ''}`}
                {...resto}
            >
                {children}
            </Control>

            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    )
}

export default Campo