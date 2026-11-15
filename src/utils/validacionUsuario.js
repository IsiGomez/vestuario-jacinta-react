export function validarClave(valor) {
    if (!valor || valor.trim().length === 0 || valor.length < 8 || new TextEncoder().encode(valor).length > 72) {
        return 'La contraseña debe tener al menos 8 caracteres y máximo 72 bytes'
    }
    return null
}
