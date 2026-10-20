export function leer(clave, porDefecto = null) {
    try {
        const crudo = localStorage.getItem(clave)
        return crudo === null ? porDefecto : JSON.parse(crudo)
    
    } catch {
        return porDefecto
    }
}


export function guardar(clave, valor) {
    try {
        localStorage.setItem(clave, JSON.stringify(valor))    
        return true

    } catch {
        return false
    }
}


export const siguienteId = (lista) =>
  lista.reduce((max, item) => Math.max(max, item.id), 0) + 1