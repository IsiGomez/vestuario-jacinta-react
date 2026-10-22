import Campo from './Campo'
import { normalizarRun } from '../utils/validaciones'

function InputRun({ valor, error, onChange, disabled = false }) {
    const manejarCambio = (e) => {
        onChange(e)
    }

    return (
        <Campo 
            etiqueta="RUN" 
            nombre="run" 
            valor={valor} 
            error={error} 
            onChange={manejarCambio}
            placeholder="Ej: 19.011.022-2 o 190110222" 
            maxLength={12}
            disabled={disabled}
        />
    )
}

export default InputRun