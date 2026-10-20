import bcrypt from 'bcryptjs'
import { leer, guardar, siguienteId } from '../utils/storage'

const CLAVE = 'jacinta_usuarios'
const COSTO = 10
const ES_HASH = /^\$2[aby]\$\d{2}\$/

export const TIPOS_USUARIO = ['Administrador', 'Cliente', 'Vendedor']

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

const hashear = (contrasena) => {
    ES_HASH.test(contrasena) ? contrasena : bcrypt.hashSync(contrasena, COSTO)
}

function prepararContrasena(datos) {
    const copia = { ...datos }

    if (!copia.contrasena) {
        delete copia.contrasena
    } else { 
        copia.contrasena = hashear(copia.contrasena)
    }
    
    return copia
}

function persistir(lista) {
  if (!guardar(CLAVE, lista)) {
    throw new Error('No se pudo guardar: el almacenamiento del navegador está lleno o no disponible')
  }
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
    const buscado = correo.trim().toLowerCase()
    return obtenerUsuarios().find((u) => u.correo.toLowerCase() === buscado) ?? null
}


export function autenticar(correo, contrasena) {
    const usuario = obtenerUsuarioPorCorreo(correo)
    
    if (!usuario || !bcrypt.compareSync(contrasena, usuario.contrasena)) return null
    
    const sinHash = { ...usuario }
    delete sinHash.contrasena
    
    return sinHash
}


function validarUnicos(usuarios, datos, idActual = null) {
    const repetido = (campo) =>{
        usuarios.some(
            (u) =>
            u.id !== idActual &&
            String(u[campo]).toLowerCase() === String(datos[campo]).toLowerCase(),
        )
    
        if (datos.run !== undefined && repetido('run')) throw new Error('Ya existe un usuario con ese RUN')
    
        if (datos.correo !== undefined && repetido('correo')) throw new Error('Ya existe un usuario con ese correo')

    }
}



export function crearUsuario(datos) {
    const usuarios = obtenerUsuarios()
    validarUnicos(usuarios, datos)
    
    const nuevo = { ...prepararContrasena(datos), id: siguienteId(usuarios) }
    persistir([...usuarios, nuevo])
    
    return nuevo
}


export function actualizarUsuario(id, cambios) {
    const usuarios = obtenerUsuarios()
    const indice = usuarios.findIndex((u) => u.id === Number(id))
    
    if (indice === -1) return null
    
    validarUnicos(usuarios, cambios, usuarios[indice].id)
    
    const actualizado = { ...usuarios[indice], ...prepararContrasena(cambios), id: usuarios[indice].id }
    const copia = [...usuarios]
    
    copia[indice] = actualizado
    persistir(copia)
    
    return actualizado
}


export function eliminarUsuario(id) {
    const usuarios = obtenerUsuarios()
    const filtrados = usuarios.filter((u) => u.id !== Number(id))
    
    if (filtrados.length === usuarios.length) return false
    persistir(filtrados)
    
    return true
}


export function restablecerUsuarios() {
    const iniciales = structuredClone(usuariosIniciales)
    persistir(iniciales)
    
    return iniciales
}