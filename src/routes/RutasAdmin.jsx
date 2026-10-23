import PaginaPendiente from '../components/PaginaPendiente'
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

const rutasAdmin = [
    { 
        index: true, 
        element: <PaginaPendiente titulo="Dashboard" /> 
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

export default rutasAdmin