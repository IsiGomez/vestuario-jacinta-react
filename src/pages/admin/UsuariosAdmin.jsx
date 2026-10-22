import { useState } from 'react'
import { Link } from 'react-router-dom'
import { obtenerUsuarios, eliminarUsuario } from '../../data/usuarios'
import { useAuth } from '../../hooks/useAuth'
import { formatearRun } from '../../utils/formato'

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
        <div>
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
                                    
                                    <td className="text-center text-nowrap">
                                        <div className="d-flex gap-2 w-100">
                                            <Link
                                                to={`/admin/usuarios/${u.id}/editar`}
                                                className="btn btn-outline-secondary btn-sm flex-fill"
                                            >
                                                Editar
                                            </Link>

                                            {u.tipoUsuario === 'Cliente' && (
                                                <Link
                                                    to={`/admin/usuarios/${u.id}/historial`}
                                                    className="btn btn-outline-secondary btn-sm flex-fill"
                                                >
                                                    Historial
                                                </Link>
                                            )}

                                            <span title={motivo} className="d-flex flex-fill">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger btn-sm w-100"
                                                    disabled={Boolean(motivo)}
                                                    onClick={() => eliminar(u)}
                                                >
                                                    Eliminar
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