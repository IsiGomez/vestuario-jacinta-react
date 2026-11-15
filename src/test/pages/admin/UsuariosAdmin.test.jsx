import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext } from '../../../context/authContext'
import { admin, cliente } from '../../fixtures/usuarios'
import UsuariosAdmin from '../../../pages/admin/UsuariosAdmin'
import * as service from '../../../services/usuarioService'
vi.mock('../../../services/usuarioService', () => ({ obtenerUsuarios: vi.fn(), eliminarUsuario: vi.fn() }))
const mostrar = () => render(<AuthContext.Provider value={{ usuario: admin }}><MemoryRouter><UsuariosAdmin /></MemoryRouter></AuthContext.Provider>)
beforeEach(() => { service.obtenerUsuarios.mockResolvedValue([admin, cliente]); service.eliminarUsuario.mockResolvedValue(null) })
it('carga usuarios desde la API y bloquea desactivar la propia cuenta', async () => {
    mostrar()
    expect(screen.getByRole('status')).toBeInTheDocument()
    const fila = (await screen.findByText('Admin Jacinta')).closest('tr')
    expect(within(fila).getByRole('button', { name: /Eliminar/ })).toBeDisabled()
    expect(await screen.findByText('Ana Gómez')).toBeInTheDocument()
})
it('desactiva un usuario y vuelve a consultar el listado', async () => {
    mostrar(); const fila = (await screen.findByText('Ana Gómez')).closest('tr')
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    service.obtenerUsuarios.mockResolvedValue([admin])
    await userEvent.click(within(fila).getByRole('button', { name: /Eliminar/ }))
    await waitFor(() => expect(screen.queryByText('Ana Gómez')).not.toBeInTheDocument())
    expect(service.eliminarUsuario).toHaveBeenCalledWith(2)
})
it('muestra errores de la API', async () => {
    service.obtenerUsuarios.mockRejectedValue(new Error('Sin conexión')); mostrar()
    expect(await screen.findByRole('alert')).toHaveTextContent('Sin conexión')
})
