import { AuthContext } from '../../../context/authContext'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { admin } from '../../fixtures/usuarios'
import Perfil from '../../../pages/admin/Perfil'
import { actualizarPerfil } from '../../../services/usuarioService'
vi.mock('../../../services/usuarioService', () => ({ actualizarPerfil: vi.fn() }))
const refrescar = vi.fn().mockResolvedValue(admin)
const mostrar = () => render(<AuthContext.Provider value={{ usuario: admin, refrescarSesion: refrescar }}><Perfil /></AuthContext.Provider>)
it('usa los datos autenticados y no permite editar el rol', () => {
    mostrar(); expect(screen.getByLabelText('RUN')).toHaveValue(admin.run)
    expect(screen.getByLabelText('Tipo de usuario')).toBeDisabled()
    expect(screen.getByLabelText('Teléfono')).toHaveValue(admin.telefono)
})
it('guarda el perfil y restaura la sesión desde la API', async () => {
    actualizarPerfil.mockResolvedValue(admin); mostrar()
    await userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(await screen.findByText('Tus datos se guardaron correctamente.')).toBeInTheDocument()
    expect(actualizarPerfil).toHaveBeenCalled(); expect(refrescar).toHaveBeenCalled()
})
