import { AuthProvider } from './context/AuthProvider'
import { CarritoProvider } from './context/CarritoContext'
import { router } from './routes/Router'
import { RouterProvider } from 'react-router-dom'

function App() {  
  return (
    <AuthProvider>
      <CarritoProvider>
        <RouterProvider router={router} />
      </CarritoProvider>
    </AuthProvider>
  )
}
 
export default App
