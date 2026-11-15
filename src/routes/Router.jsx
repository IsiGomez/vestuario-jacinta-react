import { createBrowserRouter } from 'react-router-dom'
import TiendaLayout from '../layouts/TiendaLayout'
import AdminLayout from '../layouts/AdminLayout'
import RutaProtegida from './RutaProtegida'
import rutasTienda from './RutasTienda'
import rutasAdmin from './RutasAdmin'
import NoEncontrada from '../pages/NoEncontrada'
import { ROLES } from '../utils/roles'
import PaginaPruebas from '../pages/pruebas/PaginaPruebas'


export const router = createBrowserRouter([
    { 
        path: '/', element: 
        <TiendaLayout />, 
        children: rutasTienda 
    },
    {
        path: '/admin',
        element: (
        <RutaProtegida roles={[ROLES.ADMINISTRADOR, ROLES.VENDEDOR]}>
            <AdminLayout />
        </RutaProtegida>
        ),
        children: rutasAdmin.map((ruta) => ({ ...ruta, element: (
            <RutaProtegida roles={ruta.roles}><>{ruta.element}</></RutaProtegida>
        ) })),
    },

    { path: '/pruebas', element: <PaginaPruebas /> },
    { path: '*', element: <NoEncontrada /> },
], { basename: import.meta.env.BASE_URL })