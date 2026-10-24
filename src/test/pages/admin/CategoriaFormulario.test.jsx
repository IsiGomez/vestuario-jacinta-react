import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import CategoriaFormulario from '../../../pages/admin/CategoriaFormulario'
import { obtenerCategorias, obtenerCategoriaPorId } from '../../../data/categorias'

function renderizar(ruta) {
    return render(
        <MemoryRouter initialEntries={[ruta]}>
            <Routes>
                <Route path="/admin/categorias" element={<div>Listado de categorías</div>} />
                <Route path="/admin/categorias/nueva" element={<CategoriaFormulario />} />
                <Route path="/admin/categorias/:id/editar" element={<CategoriaFormulario />} />
            </Routes>
        </MemoryRouter>
    )
}


describe('CategoriaFormulario - creación', () => {
    it('muestra el formulario vacío para crear', () => {
        renderizar('/admin/categorias/nueva')
        expect(screen.getByRole('heading', { name: 'Nueva categoría' })).toBeInTheDocument()
        expect(screen.getByLabelText('Nombre')).toHaveValue('')
        expect(screen.getByLabelText('Descripción')).toHaveValue('')
    })

    it('al enviar vacío muestra errores y no guarda', async () => {
        renderizar('/admin/categorias/nueva')
        await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))

        expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument()
        expect(screen.getByText('La descripción es obligatorio')).toBeInTheDocument()
        expect(obtenerCategorias()).toHaveLength(1)
    })

    it('valida el largo mínimo del nombre (3) y de la descripción (5)', async () => {
        renderizar('/admin/categorias/nueva')
        await userEvent.type(screen.getByLabelText('Nombre'), 'ab')
        await userEvent.type(screen.getByLabelText('Descripción'), 'abcd')
        await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))

        expect(screen.getByText('El nombre: mínimo 3 caracteres.')).toBeInTheDocument()
        expect(screen.getByText('La descripción: mínimo 5 caracteres.')).toBeInTheDocument()
    })

    it('limpia el error de un campo cuando el usuario lo corrige', async () => {
        renderizar('/admin/categorias/nueva')
        await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))
        expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument()

        await userEvent.type(screen.getByLabelText('Nombre'), 'P')
        expect(screen.queryByText('El nombre es obligatorio')).not.toBeInTheDocument()
    })

    it('el botón Cancelar enlaza al listado', () => {
        renderizar('/admin/categorias/nueva')
        expect(screen.getByRole('link', { name: 'Cancelar' })).toHaveAttribute('href', '/admin/categorias')
    })
})


describe('CategoriaFormulario - edición', () => {
    it('precarga los datos de la categoría', () => {
        renderizar('/admin/categorias/1/editar')
        expect(screen.getByRole('heading', { name: 'Editar categoría' })).toBeInTheDocument()
        expect(screen.getByLabelText('Nombre')).toHaveValue('Camisas')
        expect(screen.getByLabelText('Descripción')).toHaveValue(obtenerCategoriaPorId(1).descripcion)
    })

})