import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROLES } from '../utils/roles'
import ProductosAdmin from '../pages/admin/ProductosAdmin'
import ProductoFormulario from '../pages/admin/ProductoFormulario'
import ProductosCriticos from '../pages/admin/ProductosCriticos'
import UsuariosAdmin from '../pages/admin/UsuariosAdmin'
import UsuarioFormulario from '../pages/admin/UsuarioFormulario'
import Perfil from '../pages/admin/Perfil'
import CategoriasAdmin from '../pages/admin/CategoriasAdmin'
import CategoriaFormulario from '../pages/admin/CategoriaFormulario'
import OrdenesAdmin from '../pages/admin/OrdenesAdmin'
import BoletaAdmin from '../pages/admin/BoletaAdmin'
import ReportesAdmin from '../pages/admin/ReportesAdmin'
import ReportesProductos from '../pages/admin/ReportesProductos'
import HistorialCompras from '../pages/admin/HistorialCompras'
import Dashboard from '../pages/admin/Dashboard'

function EntradaAdmin() {
    const { esAdmin } = useAuth()
    return esAdmin ? <Dashboard /> : <Navigate to="/admin/productos" replace />
}
const rutasAdmin = [
    { 
        index: true, 
        element: <EntradaAdmin />
    },

    { 
        path: 'ordenes', 
        element: <OrdenesAdmin /> 
    },
    { 
        path: 'ordenes/:id', 
        element: <BoletaAdmin /> 
    },
    {
        path: 'productos',
        element: <ProductosAdmin />
    },
    {
        path: 'productos/nuevo',
        element: <ProductoFormulario />
    },
    { 
        path: 'productos/:id/editar', 
        element: <ProductoFormulario /> 
    },
    { 
        path: 'productos/criticos', 
        element: <ProductosCriticos /> 
    },
    { 
        path: 'reportes/productos', 
        element: <ReportesProductos /> 
    },

    { 
        path: 'categorias', 
        element: <CategoriasAdmin /> 
    },
    { 
        path: 'categorias/nueva', 
        element: <CategoriaFormulario /> 
    },
    { 
        path: 'categorias/:id/editar', 
        element: <CategoriaFormulario /> 
    },

    { 
        path: 'usuarios', 
        element: <UsuariosAdmin /> 
    },
    { 
        path: 'usuarios/nuevo', 
        element: <UsuarioFormulario /> 
    },
    { 
        path: 'usuarios/:id/editar', 
        element: <UsuarioFormulario /> 
    },
    { 
        path: 'usuarios/:id/historial', 
        element: <HistorialCompras /> 
    },

    { 
        path: 'reportes', 
        element: <ReportesAdmin /> 
    },
    { 
        path: 'perfil', 
        element: <Perfil /> 
    },
]

const soloAdmin = ['usuarios', 'categorias/nueva', 'categorias/:id/editar']
for (const ruta of rutasAdmin) {
    ruta.roles = (ruta.path === 'reportes' || soloAdmin.some((prefijo) => ruta.path === prefijo || ruta.path?.startsWith(`${prefijo}/`)))
        ? [ROLES.ADMINISTRADOR] : [ROLES.ADMINISTRADOR, ROLES.VENDEDOR]
}
export default rutasAdmin