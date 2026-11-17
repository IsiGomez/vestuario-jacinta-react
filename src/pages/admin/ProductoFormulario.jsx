import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { validarTexto, validarPrecio, validarEnteroNoNegativo, validarRequerido } from '../../utils/validaciones'
import { obtenerCategorias } from '../../services/categoriaService'
import { crearProducto, actualizarProducto, obtenerProductoPorId } from '../../services/productoService'
import { TIPOS, COLORES, COLORES_CON_FOTOS, TALLAS } from '../../utils/catalogo'
import { useRecurso } from '../../hooks/useRecurso'
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
    activo: true,
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
    activo: p.activo !== false,
})


function validar(datos) {
    const errores = {
        nombre: validarTexto(datos.nombre, { campo: 'El nombre', min: 3, max: 80 }),
        categoriaId: validarRequerido(datos.categoriaId, 'La categoría'),
        genero: validarRequerido(datos.genero, 'El género'),
        tipo: validarRequerido(datos.tipo, 'El tipo'),
        colores: datos.colores.length === 0 ? 'Elige al menos un color' : null,
        precio: validarPrecio(datos.precio),
        stock: validarEnteroNoNegativo(datos.stock, 'El stock'),
        stockCritico: validarEnteroNoNegativo(datos.stockCritico, 'El stock crítico'),
        descripcion: validarTexto(datos.descripcion, { campo: 'La descripción', min: 10, max: 300 }),
    }

    return Object.fromEntries(Object.entries(errores).filter(([, mensaje]) => mensaje))
}


function Formulario({ id, producto, categorias }) {
    const navegar = useNavigate()
    const esEdicion = id !== undefined

    const [datos, setDatos] = useState(producto ? productoAFormulario(producto) : VALORES_INICIALES)
    const [errores, setErrores] = useState({})
    const [errorGuardado, setErrorGuardado] = useState('')
    const [guardando, setGuardando] = useState(false)

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


    const enviar = async (e) => {
        e.preventDefault()
        setErrorGuardado('')

        const erroresEncontrados = validar(datos)
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
            colores: datos.colores,
            activo: datos.activo,
        }

        setGuardando(true)
        try {
            if (esEdicion) {
                await actualizarProducto(id, campos)
            } else {
                await crearProducto(campos)
            }
            navegar('/admin/productos')
        } catch (err) {
            if (err.status === 400 && err.datos?.detalles) {
                setErrores(err.datos.detalles)
                setErrorGuardado('Revisa los campos marcados')
            } else if (err.status === 409 && err.message.startsWith('Ya existe')) {
                setErrores({ tipo: 'Ya existe un producto de este género y tipo. Edítalo para cambiar sus colores.' })
            } else {
                setErrorGuardado(err.message)
            }
            setGuardando(false)
        }
    }


    return (
        <div className="pagina" style={{ maxWidth: '640px' }}>
            <h1 className="h3 mb-3">{esEdicion ? 'Editar producto' : 'Nuevo producto'}</h1>

            {errorGuardado && <div className="alert alert-danger">{errorGuardado}</div>}

            <form onSubmit={enviar} noValidate>
                <Campo etiqueta="Nombre" nombre="nombre" maxLength={80} valor={datos.nombre} error={errores.nombre} onChange={cambiar} />

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

                <Campo etiqueta="Descripción" nombre="descripcion" maxLength={300} as="textarea" rows={3} valor={datos.descripcion} error={errores.descripcion} onChange={cambiar} />

                <div className="form-check mb-3">
                    <input
                        type="checkbox"
                        id="activo"
                        className="form-check-input"
                        checked={datos.activo}
                        onChange={(e) => setDatos((anterior) => ({ ...anterior, activo: e.target.checked }))}
                    />
                    <label htmlFor="activo" className="form-check-label">Visible en la tienda</label>
                </div>

                <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary" disabled={guardando}>
                        {esEdicion ? 'Guardar cambios' : 'Guardar'}
                    </button>
                    <Link to="/admin/productos" className="btn btn-outline-secondary">Cancelar</Link>
                </div>
            </form>
        </div>
    )
}

const cargarProducto = (id) => (id === null ? Promise.resolve(null) : obtenerProductoPorId(id))

function ProductoFormulario() {
    const { id } = useParams()
    const producto = useRecurso(cargarProducto, id ?? null)
    const categorias = useRecurso(obtenerCategorias)

    if (producto.cargando || categorias.cargando) return <p role="status">Cargando formulario...</p>

    if (id !== undefined && !producto.datos) {
        return (
            <div>
                <div role="alert" className="alert alert-warning">
                    {producto.error === 'Producto no encontrado' ? `No existe un producto con id ${id}.` : producto.error}
                </div>
                <Link to="/admin/productos" className="btn btn-outline-secondary">Volver al listado</Link>
            </div>
        )
    }

    return (
        <>
            {categorias.error && <div role="alert" className="alert alert-danger">{categorias.error}</div>}
            <Formulario key={id ?? 'nuevo'} id={id} producto={producto.datos} categorias={categorias.datos ?? []} />
        </>
    )
}

export default ProductoFormulario