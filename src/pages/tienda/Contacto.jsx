import { useState } from 'react'
import Campo from '../../components/Campo'

const VALORES_INICIALES = { nombre: '', correo: '', mensaje: '' }

function validar(datos) {
    const errores = {}
    const regexCorreo = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i

    const nombreLimpio = datos.nombre.trim()
    if (!nombreLimpio) errores.nombre = 'El nombre es obligatorio.'
    else if (nombreLimpio.length < 6) errores.nombre = 'El nombre debe tener al menos 6 caracteres.'
    else if (nombreLimpio.length > 100) errores.nombre = 'El nombre debe tener menos de 100 caracteres.'

    const correoLimpio = datos.correo.trim()
    if (!correoLimpio) errores.correo = 'El correo es obligatorio.'
    else if (correoLimpio.length > 100) errores.correo = 'El correo no puede tener más de 100 caracteres.'
    else if (!regexCorreo.test(correoLimpio)) errores.correo = 'Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.'
    else if (correoLimpio.toLowerCase() === "vestuariojacinta@gmail.com") errores.correo = "Debes escribir tu correo, no el de la empresa."

    const mensajeLimpio = datos.mensaje.trim()
    if (!mensajeLimpio) errores.mensaje = 'El mensaje es obligatorio.'
    else if (mensajeLimpio.length < 10) errores.mensaje = 'Escribe al menos 10 caracteres.'
    else if (mensajeLimpio.length > 500) errores.mensaje = 'El mensaje no puede tener más de 500 caracteres.'

    return errores
}

function Contacto() {
    const [datos, setDatos] = useState(VALORES_INICIALES)
    const [errores, setErrores] = useState({})
    const [enviado, setEnviado] = useState(false)

    const cambiar = (e) => {
        const { name, value } = e.target
        setDatos((anterior) => ({ ...anterior, [name]: value }))
        setErrores((anterior) => ({ ...anterior, [name]: undefined }))
        if (enviado) setEnviado(false)
    }

    const limpiar = () => {
        setDatos(VALORES_INICIALES)
        setErrores({})
        setEnviado(false)
    }

    const enviar = (e) => {
        e.preventDefault()
        const erroresEncontrados = validar(datos)
        setErrores(erroresEncontrados)

        if (Object.keys(erroresEncontrados).length === 0) {
            setEnviado(true)
            setDatos(VALORES_INICIALES)
            setErrores({})
        }
    }

    return (
        <div className="auth-pagina">
            <div className="auth-tarjeta auth-tarjeta-ancha mx-auto">
                <h1 className="auth-titulo h3 text-center mb-1">Contacto</h1>
                <p className="auth-subtitulo text-center mb-4">
                    Envíanos tus consultas y recomendaciones
                </p>


                <div className="d-flex flex-column gap-3 mb-4">
                    <div 
                        className="d-flex align-items-center gap-2 gap-md-3 p-3 p-md-4 rounded-4 w-100" 
                        style={{ backgroundColor: 'var(--jc-durazno)', color: 'var(--jc-azul)' }}
                        >
                        <i className="bi bi-telephone-fill fs-4 fs-md-3 flex-shrink-0"></i>
                        <div className="d-flex flex-column text-start">
                            <span className="fw-bold text-uppercase mb-1 small">Llámanos al</span>
                            <a 
                                href="tel:+56934563452" 
                                className="text-decoration-none fw-semibold fs-6 fs-md-5 text-break" 
                                style={{ color: 'var(--jc-azul)' }}
                                >
                                +56 9 3456 3452
                            </a>
                        </div>
                    </div>
                    
                    <div 
                        className="d-flex align-items-center gap-2 gap-md-3 p-3 p-md-4 rounded-4 w-100" 
                        style={{ backgroundColor: 'var(--jc-durazno)', color: 'var(--jc-azul)' }}
                        >
                        <i className="bi bi-envelope-fill fs-4 fs-md-3 flex-shrink-0"></i>
                        <div className="d-flex flex-column text-start">
                            <span className="fw-bold text-uppercase mb-1 small">Escríbenos a</span>
                            <a 
                                href="mailto:vestuariojacinta@gmail.com" 
                                className="text-decoration-none fw-semibold fs-6 fs-md-5 text-break" 
                                style={{ color: 'var(--jc-azul)' }}
                                >
                                vestuariojacinta@gmail.com
                            </a>
                        </div>
                    </div>
                </div>

                <h2 className="h5 fw-semibold text-center mb-2" style={{ color: 'var(--jc-azul)' }}>
                    Formulario de contacto
                </h2>
                <hr className="mb-4" style={{ borderColor: 'var(--jc-durazno)', opacity: 1, borderWidth: '2px' }} />

                <form onSubmit={enviar} noValidate>
                    <Campo
                        etiqueta="Nombre"
                        nombre="nombre"
                        valor={datos.nombre}
                        error={errores.nombre}
                        onChange={cambiar}
                        placeholder="Tu nombre completo"
                        />
                    <Campo
                        etiqueta="Correo electrónico"
                        nombre="correo"
                        type="email"
                        valor={datos.correo}
                        error={errores.correo}
                        onChange={cambiar}
                        placeholder="ejemplo@duoc.cl"
                        />
                    <Campo
                        etiqueta="Mensaje"
                        nombre="mensaje"
                        as="textarea"
                        valor={datos.mensaje}
                        error={errores.mensaje}
                        onChange={cambiar}
                        rows="4"
                        placeholder="Escribe tu consulta o recomendación..."
                        />
                    
                    <div className="d-flex gap-2 mt-3">
                        <button type="submit" className="btn btn-auth btn-primary flex-fill">
                            Enviar mensaje
                        </button>
                        <button type="button" className="btn btn-outline-secondary flex-fill" onClick={limpiar}>
                            Limpiar campos
                    </button>
                    </div>
                </form>
                {enviado && (
                    <div className="alert alert-success text-center my-2" role="alert">
                        ¡Gracias! Tu mensaje fue enviado correctamente.
                    </div>
                )}
            </div>
        </div>
    )
}

export default Contacto