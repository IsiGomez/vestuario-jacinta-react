import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { validarTexto, validarPrecio, validarEnteroNoNegativo, validarRequerido } from '../../utils/validaciones'
import { obtenerCategorias } from '../../data/categorias'
import { crearProducto, obtenerProductos, color, TIPOS, COLORES, COLORES_CON_FOTOS, TALLAS, actualizarProducto, obtenerProductoPorId } from '../../data/productos'
import Campo from '../../components/Campo'

const VALORES_INICIALES = {
    nombre: '',
    categoriaId: '',
    genero: '',
    tipo: '',
    precio: '',
    stock: '',
    stockCritico: '',
    descripcion: '',
    colores: [],
}


const productoAFormulario = (p) => ({
    nombre: p.nombre,
    categoriaId: p.categoriaId ? String(p.categoriaId) : '',
    genero: p.genero,
    tipo: p.tipo,
    precio: String(p.precio),
    stock: String(p.stock),
    stockCritico: String(p.stockCritico),
    descripcion: p.descripcion,
    colores: p.colores ? p.colores.map((c) => c.clave) : [],
})


function validar(datos, idActual = null) {
    const errores = {
        nombre: validarTexto(datos.nombre, { campo: 'El nombre', min: 3, max: 80 }),
        categoriaId: validarRequerido(datos.categoriaId, 'La categoría'),
        genero: validarRequerido(datos.genero, 'El género'),
        tipo: validarRequerido(datos.tipo, 'El tipo') ||
            (obtenerProductos().some((p) => p.genero === datos.genero && p.tipo === datos.tipo & p.id !== Number(idActual))
            ? 'Ya existe un producto de este género y tipo. Edítalo para cambiar sus colores.'
            : null),
        colores: datos.colores.length === 0 ? 'Elige al menos un color' : null,
        precio: validarPrecio(datos.precio),
        stock: validarEnteroNoNegativo(datos.stock, 'El stock'),
        stockCritico: validarEnteroNoNegativo(datos.stockCritico, 'El stock crítico'),
        descripcion: validarTexto(datos.descripcion, { campo: 'La descripción', min: 10, max: 300 }),
    }

    return Object.fromEntries(Object.entries(errores).filter(([, mensaje]) => mensaje))
}


