import PruebaRegiones from './PruebaRegiones'
import PruebaUsuarios from './PruebaUsuarios'

function PaginaPruebas() {
  return (
    <div className="container mt-5">
      <h1 className="text-center my-5">Vestuario Jacinta</h1>
      <PruebaRegiones />
      <PruebaUsuarios />
    </div>
  )
}

export default PaginaPruebas