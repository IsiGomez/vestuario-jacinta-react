import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthContext } from '../../../context/authContext'
import { admin, cliente } from '../../fixtures/usuarios'
import UsuarioFormulario from '../../../pages/admin/UsuarioFormulario'
import * as service from '../../../services/usuarioService'
vi.mock('../../../services/usuarioService', () => ({ TIPOS_USUARIO: ['ADMINISTRADOR', 'VENDEDOR', 'CLIENTE'], obtenerUsuarioPorId: vi.fn(), actualizarUsuario: vi.fn(), crearUsuario: vi.fn() }))
function mostrar(ruta) { render(<AuthContext.Provider value={{ usuario: admin, refrescarSesion: vi.fn() }}><MemoryRouter initialEntries={[ruta]}><Routes>
<Route path="/admin/usuarios" element={<p>Listado</p>} /><Route path="/admin/usuarios/nuevo" element={<UsuarioFormulario />} />
<Route path="/admin/usuarios/:id/editar" element={<UsuarioFormulario />} /></Routes></MemoryRouter></AuthContext.Provider>) }
beforeEach(() => { service.obtenerUsuarioPorId.mockResolvedValue(cliente); service.actualizarUsuario.mockResolvedValue(cliente) })
it('ofrece los tres roles en creación', async () => {
    mostrar('/admin/usuarios/nuevo'); expect(await screen.findByLabelText('Tipo de usuario')).toHaveValue('CLIENTE')
    expect(screen.getByRole('option', { name: 'VENDEDOR' })).toBeInTheDocument()
})
it('edita de forma asíncrona sin enviar una contraseña vacía', async () => {
    mostrar('/admin/usuarios/2/editar'); expect(await screen.findByLabelText('Nombre')).toHaveValue('Ana')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(await screen.findByText('Listado')).toBeInTheDocument()
    expect(service.actualizarUsuario).toHaveBeenCalledWith('2', expect.objectContaining({ nombre: 'Ana', telefono: cliente.telefono }))
    expect(service.actualizarUsuario.mock.calls.at(-1)[1]).not.toHaveProperty('contrasena')
})
it('muestra errores al guardar sin navegar', async () => {
    service.actualizarUsuario.mockRejectedValue(new Error('Correo repetido'))
    mostrar('/admin/usuarios/2/editar'); await screen.findByLabelText('Nombre')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(await screen.findByText('Correo repetido')).toBeInTheDocument()
})
