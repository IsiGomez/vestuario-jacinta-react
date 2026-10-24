import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import UsuarioFormulario from '../../../pages/admin/UsuarioFormulario'
import { AuthContext } from '../../../context/authContext'
import { crearUsuario, obtenerUsuarios } from '../../../data/usuarios'

const SESION_ADMIN = { id: 1, nombre: 'Admin', tipoUsuario: 'Administrador' }

function renderizar(ruta, refrescarSesion = vi.fn()) {
    render(
        <AuthContext.Provider value={{ usuario: SESION_ADMIN, refrescarSesion }}>
            <MemoryRouter initialEntries={[ruta]}>
                <Routes>
                    <Route path="/admin/usuarios" element={<div>Listado de usuarios</div>} />
                    <Route path="/admin/usuarios/nuevo" element={<UsuarioFormulario />} />
                    <Route path="/admin/usuarios/:id/editar" element={<UsuarioFormulario />} />
                </Routes>
            </MemoryRouter>
        </AuthContext.Provider>
    )
    return { refrescarSesion }
}

const guardar = () => userEvent.click(screen.getByRole('button', { name: /^Guardar/ }))

const crearCliente = () =>
    crearUsuario({
        run: '12345678-5', nombre: 'Ana', apellidos: 'Gómez', correo: 'ana@gmail.com', contrasena: 'abcd',
        tipoUsuario: 'Cliente', region: 'Valparaíso', comuna: 'Quilpué', direccion: 'Calle Falsa 12345',
    })

describe('UsuarioFormulario - creación', () => {
    it('muestra el formulario vacío con tipo "Cliente" por defecto', () => {
        renderizar('/admin/usuarios/nuevo')
        expect(screen.getByRole('heading', { name: 'Nuevo usuario' })).toBeInTheDocument()
        expect(screen.getByLabelText('RUN')).toHaveValue('')
        expect(screen.getByLabelText('Tipo de usuario')).toHaveValue('Cliente')
        expect(screen.getByLabelText('Tipo de usuario')).toBeEnabled()
    })

    it('no muestra la ayuda de contraseña (solo aplica al editar)', () => {
        renderizar('/admin/usuarios/nuevo')
        expect(screen.queryByText('Déjala vacía para mantener la actual')).not.toBeInTheDocument()
    })

    it('al enviar vacío muestra los errores obligatorios y no guarda', async () => {
        renderizar('/admin/usuarios/nuevo')
        await guardar()

        expect(screen.getByText('El RUN es obligatorio')).toBeInTheDocument()
        expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument()
        expect(screen.getByText('Los apellidos es obligatorio')).toBeInTheDocument()
        expect(screen.getByText('El correo es obligatorio')).toBeInTheDocument()
        expect(screen.getByText('La contraseña es obligatoria')).toBeInTheDocument()
        expect(screen.getByText('La región es obligatorio')).toBeInTheDocument()
        expect(screen.getByText('La dirección es obligatorio')).toBeInTheDocument()
        expect(obtenerUsuarios()).toHaveLength(1)
    })

    it('valida RUN, correo y contraseña inválidos', async () => {
        renderizar('/admin/usuarios/nuevo')
        await userEvent.type(screen.getByLabelText('RUN'), '12345678-9')
        await userEvent.type(screen.getByLabelText('Correo'), 'x@hotmail.com')
        await userEvent.type(screen.getByLabelText('Contraseña'), 'ab')
        await guardar()

        expect(screen.getByText(/dígito verificador incorrecto/)).toBeInTheDocument()
        expect(screen.getByText(/Solo se permiten correos con/)).toBeInTheDocument()
        expect(screen.getByText(/La contraseña debe tener entre 4 y 10 caracteres/)).toBeInTheDocument()
    })

    it('la comuna depende de la región elegida', async () => {
        renderizar('/admin/usuarios/nuevo')
        expect(screen.getByLabelText('Comuna')).toBeDisabled()

        await userEvent.selectOptions(screen.getByLabelText('Región'), 'Valparaíso')
        expect(screen.getByLabelText('Comuna')).toBeEnabled()
        expect(screen.getByRole('option', { name: 'Viña del Mar' })).toBeInTheDocument()
    })

    it('limpia el error de un campo al corregirlo', async () => {
        renderizar('/admin/usuarios/nuevo')
        await guardar()
        await userEvent.type(screen.getByLabelText('Nombre'), 'C')
        expect(screen.queryByText('El nombre es obligatorio')).not.toBeInTheDocument()
    })

    it('Cancelar enlaza al listado', () => {
        renderizar('/admin/usuarios/nuevo')
        expect(screen.getByRole('link', { name: 'Cancelar' })).toHaveAttribute('href', '/admin/usuarios')
    })
})


describe('UsuarioFormulario - edición', () => {
    it('precarga los datos y deja la contraseña vacía con su ayuda', () => {
        renderizar('/admin/usuarios/1/editar')
        expect(screen.getByRole('heading', { name: 'Editar usuario' })).toBeInTheDocument()
        expect(screen.getByLabelText('RUN')).toHaveValue('190110222')
        expect(screen.getByLabelText('Nombre')).toHaveValue('Admin')
        expect(screen.getByLabelText('Correo')).toHaveValue('admin@duoc.cl')
        expect(screen.getByLabelText('Contraseña')).toHaveValue('')
        expect(screen.getByLabelText('Región')).toHaveValue('Valparaíso')
        expect(screen.getByLabelText('Comuna')).toHaveValue('Viña del Mar')
        expect(screen.getByText('Déjala vacía para mantener la actual')).toBeInTheDocument()
    })

    it('un administrador editándose a sí mismo no puede cambiar su tipo', () => {
        renderizar('/admin/usuarios/1/editar')
        expect(screen.getByLabelText('Tipo de usuario')).toBeDisabled()
    })

    it('editando a otro usuario sí puede cambiar el tipo', () => {
        crearCliente()
        renderizar('/admin/usuarios/2/editar')
        expect(screen.getByLabelText('Tipo de usuario')).toBeEnabled()
    })

    it('si escribe una contraseña, debe cumplir el largo', async () => {
        renderizar('/admin/usuarios/1/editar')
        await userEvent.type(screen.getByLabelText('Contraseña'), 'ab')
        await guardar()
        expect(screen.getByText(/La contraseña debe tener entre 4 y 10 caracteres/)).toBeInTheDocument()
    })

})