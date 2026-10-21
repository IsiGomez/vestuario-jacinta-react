import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const ENLACES = [
    { 
        to: '/admin', 
        texto: 'Dashboard', 
        icono: 'bi-speedometer2', 
        end: true },
    { 
        to: '/admin/ordenes', texto: 
        'Órdenes', 
        icono: 'bi-receipt' 
    },
    { 
        to: '/admin/productos', 
        texto: 'Productos', 
        icono: 'bi-box-seam' 
    },
    { 
        to: '/admin/categorias', 
        texto: 'Categorías', 
        icono: 'bi-tags' 
    },
    { 
        to: '/admin/usuarios', 
        texto: 'Usuarios', 
        icono: 'bi-people' 
    },
    { 
        to: '/admin/reportes', 
        texto: 'Reportes', 
        icono: 'bi-graph-up' 
    },
    { 
        to: '/admin/perfil', 
        texto: 'Perfil', 
        icono: 'bi-person-circle' 
    }
]


function AdminLayout() {
    const { usuario, cerrarSesion } = useAuth()
    const navegar = useNavigate()

    const salir = () => {
        cerrarSesion()
        navegar('/login')
    }

    return (
        <div className="admin-layout d-flex flex-column flex-md-row min-vh-100">
            <aside className="admin-sidebar p-3 flex-shrink-0">
                <div className="mb-4">
                    <div className="admin-marca text-center mb-3">Jacinta</div>
                    <div className="admin-subtitulo">Panel de administración · {usuario.nombre}</div>
                </div>
                
                <nav className="nav nav-pills flex-md-column gap-1">
                    {ENLACES.map((enlace) => (
                        <NavLink key={enlace.to} to={enlace.to} end={enlace.end} className="nav-link">
                            <i className={`bi ${enlace.icono} me-2`} /> {enlace.texto}
                        </NavLink>
                    ))}
                </nav>
                <hr />
                
                <Link to="/" className="btn btn-outline-light btn-sm w-100 mb-2">
                    <i className="bi bi-shop me-1" /> Tienda
                </Link>
                
                <button type="button" className="btn btn-sm w-100 admin-salir" onClick={salir}>
                    <i className="bi bi-box-arrow-right me-1" /> Cerrar sesión
                </button>
            </aside>

            <main className="admin-main flex-grow-1 p-4">
                <Outlet />
            </main>
        </div>

    )
}

export default AdminLayout