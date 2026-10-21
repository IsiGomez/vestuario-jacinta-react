import { AuthProvider } from './context/AuthProvider'
import { router } from './routes/Router'
import { RouterProvider } from 'react-router-dom'

function App() {  
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
 
export default App
