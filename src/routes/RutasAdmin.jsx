import PaginaPendiente from '../components/PaginaPendiente'

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
        element: <PaginaPendiente titulo="Productos" /> 
    },
    { 
        path: 'productos/nuevo', 
        element: <PaginaPendiente titulo="Nuevo producto" /> 
    },
    { 
        path: 'productos/:id/editar', 
        element: <PaginaPendiente titulo="Editar producto" /> 
    },
    { 
        path: 'productos/criticos', 
        element: <PaginaPendiente titulo="Listado de productos críticos" /> 
    },
    { 
        path: 'productos/reportes', 
        element: <PaginaPendiente titulo="Reportes de productos" /> 
    },

    { 
        path: 'categorias', 
        element: <PaginaPendiente titulo="Categorías" /> 
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
        element: <PaginaPendiente titulo="Usuarios" /> 
    },
    { 
        path: 'usuarios/nuevo', 
        element: <PaginaPendiente titulo="Nuevo usuario" /> 
    },
    { 
        path: 'usuarios/:id/editar', 
        element: <PaginaPendiente titulo="Editar usuario" /> 
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
        element: <PaginaPendiente titulo="Perfil" /> 
    },
]

export default rutasAdmin