import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProductoFormulario from '../../../pages/admin/ProductoFormulario'
import * as productos from '../../../services/productoService'
import * as categorias from '../../../services/categoriaService'
import { ApiError } from '../../../services/api'
import { camisaLargaHombre, categoriasIniciales } from '../../fixtures/productos'

vi.mock('../../../services/productoService', () => ({
    crearProducto: vi.fn(), actualizarProducto: vi.fn(), obtenerProductoPorId: vi.fn(),
}))
vi.mock('../../../services/categoriaService', () => ({ obtenerCategorias: vi.fn() }))

async function renderizar(ruta) {
    render(
        <MemoryRouter initialEntries={[ruta]}>
            <Routes>
                <Route path="/admin/productos" element={<div>Listado de productos</div>} />
                <Route path="/admin/productos/nuevo" element={<ProductoFormulario />} />
                <Route path="/admin/productos/:id/editar" element={<ProductoFormulario />} />
            </Routes>
        </MemoryRouter>
    )
    await screen.findByRole('button', { name: /^Guardar/ }).catch(() => null)
}

const guardar = () => userEvent.click(screen.getByRole('button', { name: /^Guardar/ }))

async function llenarFormularioValido() {
    await userEvent.type(screen.getByLabelText('Nombre'), 'Camisa de prueba')
    await userEvent.selectOptions(screen.getByLabelText('Categoría'), '1')
    await userEvent.selectOptions(screen.getByLabelText('Género'), 'hombre')
    await userEvent.selectOptions(screen.getByLabelText('Tipo'), 'cam_corta')
    await userEvent.click(screen.getByLabelText('Azul'))
    await userEvent.type(screen.getByLabelText('Precio'), '14990')
    await userEvent.type(screen.getByLabelText('Stock'), '10')
    await userEvent.type(screen.getByLabelText('Stock crítico'), '2')
    await userEvent.type(screen.getByLabelText('Descripción'), 'Una camisa de prueba muy cómoda')
}

