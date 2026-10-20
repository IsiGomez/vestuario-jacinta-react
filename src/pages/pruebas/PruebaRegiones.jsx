import { useState } from 'react'
import RegionComunaSelect from '../../components/RegionComunaSelect'

function PruebaRegiones() {
  const [ubicacion, setUbicacion] = useState({ region: '', comuna: '' })

  return (
    <section className="mb-5">
      <h2 className="mb-4">Prueba de Regiones y Comunas</h2>
      <RegionComunaSelect {...ubicacion} onChange={setUbicacion} />
    </section>
  )
}

export default PruebaRegiones