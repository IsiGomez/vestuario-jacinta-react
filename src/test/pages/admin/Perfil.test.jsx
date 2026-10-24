import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Perfil from '../../../pages/admin/Perfil'
import { AuthContext } from '../../../context/authContext'
import { autenticar, obtenerUsuarioPorId } from '../../../data/usuarios'

const SESION_ADMIN = { id: 1, nombre: 'Admin', tipoUsuario: 'Administrador' }

function renderizar() {
    const refrescarSesion = vi.fn()
    render(
        <AuthContext.Provider value={{ usuario: SESION_ADMIN, refrescarSesion }}>
            <Perfil />
        </AuthContext.Provider>
    )
    return { refrescarSesion }
}

const guardar = () => userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))


describe('Perfil', () => {
    it('precarga los datos del usuario en sesión', () => {
        renderizar()
        expect(screen.getByRole('heading', { name: 'Perfil' })).toBeInTheDocument()
        expect(screen.getByLabelText('RUN')).toHaveValue('190110222')
        expect(screen.getByLabelText('Nombre')).toHaveValue('Admin')
        expect(screen.getByLabelText('Apellidos')).toHaveValue('Jacinta')
        expect(screen.getByLabelText('Correo')).toHaveValue('admin@duoc.cl')
        expect(screen.getByLabelText('Región')).toHaveValue('Valparaíso')
        expect(screen.getByLabelText('Comuna')).toHaveValue('Viña del Mar')
        expect(screen.getByLabelText('Dirección')).toHaveValue('Calle Ejemplo 123')
    })

    it('el tipo de usuario se muestra pero está deshabilitado', () => {
        renderizar()
        const tipo = screen.getByLabelText('Tipo de usuario')
        expect(tipo).toHaveValue('Administrador')
        expect(tipo).toBeDisabled()
    })

    it('la contraseña nueva parte vacía y muestra su ayuda', () => {
        renderizar()
        expect(screen.getByLabelText('Nueva contraseña')).toHaveValue('')
        expect(screen.getByText('Déjala vacía para mantener la actual')).toBeInTheDocument()
    })

    it('sin contraseña nueva conserva la actual', async () => {
        renderizar()
        await guardar()
        expect(autenticar('admin@duoc.cl', '1234')).not.toBeNull()
    })

    it('valida los campos y no guarda si hay errores', async () => {
        const { refrescarSesion } = renderizar()
        await userEvent.clear(screen.getByLabelText('Nombre'))
        await userEvent.clear(screen.getByLabelText('Correo'))
        await userEvent.type(screen.getByLabelText('Correo'), 'x@hotmail.com')
        await userEvent.clear(screen.getByLabelText('Dirección'))
        await guardar()

        expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument()
        expect(screen.getByText(/Solo se permiten correos con/)).toBeInTheDocument()
        expect(screen.getByText('La dirección es obligatorio')).toBeInTheDocument()
        expect(screen.queryByText('Tus datos se guardaron correctamente.')).not.toBeInTheDocument()
        expect(refrescarSesion).not.toHaveBeenCalled()
        expect(obtenerUsuarioPorId(1).nombre).toBe('Admin')
    })

    it('si escribe una contraseña nueva, debe tener entre 4 y 10 caracteres', async () => {
        renderizar()
        await userEvent.type(screen.getByLabelText('Nueva contraseña'), 'ab')
        await guardar()
        expect(screen.getByText(/La contraseña debe tener entre 4 y 10 caracteres/)).toBeInTheDocument()
    })

})