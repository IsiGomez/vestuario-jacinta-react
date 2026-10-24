import { describe, it, expect } from 'vitest'
import {
    LIMITES,
    normalizarCorreo,
    normalizarRun,
    calcularDvRun,
    validarRun,
    validarRequerido,
    validarTexto,
    validarNombre,
    validarApellidos,
    validarDireccion,
    validarCorreo,
    validarContrasena,
    calcularEdad,
    validarFechaNacimiento,
    validarPrecio,
    validarEnteroNoNegativo,
} from '../../utils/validaciones'


describe('normalizarRun / normalizarCorreo', () => {
    it('normalizarRun quita puntos, guion y espacios y pasa a mayúscula', () => {
        expect(normalizarRun(' 19.011.022-2 ')).toBe('190110222')
        expect(normalizarRun('12.345.678-k')).toBe('12345678K')
    })

    it('normalizarRun tolera null/undefined', () => {
        expect(normalizarRun(null)).toBe('')
        expect(normalizarRun(undefined)).toBe('')
    })

    it('normalizarCorreo recorta y pasa a minúscula', () => {
        expect(normalizarCorreo('  Admin@DUOC.cl ')).toBe('admin@duoc.cl')
        expect(normalizarCorreo(null)).toBe('')
    })
})


describe('calcularDvRun', () => {
    it('calcula un dígito numérico', () => {
        expect(calcularDvRun('19011022')).toBe('2')
    })

    it('devuelve K cuando el resto da 10', () => {
        expect(calcularDvRun('12345678')).toBe('5')
        expect(calcularDvRun('10000013')).toBe('K')
    })

    it('devuelve 0 cuando el resto da 11', () => {
        expect(calcularDvRun('10000004')).toBe('0')
    })
})


describe('validarRun', () => {
    it('exige el RUN', () => {
        expect(validarRun('')).toBe('El RUN es obligatorio')
        expect(validarRun('   ')).toBe('El RUN es obligatorio')
        expect(validarRun(null)).toBe('El RUN es obligatorio')
    })

    it.each(['19011022-2', '19.011.022-2', '190110222'])('acepta el formato válido %s', (run) => {
        expect(validarRun(run)).toBeNull()
    })

    it('acepta K en minúscula', () => {
        expect(validarRun('10000013-k')).toBeNull()
    })

    it.each(['abc', '123', '1.23.456-7', '19011022-22', '1901102223456'])('rechaza el formato inválido %s', (run) => {
        expect(validarRun(run)).toMatch(/formato válido/)
    })

    it('rechaza un dígito verificador incorrecto', () => {
        expect(validarRun('19011022-3')).toMatch(/dígito verificador incorrecto/)
    })
})


describe('validarRequerido', () => {
    it('devuelve error si está vacío', () => {
        expect(validarRequerido('', 'La región')).toBe('La región es obligatorio')
        expect(validarRequerido(undefined)).toBe('campo es obligatorio')
    })

    it('devuelve null si hay valor', () => {
        expect(validarRequerido('x')).toBeNull()
        expect(validarRequerido(0)).toBeNull()
    })
})


describe('validarTexto', () => {
    it('es obligatorio por defecto', () => {
        expect(validarTexto('', { campo: 'El título' })).toBe('El título es obligatorio')
    })

    it('permite vacío si no es obligatorio', () => {
        expect(validarTexto('', { obligatorio: false })).toBeNull()
    })

    it('valida el máximo ignorando espacios de los bordes', () => {
        expect(validarTexto('abcdef', { campo: 'X', max: 5 })).toBe('X: máximo 5 caracteres.')
        expect(validarTexto('  abcde  ', { campo: 'X', max: 5 })).toBeNull()
    })

    it('valida el mínimo', () => {
        expect(validarTexto('ab', { campo: 'X', min: 3 })).toBe('X: mínimo 3 caracteres.')
        expect(validarTexto('abc', { campo: 'X', min: 3 })).toBeNull()
    })
})


describe('validarNombre / validarApellidos / validarDireccion', () => {
    it('validarNombre respeta los límites', () => {
        expect(validarNombre('A')).toMatch(/mínimo 2/)
        expect(validarNombre('Ana')).toBeNull()
        expect(validarNombre('a'.repeat(LIMITES.maxNombre + 1))).toMatch(/máximo 50/)
        expect(validarNombre('')).toBe('El nombre es obligatorio')
    })

    it('validarApellidos respeta los límites', () => {
        expect(validarApellidos('P')).toMatch(/mínimo 2/)
        expect(validarApellidos('Pérez Soto')).toBeNull()
        expect(validarApellidos('a'.repeat(101))).toMatch(/máximo 100/)
    })

    it('validarDireccion respeta los límites', () => {
        expect(validarDireccion('Calle 1')).toMatch(/mínimo 10/)
        expect(validarDireccion('Calle Ejemplo 123')).toBeNull()
        expect(validarDireccion('a'.repeat(301))).toMatch(/máximo 300/)
    })
})


