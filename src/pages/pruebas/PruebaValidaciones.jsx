import { useState } from 'react'
import {
    normalizarRun,
    calcularDvRun,
    validarRun,
    validarNombre,
    validarApellidos,
    validarCorreo,
    validarContrasena,
    validarFechaNacimiento,
    validarDireccion,
    validarPrecio,
    validarEnteroNoNegativo,
} from '../../utils/validaciones'


const CAMPOS = [
    { nombre: 'run', etiqueta: 'RUN', ejemplo: '190110222', validar: validarRun },
    { nombre: 'nombre', etiqueta: 'Nombre', ejemplo: 'Isidora', validar: validarNombre },
    { nombre: 'apellidos', etiqueta: 'Apellidos', ejemplo: 'Gómez Rojas', validar: validarApellidos },
    { nombre: 'correo', etiqueta: 'Correo', ejemplo: 'admin@duoc.cl', validar: validarCorreo },
    { nombre: 'contrasena', etiqueta: 'Contraseña (4 a 10)', ejemplo: '1234', validar: validarContrasena },
    {
        nombre: 'fechaNacimiento',
        etiqueta: 'Fecha de nacimiento (opcional, mayor de 18)',
        tipo: 'date',
        validar: (v) => validarFechaNacimiento(v, { edadMinima: 18 }),
    },
    { nombre: 'direccion', etiqueta: 'Dirección', ejemplo: 'Calle Ejemplo 123', validar: validarDireccion },
    { nombre: 'precio', etiqueta: 'Precio', tipo: 'number', ejemplo: '14990', validar: validarPrecio },
    {
        nombre: 'stock',
        etiqueta: 'Stock',
        tipo: 'number',
        ejemplo: '25',
        validar: (v) => validarEnteroNoNegativo(v, 'El stock'),
    },
]


function PruebaValidaciones() {
    const [valores, setValores] = useState({})
    const [tocados, setTocados] = useState({})

    const cambiar = (nombre, valor) => {
        setValores(prev => ({ ...prev, [nombre]: valor }))
        setTocados(prev => ({ ...prev, [nombre]: true }))
    }

    const run = valores.run ?? ''
    const cuerpoRun = normalizarRun(run).slice(0, -1)

    return (
        <section className="mb-5">
            <h2 className="mb-3">Prueba de Validaciones</h2>
            
            <form className="row g-3" onSubmit={(e) => e.preventDefault()} noValidate>
                {CAMPOS.map((campo) => {
                    const error = tocados[campo.nombre] ? campo.validar(valores[campo.nombre] ?? '') : undefined
                    const clase = error === undefined ? '' : error === null ? 'is-valid' : 'is-invalid'

                    return (
                        <div key={campo.nombre} className="col-md-6">
                            <label htmlFor={`val-${campo.nombre}`} className="form-label">
                                {campo.etiqueta}
                            </label>
                            
                            <input
                                id={`val-${campo.nombre}`}
                                className={`form-control ${clase}`}
                                type={campo.tipo ?? 'text'}
                                placeholder={campo.ejemplo}
                                value={valores[campo.nombre] ?? ''}
                                onChange={(e) => cambiar(campo.nombre, e.target.value)}
                            />

                            {error && <div className="invalid-feedback">{error}</div>}
                            {error === null && <div className="valid-feedback">Válido</div>}
                        </div>
                    )
                })}
            </form>
            
            <p className="small text-muted mt-3 mb-0">
                RUN normalizado: <code>{normalizarRun(run) || '—'}</code>

                {/^\d{6,8}$/.test(cuerpoRun) && (
                <> · dígito verificador esperado de {cuerpoRun}: <code>{calcularDvRun(cuerpoRun)}</code></>
                )}
            </p>
        </section>
    )
}
export default PruebaValidaciones