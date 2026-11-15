import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext } from '../../../context/authContext'
import { admin } from '../../fixtures/usuarios'
import CategoriasAdmin from '../../../pages/admin/CategoriasAdmin'
import * as service from '../../../services/categoriaService'
vi.mock('../../../services/categoriaService', () => ({ obtenerCategorias: vi.fn(), eliminarCategoria: vi.fn() }))
const categoria = { id: 1, nombre: 'Camisas', descripcion: 'Ejemplo', productos: 2 }
const mostrar = (tipoUsuario = 'ADMINISTRADOR') => render(<AuthContext.Provider value={{ usuario: { ...admin, tipoUsuario } }}><MemoryRouter><CategoriasAdmin /></MemoryRouter></AuthContext.Provider>)
beforeEach(() => service.obtenerCategorias.mockResolvedValue([categoria]))
it('carga categorías y bloquea eliminar las que tienen productos', async () => {
    mostrar(); await screen.findByText('Camisas')
    expect(screen.getByRole('button', { name: /Eliminar/ })).toBeDisabled()
})
it('el vendedor solo ve el listado', async () => {
    mostrar('VENDEDOR'); await screen.findByText('Camisas')
    expect(screen.queryByRole('link', { name: /Nueva categoría/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Eliminar/ })).not.toBeInTheDocument()
})
it('muestra un 409 del servidor al intentar eliminar', async () => {
    service.obtenerCategorias.mockResolvedValue([{ ...categoria, productos: 0 }])
    service.eliminarCategoria.mockRejectedValue(new Error('La categoría tiene productos asociados'))
    vi.spyOn(window, 'confirm').mockReturnValue(true); mostrar(); await screen.findByText('Camisas')
    await userEvent.click(screen.getByRole('button', { name: /Eliminar/ }))
    expect(await screen.findByRole('alert')).toHaveTextContent('La categoría tiene productos asociados')
})
