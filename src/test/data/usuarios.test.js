import { describe, it, expect } from 'vitest'
import bcrypt from 'bcryptjs'
import {
    TIPOS_USUARIO,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    obtenerUsuarioPorCorreo,
    autenticar,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    restablecerUsuarios,
} from '../../data/usuarios'
import { leer } from '../../utils/storage'

const nuevoCliente = (extra = {}) => ({
    run: '12.345.678-5',
    nombre: 'Camila',
    apellidos: 'Rojas Pérez',
    correo: 'Camila@Gmail.com',
    contrasena: 'abcd',
    tipoUsuario: 'Cliente',
    ...extra,
})


describe('TIPOS_USUARIO', () => {
    it('define los tipos Administrador y Cliente', () => {
        expect(TIPOS_USUARIO).toEqual(['Administrador', 'Cliente'])
    })
})


describe('obtenerUsuarios', () => {
    it('carga el administrador inicial y lo guarda en localStorage', () => {
        const usuarios = obtenerUsuarios()
        expect(usuarios).toHaveLength(1)
        expect(usuarios[0]).toMatchObject({ id: 1, correo: 'admin@duoc.cl', tipoUsuario: 'Administrador' })
        expect(leer('jacinta_usuarios')).toEqual(usuarios)
    })

    it('la contraseña inicial está hasheada y corresponde a "1234"', () => {
        const [admin] = obtenerUsuarios()
        expect(admin.contrasena).not.toBe('1234')
        expect(bcrypt.compareSync('1234', admin.contrasena)).toBe(true)
    })

    it('devuelve los datos ya guardado en vez de volver a crear el usuario inicial', () => {
        localStorage.setItem('jacinta_usuarios', JSON.stringify([]))
        expect(obtenerUsuarios()).toEqual([])
    })

    it('cada llamada entrega una copia para no alterar los datos originales', () => {
        const primeros = obtenerUsuarios()
        primeros[0].nombre = 'Modificado'
        localStorage.clear()
        expect(obtenerUsuarios()[0].nombre).toBe('Admin')
    })
})


describe('obtenerUsuarioPorId / obtenerUsuarioPorCorreo', () => {
    it('encuentra al usuario por id, incluso si llega como string', () => {
        expect(obtenerUsuarioPorId(1).correo).toBe('admin@duoc.cl')
        expect(obtenerUsuarioPorId('1').correo).toBe('admin@duoc.cl')
    })

    it('devuelve null si el usuario no existe', () => {
        expect(obtenerUsuarioPorId(999)).toBeNull()
        expect(obtenerUsuarioPorCorreo('nadie@gmail.com')).toBeNull()
    })

    it('busca por correo sin importar mayúsculas ni espacios', () => {
        expect(obtenerUsuarioPorCorreo('  ADMIN@Duoc.cl ').id).toBe(1)
    })
})


describe('autenticar', () => {
    it('permite iniciar sesión y devuelve los datos sin mostrar la contraseña', () => {
        const usuario = autenticar('admin@duoc.cl', '1234')
        expect(usuario).toMatchObject({ id: 1, tipoUsuario: 'Administrador' })
        expect(usuario).not.toHaveProperty('contrasena')
    })

    it('el correo no distingue mayúsculas', () => {
        expect(autenticar('ADMIN@DUOC.CL', '1234')).not.toBeNull()
    })

    it('devuelve null con contraseña incorrecta', () => {
        expect(autenticar('admin@duoc.cl', 'mala')).toBeNull()
    })

    it('devuelve null si el correo no existe', () => {
        expect(autenticar('nadie@gmail.com', '1234')).toBeNull()
    })

    it('devuelve null si la contraseña es undefined/null/vacía', () => {
        expect(autenticar('admin@duoc.cl', undefined)).toBeNull()
        expect(autenticar('admin@duoc.cl', null)).toBeNull()
        expect(autenticar('admin@duoc.cl', '')).toBeNull()
    })

    it('devuelve null si el usuario no tiene contraseña guardada', () => {
        localStorage.setItem('jacinta_usuarios', JSON.stringify([{ id: 5, correo: 'a@duoc.cl' }]))
        expect(autenticar('a@duoc.cl', 'algo')).toBeNull()
    })
})


