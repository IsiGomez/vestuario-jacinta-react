export const admin = { id: 1, run: '190110222', nombre: 'Admin', apellidos: 'Jacinta',
    correo: 'admin@duoc.cl', telefono: '+56912345678', fechaNacimiento: null,
    tipoUsuario: 'ADMINISTRADOR', region: 'Valparaíso', comuna: 'Viña del Mar', direccion: 'Calle Ejemplo 123' }
export const cliente = { ...admin, id: 2, run: '123456785', nombre: 'Ana', apellidos: 'Gómez',
    correo: 'ana@gmail.com', tipoUsuario: 'CLIENTE' }
