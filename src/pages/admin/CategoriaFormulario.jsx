import { useRecurso } from '../../hooks/useRecurso'
import { useLayoutEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { crearCategoria, actualizarCategoria, obtenerCategoriaPorId } from '../../services/categoriaService'
import { validarTexto } from '../../utils/validaciones'
import Campo from '../../components/Campo'

const VALORES_INICIALES = { nombre: '', descripcion: '' }

function validar(datos) {
    const errores = {
        nombre: validarTexto(datos.nombre, { campo: 'El nombre', min: 3, max: 50 }),
        descripcion: validarTexto(datos.descripcion, { campo: 'La descripción', min: 5, max: 200 }),
    }

    return Object.fromEntries(Object.entries(errores).filter(([, mensaje]) => mensaje))
}


const cargarCategoria = (id) => id ? obtenerCategoriaPorId(id) : null

function CategoriaFormulario() {
    const navegar = useNavigate()

    const { id } = useParams()
    const esEdicion = id !== undefined
    const { datos: categoria, cargando, error: errorCarga } = useRecurso(cargarCategoria, id ?? null)

    const [datos, setDatos] = useState(() =>
        categoria ? { nombre: categoria.nombre, descripcion: categoria.descripcion } : VALORES_INICIALES
    )
    const [errores, setErrores] = useState({})
    const [errorGuardado, setErrorGuardado] = useState('')

    useLayoutEffect(() => { setDatos(categoria ? { nombre: categoria.nombre, descripcion: categoria.descripcion ?? '' } : VALORES_INICIALES) }, [categoria])
    if (cargando) return <p role="status">Cargando categoría...</p>
    if (errorCarga) return <div role="alert">{errorCarga}</div>
    if (esEdicion && !categoria) {
        return (
            <div>
                <div className="alert alert-warning">No existe una categoría con id {id}.</div>
                <Link to="/admin/categorias" className="btn btn-outline-secondary">Volver al listado</Link>
            </div>
        )
    }

    const cambiar = (e) => {
        const { name, value } = e.target

        setDatos((anterior) => ({ ...anterior, [name]: value }))
        setErrores((anterior) => ({ ...anterior, [name]: undefined }))
    }

    const enviar = async (e) => {
        e.preventDefault()

        const erroresEncontrados = validar(datos)
        setErrores(erroresEncontrados)

        if (Object.keys(erroresEncontrados).length > 0) return

        const campos = { nombre: datos.nombre.trim(), descripcion: datos.descripcion.trim() }

        try {
            if (esEdicion) {
                await actualizarCategoria(id, campos)
            } else {
                await crearCategoria(campos)
            }
            navegar('/admin/categorias')
        } catch (err) {
            setErrorGuardado(err.message)
        }
    }


    return (
        <div className="pagina" style={{ maxWidth: '640px' }}>
            <h1 className="h3 mb-3">{esEdicion ? 'Editar categoría' : 'Nueva categoría'}</h1>

            {errorGuardado && <div className="alert alert-danger">{errorGuardado}</div>}

            <form onSubmit={enviar} noValidate>
                <Campo 
                    etiqueta="Nombre" 
                    nombre="nombre" 
                    valor={datos.nombre} 
                    error={errores.nombre} 
                    onChange={cambiar} 
                />
                
                <Campo 
                    etiqueta="Descripción" 
                    nombre="descripcion" 
                    as="textarea" rows={3}
                    valor={datos.descripcion} 
                    error={errores.descripcion} 
                    onChange={cambiar} 
                />

                <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                        {esEdicion ? 'Guardar cambios' : 'Guardar'}
                    </button>

                    <Link to="/admin/categorias" className="btn btn-outline-secondary">Cancelar</Link>
                </div>
            </form>
        </div>
    )
}

export default CategoriaFormulario