describe('validarCorreo', () => {
    it('exige el correo', () => {
        expect(validarCorreo('')).toBe('El correo es obligatorio')
    })

    it.each(['a@duoc.cl', 'a@profesor.duoc.cl', 'a@gmail.com', '  A@GMAIL.COM  '])('acepta %s', (correo) => {
        expect(validarCorreo(correo)).toBeNull()
    })

    it.each(['a@hotmail.com', 'sin-arroba.cl', 'a@duoc.cl.evil.com', 'a b@duoc.cl'])('rechaza %s', (correo) => {
        expect(validarCorreo(correo)).toMatch(/Solo se permiten correos/)
    })

    it('el mensaje lista los dominios permitidos', () => {
        expect(validarCorreo('a@x.com')).toBe('Solo se permiten correos con @duoc.cl, @profesor.duoc.cl, @gmail.com')
    })

    it('rechaza correos que superan el máximo', () => {
        const largo = `${'a'.repeat(LIMITES.maxCorreo)}@duoc.cl`
        expect(validarCorreo(largo)).toMatch(/no puede superar los 100/)
    })
})


describe('validarContrasena', () => {
    it('exige la contraseña', () => {
        expect(validarContrasena('')).toBe('La contraseña es obligatoria')
    })

    it('valida el rango 4-10 (bordes incluidos)', () => {
        expect(validarContrasena('abc')).toMatch(/entre 4 y 10/)
        expect(validarContrasena('abcd')).toBeNull()
        expect(validarContrasena('a'.repeat(10))).toBeNull()
        expect(validarContrasena('a'.repeat(11))).toMatch(/entre 4 y 10/)
    })

    it('no recorta espacios: cuentan como caracteres', () => {
        expect(validarContrasena('ab  ')).toBeNull()
    })
})


describe('calcularEdad', () => {
    const hoy = new Date('2026-10-22T12:00:00')

    it('calcula la edad si ya pasó el cumpleaños', () => {
        expect(calcularEdad('2000-01-15', hoy)).toBe(26)
    })

    it('resta un año si el cumpleaños aún no llega (mes posterior)', () => {
        expect(calcularEdad('2000-12-01', hoy)).toBe(25)
    })

    it('resta un año si es el mismo mes pero día posterior', () => {
        expect(calcularEdad('2000-10-23', hoy)).toBe(25)
    })

    it('cuenta el año completo el mismo día del cumpleaños', () => {
        expect(calcularEdad('2000-10-22', hoy)).toBe(26)
    })

    it('devuelve null para fechas inválidas', () => {
        expect(calcularEdad('no-es-fecha', hoy)).toBeNull()
    })
})


describe('validarFechaNacimiento', () => {
    it('es opcional por defecto', () => {
        expect(validarFechaNacimiento('')).toBeNull()
    })

    it('puede ser obligatoria', () => {
        expect(validarFechaNacimiento('', { obligatoria: true })).toBe('La fecha de nacimiento es obligatoria')
    })

    it('rechaza fechas inválidas', () => {
        expect(validarFechaNacimiento('xx')).toBe('La fecha de nacimiento no es válida')
    })

    it('rechaza fechas futuras', () => {
        expect(validarFechaNacimiento('2999-01-01')).toBe('La fecha de nacimiento no puede ser futura')
    })

    it('rechaza menores de 18', () => {
        const año = new Date().getFullYear() - 10
        expect(validarFechaNacimiento(`${año}-01-01`)).toBe('Debes tener al menos 18 años')
    })

    it('rechaza mayores de 110', () => {
        expect(validarFechaNacimiento('1800-01-01')).toBe('Debes tener máximo 110 años')
    })

    it('acepta una edad válida', () => {
        expect(validarFechaNacimiento('1990-05-10')).toBeNull()
    })

    it('permite cambiar los límites de edad', () => {
        const año = new Date().getFullYear() - 10
        expect(validarFechaNacimiento(`${año}-01-01`, { edadMinima: 5 })).toBeNull()
    })
})


describe('validarPrecio', () => {
    it('exige el precio', () => {
        expect(validarPrecio('')).toBe('El precio es obligatorio')
    })

    it('acepta enteros desde 100', () => {
        expect(validarPrecio(100)).toBeNull()
        expect(validarPrecio('14990')).toBeNull()
    })

    it.each([99, 0, -5, 150.5, 'abc'])('rechaza %s', (valor) => {
        expect(validarPrecio(valor)).toMatch(/entero mayor o igual a 100/)
    })
})


describe('validarEnteroNoNegativo', () => {
    it('exige el valor', () => {
        expect(validarEnteroNoNegativo('', 'El stock')).toBe('El stock es obligatorio')
    })

    it('acepta 0 y positivos', () => {
        expect(validarEnteroNoNegativo(0)).toBeNull()
        expect(validarEnteroNoNegativo('25')).toBeNull()
    })

    it.each([-1, 1.5, 'abc'])('rechaza %s', (valor) => {
        expect(validarEnteroNoNegativo(valor, 'El stock')).toBe('El stock debe ser un número entero igual o mayor a 0')
    })
})