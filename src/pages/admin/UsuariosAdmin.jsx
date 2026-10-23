import { useState } from 'react'
import { Link } from 'react-router-dom'
import { obtenerUsuarios, eliminarUsuario } from '../../data/usuarios'
import { useAuth } from '../../hooks/useAuth'
import { formatearRun } from '../../utils/formato'

const iniciales = (u) => `${u.nombre?.[0] ?? ''}${u.apellidos?.[0] ?? ''}`.toUpperCase()
const claseTipo = (u) => (u.tipoUsuario === 'Administrador' ? 'admin' : 'cliente')

function UsuariosAdmin() {
    const { usuario: sesion } = useAuth()
    const [usuarios, setUsuarios] = useState(obtenerUsuarios)
    const [error, setError] = useState('')

    const motivoBloqueo = (u) => (u.id === sesion.id ? 'No puedes eliminar tu propia cuenta' : '')

    const eliminar = (u) => {
        if (motivoBloqueo(u)) return

        if (!window.confirm(`¿Eliminar a ${u.nombre} ${u.apellidos}? Esta acción no se puede deshacer.`)) return

        try {
            eliminarUsuario(u.id)
            setUsuarios(obtenerUsuarios())
            setError('')
        } catch (e) {
            setError(e.message)
        }
    }


    return (
        <div className="pagina">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="h3 mb-0">Usuarios</h1>
                
                <Link to="/admin/usuarios/nuevo" className="btn btn-primary btn-sm">
                    <i className="bi bi-plus-lg me-1" /> Nuevo usuario
                </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead>
                        <tr>
                            <th>RUN</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Tipo</th>
                            <th>Región / Comuna</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {usuarios.map((u) => {
                            const motivo = motivoBloqueo(u)

                            return (
                                <tr key={u.id}>
                                    <td>{formatearRun(u.run)}</td>
                                    <td>{u.nombre} {u.apellidos}</td>
                                    <td>{u.correo}</td>
                                    <td>
                                        <span className={`badge ${u.tipoUsuario === 'Administrador' ? 'bg-primary' : 'bg-secondary'}`}>
                                            {u.tipoUsuario}
                                        </span>
                                    </td>
                                    <td>{u.region} / {u.comuna}</td>
                                    
                                    <td className="text-nowrap">
                                        <div className="acciones acciones-3">
                                            <Link
                                                to={`/admin/usuarios/${u.id}/editar`}
                                                className="btn btn-outline-secondary btn-sm"
                                            >
                                                <i className="bi bi-pencil me-1" /> Editar
                                            </Link>

                                            {u.tipoUsuario === 'Cliente' && (
                                                <Link
                                                    to={`/admin/usuarios/${u.id}/historial`}
                                                    className="btn btn-outline-secondary btn-sm"
                                                >
                                                    <i className="bi bi-clock-history me-1" /> Historial
                                                </Link>
                                            )}

                                            <span title={motivo}>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger btn-sm"
                                                    disabled={Boolean(motivo)}
                                                    onClick={() => eliminar(u)}
                                                >
                                                    <i className="bi bi-trash me-1" /> Eliminar
                                                </button>
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}

                        {usuarios.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center text-muted py-4">
                                    No hay usuarios registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UsuariosAdmin