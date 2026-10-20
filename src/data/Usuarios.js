import bcrypt from 'bcryptjs'
import { leer, guardar, siguienteId, persistir } from '../utils/storage'
import { normalizarRun, normalizarCorreo} from '../utils/validaciones'

const CLAVE = 'jacinta_usuarios'
const COSTO = 10
const ES_HASH = /^\$2[aby]\$\d{2}\$/

export const TIPOS_USUARIO = ['Administrador', 'Cliente']

const usuariosIniciales = [
    {
        id: 1,
        run: '190110222',
        nombre: 'Admin',
        apellidos: 'Jacinta',
        correo: 'admin@duoc.cl',
        //1234
        contrasena: '$2b$10$l0Lx.fhOARhCcccwBhEMKODba2RAm7pqKxTNthCGz0rRU.510BRO2',
        fechaNacimiento: '',
        tipoUsuario: 'Administrador',
        region: 'Valparaíso',
        comuna: 'Viña del Mar',
        direccion: 'Calle Ejemplo 123',
    }
]


// Contraseña
const hashear = (contrasena) =>
    ES_HASH.test(contrasena) ? contrasena : bcrypt.hashSync(contrasena, COSTO)

const sinHash = ({ contrasena, ...resto }) => resto


function prepararContrasena(datos) {
    const copia = { ...datos }

    if (!copia.contrasena) {
        delete copia.contrasena
    } else { 
        copia.contrasena = hashear(copia.contrasena)
    }
    
    return copia
}

function prepararDatos(datos) {
    const copia = prepararContrasena(datos)

    if (copia.run !== undefined) copia.run = normalizarRun(copia.run)
    if (copia.correo !== undefined) copia.correo = normalizarCorreo(copia.correo)

    return copia
}


export function obtenerUsuarios() {
    const guardados = leer(CLAVE, null)
    
    if (guardados === null) {
        const iniciales = structuredClone(usuariosIniciales)
        guardar(CLAVE, iniciales)
        return iniciales
    }
    
    return guardados
}


export function obtenerUsuarioPorId(id) {
    return obtenerUsuarios().find((u) => u.id === Number(id)) ?? null
}


export function obtenerUsuarioPorCorreo(correo) {
    const buscado = normalizarCorreo(correo)
    return obtenerUsuarios().find((u) => normalizarCorreo(u.correo) === buscado) ?? null
}


export function autenticar(correo, contrasena) {
    const usuario = obtenerUsuarioPorCorreo(correo)
    
    if (!usuario || !usuario.contrasena || !bcrypt.compareSync(String(contrasena ?? ''), usuario.contrasena)) return null
        
    return sinHash(usuario)
}


function validarUnicos(usuarios, datos, idActual = null) {
    const repetido = (campo, normalizar) =>
        usuarios.some(
            (u) => u.id !== idActual && normalizar(u[campo]) === normalizar(datos[campo])
        )

    if (datos.run !== undefined && repetido('run', normalizarRun)) {
        throw new Error('Ya existe un usuario con ese RUN')
    }
    if (datos.correo !== undefined && repetido('correo', normalizarCorreo)) {
        throw new Error('Ya existe un usuario con ese correo')
    }
}


export function crearUsuario(datos) {
    const usuarios = obtenerUsuarios()
    validarUnicos(usuarios, datos)
    
    const nuevo = { ...prepararDatos(datos), id: siguienteId(usuarios) }
    persistir(CLAVE, [...usuarios, nuevo])
    
    return sinHash(nuevo)
}


export function actualizarUsuario(id, cambios) {
    const usuarios = obtenerUsuarios()
    const indice = usuarios.findIndex((u) => u.id === Number(id))
    
    if (indice === -1) return null
    
    validarUnicos(usuarios, cambios, usuarios[indice].id)
    
    const actualizado = { ...usuarios[indice], ...prepararDatos(cambios), id: usuarios[indice].id }
    const copia = [...usuarios]
    
    copia[indice] = actualizado
    persistir(CLAVE, copia)
    
    return sinHash(actualizado)
}


export function eliminarUsuario(id) {
    const usuarios = obtenerUsuarios()
    const filtrados = usuarios.filter((u) => u.id !== Number(id))
    
    if (filtrados.length === usuarios.length) return false
    persistir(CLAVE, filtrados)
    
    return true
}


export function restablecerUsuarios() {
    const iniciales = structuredClone(usuariosIniciales)
    persistir(CLAVE, iniciales)
    
    return iniciales
}