import PruebaRegiones from './pages/pruebas/PruebaRegiones'
import PruebaProductos from './pages/pruebas/PruebaProductos' 
import PruebaProductosCard from './pages/pruebas/PruebaProductoCard' 
import { obtenerProductos } from './data/productos'
import PruebaUsuarios from './pages/pruebas/PruebaUsuarios'
import PruebaValidaciones from './pages/pruebas/PruebaValidaciones'
import { AuthProvider } from './context/AuthProvider' // Ajusta la ruta
import PruebaAuth from './pages/pruebas/PruebaAuth'

function App() {
  const productos = obtenerProductos()
  const productoEjemplo = productos[0]
  
  return (
    <AuthProvider>
      <PruebaAuth />
    </AuthProvider>
  )
}
 
export default App