describe('crearUsuario', () => {
    it('asigna el siguiente id y no devuelve la contraseña', () => {
        const creado = crearUsuario(nuevoCliente())
        expect(creado.id).toBe(2)
        expect(creado).not.toHaveProperty('contrasena')
    })

    it('normaliza RUN y correo al guardar', () => {
        const creado = crearUsuario(nuevoCliente())
        expect(creado.run).toBe('123456785')
        expect(creado.correo).toBe('camila@gmail.com')
    })

    it('hashea la contraseña y luego permite iniciar sesión', () => {
        crearUsuario(nuevoCliente())
        const guardado = obtenerUsuarioPorId(2)
        expect(guardado.contrasena).toMatch(/^\$2[aby]\$/)
        expect(autenticar('camila@gmail.com', 'abcd')).not.toBeNull()
    })

    it('no vuelve a hashear una contraseña que ya es un hash', () => {
        const hash = bcrypt.hashSync('xyz1', 4)
        crearUsuario(nuevoCliente({ contrasena: hash }))
        expect(obtenerUsuarioPorId(2).contrasena).toBe(hash)
    })

    it('guarda el nuevo usuario en la lista', () => {
        crearUsuario(nuevoCliente())
        expect(obtenerUsuarios()).toHaveLength(2)
    })

    it('rechaza un RUN repetido (aunque venga con otro formato)', () => {
        crearUsuario(nuevoCliente())
        expect(() => crearUsuario(nuevoCliente({ run: '123456785', correo: 'otro@gmail.com' })))
            .toThrow('Ya existe un usuario con ese RUN')
    })

    it('rechaza un correo repetido (sin distinguir mayúsculas)', () => {
        expect(() => crearUsuario(nuevoCliente({ correo: 'ADMIN@duoc.cl' })))
            .toThrow('Ya existe un usuario con ese correo')
    })

    it('no guarda nada si falla la validación de únicos', () => {
        try { crearUsuario(nuevoCliente({ correo: 'admin@duoc.cl' })) } catch { /* esperado */ }
        expect(obtenerUsuarios()).toHaveLength(1)
    })
})


describe('actualizarUsuario', () => {
    it('devuelve null si el usuario no existe', () => {
        expect(actualizarUsuario(999, { nombre: 'X' })).toBeNull()
    })

    it('actualiza campos y no expone la contraseña', () => {
        const actualizado = actualizarUsuario(1, { nombre: 'Nuevo' })
        expect(actualizado.nombre).toBe('Nuevo')
        expect(actualizado).not.toHaveProperty('contrasena')
        expect(obtenerUsuarioPorId(1).nombre).toBe('Nuevo')
    })

    it('conserva la contraseña actual si no se envía una nueva (o viene vacía)', () => {
        const antes = obtenerUsuarioPorId(1).contrasena
        actualizarUsuario(1, { nombre: 'X', contrasena: '' })
        expect(obtenerUsuarioPorId(1).contrasena).toBe(antes)
        expect(autenticar('admin@duoc.cl', '1234')).not.toBeNull()
    })

    it('cambia la contraseña cuando se envía una nueva', () => {
        actualizarUsuario(1, { contrasena: 'nueva1' })
        expect(autenticar('admin@duoc.cl', 'nueva1')).not.toBeNull()
        expect(autenticar('admin@duoc.cl', '1234')).toBeNull()
    })

    it('no permite modificar el id del usuario', () => {
        const actualizado = actualizarUsuario(1, { id: 50, nombre: 'X' })
        expect(actualizado.id).toBe(1)
    })

    it('permite conservar su propio correo/RUN (no se cuenta como repetido)', () => {
        expect(() => actualizarUsuario(1, { correo: 'ADMIN@duoc.cl', run: '19.011.022-2' })).not.toThrow()
    })

    it('rechaza usar el correo o RUN de otro usuario', () => {
        crearUsuario(nuevoCliente())
        expect(() => actualizarUsuario(2, { correo: 'admin@duoc.cl' })).toThrow('Ya existe un usuario con ese correo')
        expect(() => actualizarUsuario(2, { run: '190110222' })).toThrow('Ya existe un usuario con ese RUN')
    })

    it('normaliza el correo al actualizar', () => {
        expect(actualizarUsuario(1, { correo: 'NUEVO@Duoc.cl' }).correo).toBe('nuevo@duoc.cl')
    })
})


describe('eliminarUsuario', () => {
    it('elimina el usuario y confirma con true', () => {
        crearUsuario(nuevoCliente())
        expect(eliminarUsuario(2)).toBe(true)
        expect(obtenerUsuarioPorId(2)).toBeNull()
    })

    it('acepta el id como string', () => {
        crearUsuario(nuevoCliente())
        expect(eliminarUsuario('2')).toBe(true)
    })

    it('devuelve false si el usuario no existe', () => {
        expect(eliminarUsuario(999)).toBe(false)
    })
})


describe('restablecerUsuarios', () => {
    it('vuelve a dejar los usuarios como al principio', () => {
        crearUsuario(nuevoCliente())
        const iniciales = restablecerUsuarios()
        expect(iniciales).toHaveLength(1)
        expect(obtenerUsuarios()).toHaveLength(1)
        expect(obtenerUsuarioPorId(1).correo).toBe('admin@duoc.cl')
    })
})