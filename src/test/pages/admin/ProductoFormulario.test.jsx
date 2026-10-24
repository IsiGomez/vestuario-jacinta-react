import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProductoFormulario from '../../../pages/admin/ProductoFormulario'
import { obtenerProductos } from '../../../data/productos'

function renderizar(ruta) {
    return render(
        <MemoryRouter initialEntries={[ruta]}>
            <Routes>
                <Route path="/admin/productos" element={<div>Listado de productos</div>} />
                <Route path="/admin/productos/nuevo" element={<ProductoFormulario />} />
                <Route path="/admin/productos/:id/editar" element={<ProductoFormulario />} />
            </Routes>
        </MemoryRouter>
    )
}

const guardar = () => userEvent.click(screen.getByRole('button', { name: /^Guardar/ }))

describe('ProductoFormulario - creación', () => {
    it('muestra el formulario vacío', () => {
        renderizar('/admin/productos/nuevo')
        expect(screen.getByRole('heading', { name: 'Nuevo producto' })).toBeInTheDocument()
        expect(screen.getByLabelText('Nombre')).toHaveValue('')
        expect(screen.getByLabelText('Categoría')).toHaveValue('')
        expect(screen.getByRole('option', { name: 'Camisas' })).toBeInTheDocument()
    })

    it('el tipo está deshabilitado hasta elegir género y no ofrece colores todavía', () => {
        renderizar('/admin/productos/nuevo')
        expect(screen.getByLabelText('Tipo')).toBeDisabled()
        expect(screen.getByText('Elige género y tipo para ver los colores disponibles.')).toBeInTheDocument()
    })

    it('al elegir género ofrece solo los tipos de ese género', async () => {
        renderizar('/admin/productos/nuevo')
        await userEvent.selectOptions(screen.getByLabelText('Género'), 'unisex')

        expect(screen.getByLabelText('Tipo')).toBeEnabled()
        expect(screen.getByRole('option', { name: 'Polerón con capucha' })).toBeInTheDocument()
        expect(screen.getByRole('option', { name: 'Polerón cuello alto' })).toBeInTheDocument()
        expect(screen.queryByRole('option', { name: 'Camisa manga corta' })).not.toBeInTheDocument()
    })

    it('al elegir el tipo ofrece los colores con fotos disponibles', async () => {
        renderizar('/admin/productos/nuevo')
        await userEvent.selectOptions(screen.getByLabelText('Género'), 'hombre')
        await userEvent.selectOptions(screen.getByLabelText('Tipo'), 'cam_larga')

        expect(screen.getAllByRole('checkbox').map((c) => c.labels[0].textContent)).toEqual(['Gris', 'Negro', 'Rojo'])
    })

    it('cambiar el género reinicia el tipo y los colores elegidos', async () => {
        renderizar('/admin/productos/nuevo')
        await userEvent.selectOptions(screen.getByLabelText('Género'), 'hombre')
        await userEvent.selectOptions(screen.getByLabelText('Tipo'), 'cam_corta')
        await userEvent.click(screen.getByLabelText('Azul'))

        await userEvent.selectOptions(screen.getByLabelText('Género'), 'mujer')

        expect(screen.getByLabelText('Tipo')).toHaveValue('')
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    })

    it('cambiar el tipo reinicia los colores elegidos', async () => {
        renderizar('/admin/productos/nuevo')
        await userEvent.selectOptions(screen.getByLabelText('Género'), 'unisex')
        await userEvent.selectOptions(screen.getByLabelText('Tipo'), 'poleron_capucha')
        await userEvent.click(screen.getByLabelText('Gris'))
        expect(screen.getByLabelText('Gris')).toBeChecked()

        await userEvent.selectOptions(screen.getByLabelText('Tipo'), 'poleron_cuello_alto')
        expect(screen.getByLabelText('Negro')).not.toBeChecked()
    })

    it('los colores se pueden marcar y desmarcar', async () => {
        renderizar('/admin/productos/nuevo')
        await userEvent.selectOptions(screen.getByLabelText('Género'), 'unisex')
        await userEvent.selectOptions(screen.getByLabelText('Tipo'), 'poleron_capucha')

        await userEvent.click(screen.getByLabelText('Gris'))
        expect(screen.getByLabelText('Gris')).toBeChecked()
        await userEvent.click(screen.getByLabelText('Gris'))
        expect(screen.getByLabelText('Gris')).not.toBeChecked()
    })

    it('al enviar vacío muestra todos los errores y no guarda', async () => {
        renderizar('/admin/productos/nuevo')
        await guardar()

        expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument()
        expect(screen.getByText('La categoría es obligatorio')).toBeInTheDocument()
        expect(screen.getByText('El género es obligatorio')).toBeInTheDocument()
        expect(screen.getByText('El tipo es obligatorio')).toBeInTheDocument()
        expect(screen.getByText('Elige al menos un color')).toBeInTheDocument()
        expect(screen.getByText('El precio es obligatorio')).toBeInTheDocument()
        expect(screen.getByText('El stock es obligatorio')).toBeInTheDocument()
        expect(screen.getByText('El stock crítico es obligatorio')).toBeInTheDocument()
        expect(screen.getByText('La descripción es obligatorio')).toBeInTheDocument()
        expect(obtenerProductos()).toHaveLength(4)
    })

    it('valida precio mínimo, stock negativo y largos de nombre/descripción', async () => {
        renderizar('/admin/productos/nuevo')
        await userEvent.type(screen.getByLabelText('Nombre'), 'ab')
        await userEvent.type(screen.getByLabelText('Precio'), '50')
        await userEvent.type(screen.getByLabelText('Stock'), '-1')
        await userEvent.type(screen.getByLabelText('Descripción'), 'corta')
        await guardar()

        expect(screen.getByText('El nombre: mínimo 3 caracteres.')).toBeInTheDocument()
        expect(screen.getByText(/El precio debe ser un número entero mayor o igual a 100/)).toBeInTheDocument()
        expect(screen.getByText('El stock debe ser un número entero igual o mayor a 0')).toBeInTheDocument()
        expect(screen.getByText('La descripción: mínimo 10 caracteres.')).toBeInTheDocument()
    })

    it('rechaza un género+tipo que ya existe (hombre / camisa manga corta)', async () => {
        renderizar('/admin/productos/nuevo')
        await userEvent.selectOptions(screen.getByLabelText('Género'), 'hombre')
        await userEvent.selectOptions(screen.getByLabelText('Tipo'), 'cam_corta')
        await guardar()

        expect(screen.getByText('Ya existe un producto de este género y tipo. Edítalo para cambiar sus colores.')).toBeInTheDocument()
    })

    it('Cancelar enlaza al listado', () => {
        renderizar('/admin/productos/nuevo')
        expect(screen.getByRole('link', { name: 'Cancelar' })).toHaveAttribute('href', '/admin/productos')
    })
})