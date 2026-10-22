import PaginaPendiente from '../components/PaginaPendiente'
import ProductosAdmin from '../pages/admin/ProductosAdmin'
import ProductoFormulario from '../pages/admin/ProductoFormulario'
import ProductosCriticos from '../pages/admin/ProductosCriticos'
import UsuariosAdmin from '../pages/admin/UsuariosAdmin'
import UsuarioFormulario from '../pages/admin/UsuarioFormulario'
import Perfil from '../pages/admin/Perfil'
import CategoriasAdmin from '../pages/admin/CategoriasAdmin'

const rutasAdmin = [
    { 
        index: true, 
        element: <PaginaPendiente titulo="Dashboard" /> 
    },

    { 
        path: 'ordenes', 
        element: <PaginaPendiente titulo="Órdenes / Boletas" /> 
    },
    { 
        path: 'ordenes/:id', 
        element: <PaginaPendiente titulo="Mostrar boleta" /> 
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
        path: 'productos/reportes', 
        element: <PaginaPendiente titulo="Reportes de productos" /> 
    },

    { 
        path: 'categorias', 
        element: <CategoriasAdmin /> 
    },
    { 
        path: 'categorias/nueva', 
        element: <PaginaPendiente titulo="Nueva categoría" /> 
    },
    { 
        path: 'categorias/:id/editar', 
        element: <PaginaPendiente titulo="Editar categoría" /> 
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
        element: <PaginaPendiente titulo="Historial de compras" /> 
    },

    { 
        path: 'reportes', 
        element: <PaginaPendiente titulo="Reportes" /> 
    },
    { 
        path: 'perfil', 
        element: <Perfil /> 
    },
]

export default rutasAdmin