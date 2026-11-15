import { LONGITUDES } from '../utils/longitudes'

function Campo({ etiqueta, nombre, valor, error, ayuda, onChange, as: Control = 'input', children, maxLength, ...resto }) {
    const clase = Control === 'select' ? 'form-select' : 'form-control'
    const esTexto = Control === 'textarea' || (Control === 'input'
        && !['number', 'date', 'checkbox', 'radio', 'file'].includes(resto.type))
    const limite = esTexto ? (maxLength ?? LONGITUDES[nombre] ?? 100) : undefined

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
                maxLength={limite}
            >
                {children}
            </Control>

            {ayuda && !error && <div className="form-text">{ayuda}</div>}
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    )
}

export default Campo