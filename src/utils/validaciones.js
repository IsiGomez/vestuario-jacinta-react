export const LIMITES = {
    maxNombre: 50,
    minNombre: 2,

    maxApellidos: 100,
    minApellidos: 2,
    
    maxCorreo: 100,
    maxDireccion: 300,
    minDireccion: 10,
    
    contrasenaMin: 4,
    contrasenaMax: 10,
    
    maxEdad: 110,
    minEdad: 18,

    minPrecio: 100,
}


const vacio = (valor) => valor === undefined || valor === null || String(valor).trim() === ''

const runValido = /^(?:(?:\d{1,2}\.\d{3}\.\d{3})|\d{6,8})-?[\dKk]$/
const dominiosPermitidos = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com']
const correoPermitido = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/

// RUN
export const normalizarRun = (run) => String(run ?? '').replace(/[.\-\s]/g, '').toUpperCase()

export function calcularDvRun(cuerpo) {
    let suma = 0
    let factor = 2

    for (const digito of String(cuerpo).split('').reverse()) {
        suma += Number(digito) * factor
        factor = factor === 7 ? 2 : factor + 1
    }
    
    const resto = 11 - (suma % 11)
    
    if (resto === 11) return '0'
    if (resto === 10) return 'K'
    
    return String(resto)
}


export function validarRun(run) {
    if (vacio(run)) return 'El RUN es obligatorio'
    
    const texto = String(run).trim().toUpperCase()
    
    if (!runValido.test(texto)) {
        return 'El RUN debe tener un formato válido (ej: 19011022-2, 19.011.022-2 o 190110222)'
    }
    
    const limpio = normalizarRun(texto)
    const cuerpo = limpio.slice(0, -1)
    const dv = limpio.slice(-1)
    
    if (calcularDvRun(cuerpo) !== dv) return 'El RUN no es válido (dígito verificador incorrecto)'
    
    return null
}

//  Llenado
export function validarRequerido(valor, campo = 'campo') {
    return vacio(valor) ? `${campo} es obligatorio` : null
}

// Texto
export function validarTexto(valor, { campo = 'campo', max = 100, min = 1, obligatorio = true } = {}) {
    if (vacio(valor)) {
        return obligatorio ? `${campo} es obligatorio` : null
    }

    if (String(valor).trim().length > max) {
        return `${campo}: máximo ${max} caracteres.`
    }
    if (String(valor).trim().length < min) {
        return `${campo}: mínimo ${min} caracteres.`
    }

    return null
}

export const validarNombre = (valor) => validarTexto(valor, { campo: 'El nombre', max: LIMITES.maxNombre, min: LIMITES.minNombre })
export const validarApellidos = (valor) => validarTexto(valor, { campo: 'Los apellidos', max: LIMITES.maxApellidos, min: LIMITES.minApellidos })
export const validarDireccion = (valor) => validarTexto(valor, { campo: 'La dirección', max: LIMITES.maxDireccion, min: LIMITES.minDireccion})


// Correo / Contraseña
export function validarCorreo(correo) {
    if (vacio(correo)) return 'El correo es obligatorio'
    
    const texto = String(correo).trim().toLowerCase()
    
    if (texto.length > LIMITES.maxCorreo) {
        return `El correo no puede superar los ${LIMITES.maxCorreo} caracteres`
    }

    if (!correoPermitido.test(texto)) {
        const permitidosTexto = dominiosPermitidos.map(d => `@${d}`).join(', ')
        return `Solo se permiten correos con ${permitidosTexto}`
    }

    return null
}

export function validarContrasena(contrasena) {
    if (vacio(contrasena)) return 'La contraseña es obligatoria'
    
    const largo = String(contrasena).length
    
    if (largo < LIMITES.contrasenaMin || largo > LIMITES.contrasenaMax) {
        return `La contraseña debe tener entre ${LIMITES.contrasenaMin} y ${LIMITES.contrasenaMax} caracteres`
    }
    
    return null
}


//Fecha
export function calcularEdad(fecha, hoy = new Date()) {
    const nacimiento = new Date(`${fecha}T00:00:00`)
    
    if (Number.isNaN(nacimiento.getTime())) return null
    let edad = hoy.getFullYear() - nacimiento.getFullYear()
    
    const antesDelCumple =
        hoy.getMonth() < nacimiento.getMonth() ||
        (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate())
    
    if (antesDelCumple) edad -= 1
    
    return edad
}

export function validarFechaNacimiento(fecha, { obligatoria = false, edadMinima = LIMITES.minEdad, edadMaxima = LIMITES.maxEdad } = {}) {
    if (vacio(fecha)) {
        return obligatoria ? 'La fecha de nacimiento es obligatoria' : null
    }
    const edad = calcularEdad(fecha)

    if (edad === null) return 'La fecha de nacimiento no es válida'
    if (edad < 0) return 'La fecha de nacimiento no puede ser futura'
    if (edad < edadMinima) return `Debes tener al menos ${edadMinima} años`
    if (edad > edadMaxima) return `Debes tener máximo ${edadMaxima} años`

    return null
}


// Numeros
export function validarPrecio(valor) {
    if (vacio(valor)) return 'El precio es obligatorio'
    
    const numero = Number(valor)
    
    if (!Number.isInteger(numero) || numero < LIMITES.minPrecio) return `El precio debe ser un número entero mayor o igual a ${LIMITES.minPrecio}`
    
    return null
}

export function validarEnteroNoNegativo(valor, campo = 'El valor') {
    if (vacio(valor)) return `${campo} es obligatorio`
    
    const numero = Number(valor)
    
    if (!Number.isInteger(numero) || numero < 0) {
        return `${campo} debe ser un número entero igual o mayor a 0`
    }
    
    return null
}