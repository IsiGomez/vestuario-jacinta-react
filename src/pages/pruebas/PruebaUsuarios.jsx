import { useState } from 'react'
import { autenticar, crearUsuario, obtenerUsuarios, restablecerUsuarios } from '../../data/usuarios'

function PruebaUsuarios() {
    const [usuarios, setUsuarios] = useState(obtenerUsuarios)
    const [correo, setCorreo] = useState('admin@duoc.cl')
    const [contrasena, setContrasena] = useState('')
    const [mensaje, setMensaje] = useState('')

    const iniciarSesion = (e) => {
        e.preventDefault()
        const usuario = autenticar(correo, contrasena)
        
        setMensaje(
            usuario 
            ? `Bienvenido/a ${usuario.nombre} (${usuario.tipoUsuario})` 
            : 'Correo o contraseña incorrectos'
        )
    }

    const ejecutar = (accion) => {
        try {
            accion()
            setUsuarios(obtenerUsuarios())
            setMensaje('')

        } catch (err) {
            setMensaje(err.message)
        }
    }

    const agregarDePrueba = () => {
        ejecutar(() =>
            crearUsuario({
                run: `1234567${usuarios.length}`,
                nombre: 'Cliente',
                apellidos: `Prueba ${usuarios.length}`,
                correo: `cliente${usuarios.length}@duoc.cl`,
                contrasena: '1234',
                tipoUsuario: 'Cliente',
                region: 'Valparaíso',
                comuna: 'Viña del Mar',
                direccion: 'Calle 1'
            })
        )
    }

    return (
        <section className="mb-5">
            <h2 className="mb-3">Prueba de Usuarios (login)</h2>
            
            <form className="row g-2 mb-3" onSubmit={iniciarSesion}>
                <div className="col-md-5">
                    <input 
                        className="form-control" 
                        type="email" 
                        aria-label="Correo" 
                        value={correo} 
                        onChange={(e) => setCorreo(e.target.value)} 
                    />
                </div>
                
                <div className="col-md-4">
                    <input 
                        className="form-control" 
                        type="password" 
                        aria-label="Contraseña" 
                        placeholder="Contraseña" 
                        value={contrasena} 
                        onChange={(e) => setContrasena(e.target.value)} 
                    />
                </div>
                
                <div className="col-md-3 d-grid">
                    <button className="btn btn-success" type="submit">
                        Ingresar
                    </button>
                </div>
            </form>
            
            {mensaje && <div className="alert alert-info">{mensaje}</div>}
            
            <div className="d-flex gap-2 mb-3">
                <button className="btn btn-primary" onClick={agregarDePrueba}>
                    Crear usuario
                </button>
                
                <button className="btn btn-outline-secondary" onClick={() => ejecutar(restablecerUsuarios)}>
                    Restablecer
                </button>
            </div>3
            
            <ul className="list-group">
                {usuarios.map((user) => (
                    <li key={user.id} className="list-group-item">
                        {user.nombre} {user.apellidos} · {user.correo} · {user.tipoUsuario}
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default PruebaUsuarios