describe('ProductoFormulario - creación', () => {
    beforeEach(() => {
        categorias.obtenerCategorias.mockResolvedValue(categoriasIniciales)
        productos.crearProducto.mockResolvedValue({ id: 5 })
    })

    it('muestra el formulario vacío con las categorías del servidor', async () => {
        await renderizar('/admin/productos/nuevo')
        expect(screen.getByRole('heading', { name: 'Nuevo producto' })).toBeInTheDocument()
        expect(screen.getByLabelText('Nombre')).toHaveValue('')
        expect(screen.getByLabelText('Categoría')).toHaveValue('')
        expect(screen.getByRole('option', { name: 'Camisas' })).toBeInTheDocument()
        expect(screen.getByLabelText('Visible en la tienda')).toBeChecked()
    })

    it('el tipo está deshabilitado hasta elegir género y no ofrece colores todavía', async () => {
        await renderizar('/admin/productos/nuevo')
        expect(screen.getByLabelText('Tipo')).toBeDisabled()
        expect(screen.getByText('Elige género y tipo para ver los colores disponibles.')).toBeInTheDocument()
    })

    it('al elegir género ofrece solo los tipos de ese género', async () => {
        await renderizar('/admin/productos/nuevo')
        await userEvent.selectOptions(screen.getByLabelText('Género'), 'unisex')

        expect(screen.getByLabelText('Tipo')).toBeEnabled()
        expect(screen.getByRole('option', { name: 'Polerón con capucha' })).toBeInTheDocument()
        expect(screen.getByRole('option', { name: 'Polerón cuello alto' })).toBeInTheDocument()
        expect(screen.queryByRole('option', { name: 'Camisa manga corta' })).not.toBeInTheDocument()
    })

    it('al elegir el tipo ofrece los colores con fotos disponibles', async () => {
        await renderizar('/admin/productos/nuevo')
        await userEvent.selectOptions(screen.getByLabelText('Género'), 'hombre')
        await userEvent.selectOptions(screen.getByLabelText('Tipo'), 'cam_larga')

        expect(screen.getAllByRole('checkbox').filter((c) => c.id.startsWith('color-')).map((c) => c.labels[0].textContent))
            .toEqual(['Gris', 'Negro', 'Rojo'])
    })

    it('cambiar el género reinicia el tipo y los colores elegidos', async () => {
        await renderizar('/admin/productos/nuevo')
        await userEvent.selectOptions(screen.getByLabelText('Género'), 'hombre')
        await userEvent.selectOptions(screen.getByLabelText('Tipo'), 'cam_corta')
        await userEvent.click(screen.getByLabelText('Azul'))

        await userEvent.selectOptions(screen.getByLabelText('Género'), 'mujer')

        expect(screen.getByLabelText('Tipo')).toHaveValue('')
        expect(screen.queryByLabelText('Azul')).not.toBeInTheDocument()
    })

    it('cambiar el tipo reinicia los colores elegidos', async () => {
        await renderizar('/admin/productos/nuevo')
        await userEvent.selectOptions(screen.getByLabelText('Género'), 'unisex')
        await userEvent.selectOptions(screen.getByLabelText('Tipo'), 'poleron_capucha')
        await userEvent.click(screen.getByLabelText('Gris'))
        expect(screen.getByLabelText('Gris')).toBeChecked()

        await userEvent.selectOptions(screen.getByLabelText('Tipo'), 'poleron_cuello_alto')
        expect(screen.getByLabelText('Negro')).not.toBeChecked()
    })

    it('los colores se pueden marcar y desmarcar', async () => {
        await renderizar('/admin/productos/nuevo')
        await userEvent.selectOptions(screen.getByLabelText('Género'), 'unisex')
        await userEvent.selectOptions(screen.getByLabelText('Tipo'), 'poleron_capucha')

        await userEvent.click(screen.getByLabelText('Gris'))
        expect(screen.getByLabelText('Gris')).toBeChecked()
        await userEvent.click(screen.getByLabelText('Gris'))
        expect(screen.getByLabelText('Gris')).not.toBeChecked()
    })

    it('al enviar vacío muestra todos los errores y no llama al servidor', async () => {
        await renderizar('/admin/productos/nuevo')
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
        expect(productos.crearProducto).not.toHaveBeenCalled()
    })

    it('valida precio mínimo, stock negativo y largos de nombre/descripción', async () => {
        await renderizar('/admin/productos/nuevo')
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

    it('envía al servidor las claves de color y vuelve al listado', async () => {
        await renderizar('/admin/productos/nuevo')
        await llenarFormularioValido()
        await guardar()

        expect(productos.crearProducto).toHaveBeenCalledWith({
            nombre: 'Camisa de prueba', categoriaId: 1, genero: 'hombre', tipo: 'cam_corta',
            precio: 14990, stock: 10, stockCritico: 2, descripcion: 'Una camisa de prueba muy cómoda',
            tallas: ['S', 'M', 'L', 'XL'], colores: ['azul'], activo: true,
        })
        expect(await screen.findByText('Listado de productos')).toBeInTheDocument()
    })

    it('muestra bajo "Tipo" el 409 de género + tipo repetido', async () => {
        productos.crearProducto.mockRejectedValue(new ApiError(409, { mensaje: 'Ya existe un producto de este género y tipo' }))
        await renderizar('/admin/productos/nuevo')
        await llenarFormularioValido()
        await guardar()

        expect(await screen.findByText('Ya existe un producto de este género y tipo. Edítalo para cambiar sus colores.')).toBeInTheDocument()
        expect(screen.queryByText('Listado de productos')).not.toBeInTheDocument()
    })

    it('marca los campos que el servidor rechaza con 400', async () => {
        productos.crearProducto.mockRejectedValue(new ApiError(400, { mensaje: 'Datos inválidos', detalles: { precio: 'El precio no puede ser negativo' } }))
        await renderizar('/admin/productos/nuevo')
        await llenarFormularioValido()
        await guardar()

        expect(await screen.findByText('El precio no puede ser negativo')).toBeInTheDocument()
        expect(screen.getByText('Revisa los campos marcados')).toBeInTheDocument()
    })

    it('muestra otros errores del servidor en una alerta', async () => {
        productos.crearProducto.mockRejectedValue(new ApiError(403, { mensaje: 'Acceso denegado' }))
        await renderizar('/admin/productos/nuevo')
        await llenarFormularioValido()
        await guardar()

        expect(await screen.findByText('Acceso denegado')).toBeInTheDocument()
    })

    it('Cancelar enlaza al listado', async () => {
        await renderizar('/admin/productos/nuevo')
        expect(screen.getByRole('link', { name: 'Cancelar' })).toHaveAttribute('href', '/admin/productos')
    })
})