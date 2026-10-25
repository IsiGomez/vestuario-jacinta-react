import PaginaPendiente from '../components/PaginaPendiente'
import Login from '../pages/tienda/Login'
import Registro from '../pages/tienda/Registro'
import Productos from '../pages/tienda/Productos'
import DetalleProducto from '../pages/tienda/DetalleProducto'
import Inicio from '../pages/tienda/Inicio'
import Carrito from '../pages/tienda/Carrito'
import Nosotros from '../pages/tienda/Nosotros'
import Contacto from '../pages/tienda/Contacto'
import Blog from '../pages/tienda/Blog'
import DetalleBlog from '../pages/tienda/DetalleBlog'
import Categoria from '../pages/tienda/Categoria'
import Categorias from '../pages/tienda/Categorias'
import Ofertas from '../pages/tienda/Ofertas'

const rutasTienda = [
    { 
        index: true, 
        element: <Inicio /> 
    },
    {
        path: 'productos', 
        element: <Productos /> 
    },
    {
        path: 'productos/:id', 
        element: <DetalleProducto /> 
    },
    { 
        path: 'categorias', 
        element: <Categorias /> },
    { 
        path: 'categorias/:categoria', 
        element: <Categoria /> 
    },
    { 
        path: 'ofertas', 
        element: <Ofertas /> 
    },
    { 
        path: 'nosotros', 
        element: <Nosotros /> 
    },
    { 
        path: 'blog', 
        element: <Blog /> 
    },
    { 
        path: 'blog/:id', 
        element: <DetalleBlog /> 
    },
    { 
        path: 'contacto', 
        element: <Contacto /> 
    },



    { 
        path: 'login', 
        element: <Login /> 
    },
    { 
        path: 'registro', 
        element: <Registro /> 
    },
    { 
        path: 'carrito', 
        element: <Carrito /> 
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