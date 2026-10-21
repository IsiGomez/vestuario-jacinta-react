import PaginaPendiente from '../components/PaginaPendiente'
import LoginTemporal from '../pages/pruebas/LoginTemporal'

const rutasTienda = [
    { 
        index: true, 
        element: <PaginaPendiente titulo="Home" /> 
    },
    {
        path: 'productos', 
        element: <PaginaPendiente titulo="Productos" /> 
    },
    {
        path: 'productos/:id', 
        element: <PaginaPendiente titulo="Detalle de producto" /> },
    { 
        path: 'categorias', 
        element: <PaginaPendiente titulo="Categorías" /> },
    { 
        path: 'categorias/:categoria', 
        element: <PaginaPendiente titulo="Categoría" /> 
    },
    { 
        path: 'ofertas', 
        element: <PaginaPendiente titulo="Ofertas" /> 
    },
    { 
        path: 'nosotros', 
        element: <PaginaPendiente titulo="Nosotros" /> 
    },
    { 
        path: 'blog', 
        element: <PaginaPendiente titulo="Blog" /> 
    },
    { 
        path: 'blog/:id', 
        element: <PaginaPendiente titulo="Detalle de blog" /> 
    },
    { 
        path: 'contacto', 
        element: <PaginaPendiente titulo="Contacto" /> 
    },



    { 
        path: 'login', 
        element: <LoginTemporal /> 
    },
    { 
        path: 'registro', 
        element: <PaginaPendiente titulo="Registro de usuario" /> 
    },
    { 
        path: 'carrito', 
        element: <PaginaPendiente titulo="Carrito de compra" /> 
    },
    { 
        path: 'checkout', 
        element: <PaginaPendiente titulo="Checkout (comprar)" /> 
    },
    { 
        path: 'compra/exitosa/:ordenId', 
        element: <PaginaPendiente titulo="Compra exitosa" /> 
    },
    { 
        path: 'compra/error/:ordenId', 
        element: <PaginaPendiente titulo="No se pudo realizar el pago" /> 
    }
]

export default rutasTienda