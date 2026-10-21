import { useParams } from 'react-router-dom'

function PaginaPendiente({ titulo }) {
    const parametros = useParams()
    const hayParametros = Object.keys(parametros).length > 0

    return (
        <div className="py-4">
            <h1 className="h3">{titulo}</h1>
            <p className="text-muted mb-1">Vista pendiente de construir.</p>
            
            {hayParametros && <code>{JSON.stringify(parametros)}</code>}
        </div>
    )
}

export default PaginaPendiente