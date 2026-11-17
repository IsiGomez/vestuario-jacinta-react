import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext } from '../../../context/authContext'
import ProductosAdmin from '../../../pages/admin/ProductosAdmin'
import * as productos from '../../../services/productoService'
import * as categorias from '../../../services/categoriaService'
import { admin } from '../../fixtures/usuarios'
import { productosIniciales, categoriasIniciales, camisaCortaHombre } from '../../fixtures/productos'
import { precio } from '../../helpers'

vi.mock('../../../services/productoService', () => ({ obtenerProductos: vi.fn(), eliminarProducto: vi.fn() }))
vi.mock('../../../services/categoriaService', () => ({ obtenerCategorias: vi.fn() }))

const renderizar = (tipoUsuario = 'ADMINISTRADOR') => render(
    <AuthContext.Provider value={{ usuario: { ...admin, tipoUsuario } }}>
        <MemoryRouter><ProductosAdmin /></MemoryRouter>
    </AuthContext.Provider>
)
const filaDe = async (nombre) => (await screen.findByText(nombre)).closest('tr')

describe('ProductosAdmin', () => {
    beforeEach(() => {
        productos.obtenerProductos.mockResolvedValue(productosIniciales)
        categorias.obtenerCategorias.mockResolvedValue(categoriasIniciales)
    })

    it('lista los 4 productos (más la fila de encabezado)', async () => {
        renderizar()
        await screen.findByText('Camisa manga larga mujer')
        expect(screen.getAllByRole('row')).toHaveLength(5)
    })

    it('muestra categoría, género, precio y stock de cada producto', async () => {
        renderizar()
        const fila = await filaDe('Camisa manga larga hombre')
        expect(await within(fila).findByText('Camisas')).toBeInTheDocument()
        expect(within(fila).getByText('hombre')).toBeInTheDocument()
        expect(within(fila).getByText(precio(17990))).toBeInTheDocument()
        expect(within(fila).getByText('3')).toBeInTheDocument()
    })

    it('pinta el stock en rojo si es crítico y en verde si no', async () => {
        renderizar()
        expect(within(await filaDe('Camisa manga larga hombre')).getByText('3')).toHaveClass('bg-danger')
        expect(within(await filaDe('Camisa manga corta hombre')).getByText('25')).toHaveClass('bg-success')
    })

    it('muestra la miniatura de la primera imagen del primer color', async () => {
        renderizar()
        const img = within(await filaDe('Camisa manga corta hombre')).getByRole('img')
        expect(img).toHaveAttribute('src', '/assets/img/productos/hombre/cam_corta/azul_1.jpg')
    })

    it('muestra "Sin categoría" si la categoría ya no existe', async () => {
        productos.obtenerProductos.mockResolvedValue([{ ...camisaCortaHombre, categoriaId: 99 }])
        renderizar()
        expect(within(await filaDe('Camisa manga corta hombre')).getByText('Sin categoría')).toBeInTheDocument()
    })

    it('marca los productos inactivos', async () => {
        productos.obtenerProductos.mockResolvedValue([{ ...camisaCortaHombre, activo: false }])
        renderizar()
        expect(within(await filaDe('Camisa manga corta hombre')).getByText('Inactivo')).toBeInTheDocument()
    })

    it('tiene los enlaces de reporte, críticos y nuevo producto', async () => {
        renderizar()
        await screen.findByText('Camisa manga larga mujer')
        expect(screen.getByRole('link', { name: /Ver Reporte/ })).toHaveAttribute('href', '/admin/reportes/productos')
        expect(screen.getByRole('link', { name: /Críticos/ })).toHaveAttribute('href', '/admin/productos/criticos')
        expect(screen.getByRole('link', { name: /Nuevo producto/ })).toHaveAttribute('href', '/admin/productos/nuevo')
    })

    it('cada fila enlaza a la edición de su producto', async () => {
        renderizar()
        const enlace = within(await filaDe('Camisa manga larga mujer')).getByRole('link', { name: /Editar/ })
        expect(enlace).toHaveAttribute('href', '/admin/productos/4/editar')
    })

    it('no elimina si se cancela la confirmación', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(false)
        renderizar()

        await userEvent.click(within(await filaDe('Camisa manga corta hombre')).getByRole('button', { name: /Eliminar/ }))

        expect(productos.eliminarProducto).not.toHaveBeenCalled()
    })

    it('elimina al confirmar y recarga el listado', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(true)
        productos.eliminarProducto.mockResolvedValue(null)
        renderizar()

        await userEvent.click(within(await filaDe('Camisa manga corta hombre')).getByRole('button', { name: /Eliminar/ }))

        expect(productos.eliminarProducto).toHaveBeenCalledWith(1)
        await vi.waitFor(() => expect(productos.obtenerProductos).toHaveBeenCalledTimes(2))
    })

    it('muestra el 409 del servidor si el producto ya tiene ventas', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(true)
        productos.eliminarProducto.mockRejectedValue(new Error('El producto tiene ventas registradas: desactívalo en lugar de eliminarlo'))
        renderizar()

        await userEvent.click(within(await filaDe('Camisa manga corta hombre')).getByRole('button', { name: /Eliminar/ }))

        expect(await screen.findByRole('alert')).toHaveTextContent('desactívalo en lugar de eliminarlo')
    })

    it('el vendedor puede editar pero no eliminar', async () => {
        renderizar('VENDEDOR')
        const fila = await filaDe('Camisa manga corta hombre')
        expect(within(fila).getByRole('link', { name: /Editar/ })).toBeInTheDocument()
        expect(within(fila).queryByRole('button', { name: /Eliminar/ })).not.toBeInTheDocument()
    })

    it('muestra un mensaje cuando no hay productos', async () => {
        productos.obtenerProductos.mockResolvedValue([])
        renderizar()
        expect(await screen.findByText('No hay productos registrados.')).toBeInTheDocument()
    })

    it('muestra el error si falla la carga', async () => {
        productos.obtenerProductos.mockRejectedValue(new Error('Error HTTP 500'))
        renderizar()
        expect(await screen.findByRole('alert')).toHaveTextContent('Error HTTP 500')
    })
})