function ProductoFormulario() {
    const navegar = useNavigate()

    const { id } = useParams()
    const esEdicion = id !== undefined
    const producto = esEdicion ? obtenerProductoPorId(id) : null

    const [datos, setDatos] = useState(producto ? productoAFormulario(producto) : VALORES_INICIALES)
    const [errores, setErrores] = useState({})
    const [errorGuardado, setErrorGuardado] = useState('')
    const [categorias] = useState(obtenerCategorias)

    if (esEdicion && !producto) {
        return (
            <div>
                <div className="alert alert-warning">No existe un producto con id {id}.</div>
                <Link to="/admin/productos" className="btn btn-outline-secondary">Volver al listado</Link>
            </div>
        )
    }


    const cambiar = (e) => {
        const { name, value } = e.target

        setDatos((anterior) => ({
            ...anterior,
            [name]: value,
            ...(name === 'genero' ? { tipo: '', colores: [] } : {}),
            ...(name === 'tipo' ? { colores: [] } : {}),
        }))

        setErrores((anterior) => ({ 
            ...anterior, 
            [name]: undefined,
            ...(name === 'genero' ? { tipo: undefined, colores: undefined } : {}),
            ...(name === 'tipo' ? { colores: undefined } : {}),
        }))
    }


    const tiposDisponibles = Object.keys(COLORES_CON_FOTOS)
    .filter((clave) => clave.startsWith(`${datos.genero}/`))
    .map((clave) => clave.split('/')[1])


    const coloresDisponibles = COLORES_CON_FOTOS[`${datos.genero}/${datos.tipo}`] ?? []


    const alternarColor = (clave) => {
        setDatos((anterior) => ({
            ...anterior,
            colores: anterior.colores.includes(clave)
                ? anterior.colores.filter((c) => c !== clave)
                : [...anterior.colores, clave],
        }))
        setErrores((anterior) => ({ ...anterior, colores: undefined }))
    }


    const enviar = (e) => {
        e.preventDefault()
        setErrorGuardado('')

        const erroresEncontrados = validar(datos, id)
        setErrores(erroresEncontrados)

        
        if (Object.keys(erroresEncontrados).length > 0) return

        const campos = {
            nombre: datos.nombre.trim(),
            categoriaId: Number(datos.categoriaId),
            genero: datos.genero,
            tipo: datos.tipo,
            precio: Number(datos.precio),
            stock: Number(datos.stock),
            stockCritico: Number(datos.stockCritico),
            descripcion: datos.descripcion.trim(),
            tallas: TALLAS,
            colores: datos.colores.map((clave) => color(datos.genero, datos.tipo, COLORES[clave], clave))
        }

        try {
            if (esEdicion) {
                actualizarProducto(id, campos)
            } else {
                crearProducto(campos)
            }
            navegar('/admin/productos')
        } catch (err) {
            setErrorGuardado(err.message)
        }
    }


    return (
        <div className="pagina" style={{ maxWidth: '640px' }}>
            <h1 className="h3 mb-3">{esEdicion ? 'Editar producto' : 'Nuevo producto'}</h1>

            {errorGuardado && <div className="alert alert-danger">{errorGuardado}</div>}

            <form onSubmit={enviar} noValidate>
                <Campo etiqueta="Nombre" nombre="nombre" valor={datos.nombre} error={errores.nombre} onChange={cambiar} />

                <div className="row">
                    <div className="col-md-12">
                        <Campo etiqueta="Categoría" nombre="categoriaId" as="select" valor={datos.categoriaId} error={errores.categoriaId} onChange={cambiar}>
                            <option value="">Selecciona...</option>
                            {categorias.map((c) => (
                                <option key={c.id} value={c.id}>{c.nombre}</option>
                            ))}
                        </Campo>
                    </div>
                    <div className="col-md-4">
                        <Campo etiqueta="Género" nombre="genero" as="select" valor={datos.genero} error={errores.genero} onChange={cambiar}>
                            <option value="">Selecciona...</option>
                            <option value="hombre">Hombre</option>
                            <option value="mujer">Mujer</option>
                            <option value="unisex">Unisex</option>
                        </Campo>
                    </div>
                    <div className="col-md-8">
                        <Campo etiqueta="Tipo" nombre="tipo" as="select" valor={datos.tipo} error={errores.tipo} onChange={cambiar} disabled={!datos.genero}>
                            <option value="">Selecciona...</option>
                            {tiposDisponibles.map((t) => (
                                <option key={t} value={t}>{TIPOS[t]}</option>
                            ))}
                        </Campo>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-4">
                        <Campo etiqueta="Precio" nombre="precio" type="number" valor={datos.precio} error={errores.precio} onChange={cambiar} />
                    </div>
                    <div className="col-md-4">
                        <Campo etiqueta="Stock" nombre="stock" type="number" valor={datos.stock} error={errores.stock} onChange={cambiar} />
                    </div>
                    <div className="col-md-4">
                        <Campo etiqueta="Stock crítico" nombre="stockCritico" type="number" valor={datos.stockCritico} error={errores.stockCritico} onChange={cambiar} />
                    </div>
                </div>
                
                <fieldset className="mb-3">
                    <legend className="form-label fs-6">Colores</legend>
                    
                    {coloresDisponibles.length === 0 && (
                        <p className="text-muted small mb-0">Elige género y tipo para ver los colores disponibles.</p>
                    )}
                    
                    {coloresDisponibles.map((clave) => (
                        <div key={clave} className="form-check form-check-inline">
                            <input
                                type="checkbox"
                                id={`color-${clave}`}
                                className="form-check-input"
                                checked={datos.colores.includes(clave)}
                                onChange={() => alternarColor(clave)}
                            />
                    
                            <label htmlFor={`color-${clave}`} className="form-check-label">{COLORES[clave]}</label>
                        </div>
                    ))}
                    
                    {errores.colores && <div className="text-danger small">{errores.colores}</div>}
                </fieldset>

                <Campo etiqueta="Descripción" nombre="descripcion" as="textarea" rows={3} valor={datos.descripcion} error={errores.descripcion} onChange={cambiar} />

                <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                        {esEdicion ? 'Guardar cambios' : 'Guardar'}
                    </button>
                    <Link to="/admin/productos" className="btn btn-outline-secondary">Cancelar</Link>
                </div>
            </form>
        </div>
    )
}

export default ProductoFormulario