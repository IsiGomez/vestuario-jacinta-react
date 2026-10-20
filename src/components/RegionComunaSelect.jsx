import { useId } from 'react'
import { obtenerRegiones, obtenerComunas } from '../data/RegionComuna'


function RegionComunaSelect({ region, comuna, onChange, disabled = false }) {
  const id = useId()

  const cambiarRegion = (e) => onChange({ region: e.target.value, comuna: '' })

  const cambiarComuna = (e) => onChange({ region, comuna: e.target.value })

  return (
    <div className="row g-3">
        <div className="col-md-6">
            <label htmlFor={`${id}-region`} className="form-label">Región</label>
            <select
            id={`${id}-region`}
            className="form-select"
            value={region}
            onChange={cambiarRegion}
            disabled={disabled}
            >
                <option value="">-- Selecciona Región --</option>
                {obtenerRegiones().map((re) => (
                    <option key={re} value={re}>{re}</option>
                ))}
            </select>
        </div>

        <div className="col-md-6">
            <label htmlFor={`${id}-comuna`} className="form-label">Comuna</label>
            <select
            id={`${id}-comuna`}
            className="form-select"
            value={comuna}
            onChange={cambiarComuna}
            disabled={disabled || !region}
            >
                <option value="">-- Selecciona Comuna --</option>
                {obtenerComunas(region).map((com) => (
                    <option key={com} value={com}>{com}</option>
                ))}
            </select>
        </div>
    </div>
  )
}

export default RegionComunaSelect