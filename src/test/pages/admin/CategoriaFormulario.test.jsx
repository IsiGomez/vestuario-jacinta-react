import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import CategoriaFormulario from '../../../pages/admin/CategoriaFormulario'
import * as service from '../../../services/categoriaService'
vi.mock('../../../services/categoriaService', () => ({ obtenerCategoriaPorId: vi.fn(), crearCategoria: vi.fn(), actualizarCategoria: vi.fn() }))
function mostrar(ruta) { render(<MemoryRouter initialEntries={[ruta]}><Routes>
<Route path="/admin/categorias" element={<p>Listado</p>} /><Route path="/admin/categorias/nueva" element={<CategoriaFormulario />} />
<Route path="/admin/categorias/:id/editar" element={<CategoriaFormulario />} /></Routes></MemoryRouter>) }
it('crea categoría usando el servicio y navega al listado', async () => {
    service.crearCategoria.mockResolvedValue({ id: 1 }); mostrar('/admin/categorias/nueva')
    await userEvent.type(await screen.findByLabelText('Nombre'), 'Poleras')
    await userEvent.type(screen.getByLabelText('Descripción'), 'Poleras de algodón')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))
    expect(await screen.findByText('Listado')).toBeInTheDocument()
    expect(service.crearCategoria).toHaveBeenCalledWith({ nombre: 'Poleras', descripcion: 'Poleras de algodón' })
})
it('carga una categoría para editar desde la API', async () => {
    service.obtenerCategoriaPorId.mockResolvedValue({ id: 1, nombre: 'Camisas', descripcion: 'Ejemplo' })
    mostrar('/admin/categorias/1/editar'); expect(await screen.findByLabelText('Nombre')).toHaveValue('Camisas')
})
