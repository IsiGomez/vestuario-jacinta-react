import { LIMITES } from './validaciones'

export const LONGITUDES = Object.freeze({
    run: 12,
    nombre: 50,
    apellidos: 100,
    correo: 100,
    telefono: 25,
    contrasena: LIMITES.contrasenaMax,
    confirmarContrasena: LIMITES.contrasenaMax,
    region: 100,
    comuna: 100,
    direccion: 300,
    descripcion: 500,
    mensaje: 500,
    notas: 500,
})

