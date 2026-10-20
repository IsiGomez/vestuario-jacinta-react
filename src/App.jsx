import PruebaRegiones from './pages/pruebas/PruebaRegiones'
import PruebaProductos from './pages/pruebas/PruebaProductos' 
import PruebaProductosCard from './pages/pruebas/PruebaProductoCard' 
import { obtenerProductos } from './data/productos'

function App() {
  const productos = obtenerProductos()
  const productoEjemplo = productos[0]
  
  return (
    <div className="container mt-5" style={{ maxWidth: '700px' }}>
      <h1 className="text-center my-5">Vestuario Jacinta</h1>
      
      <PruebaRegiones />
      <PruebaProductos />
      {productoEjemplo && (
        <PruebaProductosCard producto={productoEjemplo} />
      )}
    </div>
  )
}
 
export default App
