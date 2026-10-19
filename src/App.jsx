import { useState } from 'react'
import { regiones, obtenerRegiones, obtenerComunas } from './data/regiones'

function App() {
  const [regionSeleccionada, setRegionSeleccionada] = useState('')
  const comunasDisponibles = obtenerComunas(regionSeleccionada)

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h1 className="text-center my-5">Vestuario Jacinta</h1>
      <h2 className="mb-4">Prueba de Regiones y Comunas</h2>

      <div className="mb-3">
        <label className="form-label">Selecciona una Región:</label>
        <select 
          className="form-select"
          value={regionSeleccionada}
          onChange={(e) => setRegionSeleccionada(e.target.value)}
        >
          <option value="">-- Selecciona Región --</option>
          {obtenerRegiones().map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Selecciona una Comuna:</label>
        <select 
          className="form-select" 
          disabled={!regionSeleccionada}
        >
          <option value="">-- Selecciona Comuna --</option>
          {comunasDisponibles.map((comuna) => (
            <option key={comuna} value={comuna}>
              {comuna}
            </option>
          ))}
        </select>
      </div>

    </div>
  )
}

export default App