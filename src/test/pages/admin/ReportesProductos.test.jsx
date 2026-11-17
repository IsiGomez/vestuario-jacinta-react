import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ReportesProductos from '../../../pages/admin/ReportesProductos'
import * as productos from '../../../services/productoService'
import * as categorias from '../../../services/categoriaService'
import { productosIniciales, categoriasIniciales, camisaCortaHombre, camisaLargaHombre } from '../../fixtures/productos'
import { precio, tarjeta } from '../../helpers'

vi.mock('../../../services/productoService', () => ({ obtenerProductos: vi.fn(), obtenerProductosCriticos: vi.fn() }))
vi.mock('../../../services/categoriaService', () => ({ obtenerCategorias: vi.fn() }))

const renderizar = () => render(<MemoryRouter><ReportesProductos /></MemoryRouter>)

describe('ReportesProductos', () => {
    beforeEach(() => {
        productos.obtenerProductos.mockResolvedValue(productosIniciales)
        productos.obtenerProductosCriticos.mockResolvedValue([camisaLargaHombre])
        categorias.obtenerCategorias.mockResolvedValue(categoriasIniciales)
    })

    it('muestra el título y los enlaces de navegación', async () => {
        renderizar()
        await screen.findByText('Camisas', { selector: 'td' })
        expect(screen.getByRole('heading', { name: 'Reporte de productos' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /Ir a reportes/ })).toHaveAttribute('href', '/admin/reportes')
        expect(screen.getByRole('link', { name: /Ir a productos/ })).toHaveAttribute('href', '/admin/productos')
    })

    it('muestra las tarjetas con las cifras del inventario', async () => {
        renderizar()
        await screen.findByText('Camisas', { selector: 'td' })
        expect(tarjeta('Productos')).toHaveTextContent('4')
        expect(tarjeta('Unidades en stock')).toHaveTextContent('48')
        expect(tarjeta('Valor del inventario')).toHaveTextContent(precio(752520))
    })

    it('la cifra de productos críticos sale del servidor', async () => {
        productos.obtenerProductosCriticos.mockResolvedValue([camisaLargaHombre, camisaCortaHombre])
        renderizar()
        await screen.findByText('Camisas', { selector: 'td' })
        await vi.waitFor(() => expect(tarjeta('Productos críticos')).toHaveTextContent('2'))
    })

    it('muestra el inventario agrupado por categoría', async () => {
        renderizar()
        const fila = (await screen.findByText('Camisas', { selector: 'td' })).closest('tr')
        expect(within(fila).getAllByRole('cell').map((c) => c.textContent)).toEqual(['Camisas', '4', '48', precio(752520)])
    })

    it('las categorías vacías no aparecen en la tabla', async () => {
        categorias.obtenerCategorias.mockResolvedValue([...categoriasIniciales, { id: 2, nombre: 'Poleras', descripcion: '', productos: 0 }])
        renderizar()
        await screen.findByText('Camisas', { selector: 'td' })
        expect(screen.queryByText('Poleras')).not.toBeInTheDocument()
    })

    it('los productos inactivos no cuentan en el inventario', async () => {
        productos.obtenerProductos.mockResolvedValue([camisaCortaHombre, { ...camisaLargaHombre, activo: false }])
        renderizar()
        await screen.findByText('Camisas', { selector: 'td' })
        expect(tarjeta('Productos')).toHaveTextContent('1')
        expect(tarjeta('Unidades en stock')).toHaveTextContent('25')
    })

    it('productos con una categoría inexistente se agrupan como "Sin categoría"', async () => {
        productos.obtenerProductos.mockResolvedValue([{ ...camisaCortaHombre, categoriaId: 99 }])
        renderizar()
        expect(await screen.findByText('Sin categoría', { selector: 'td' })).toBeInTheDocument()
    })

    it('sin productos muestra ceros y el mensaje vacío', async () => {
        productos.obtenerProductos.mockResolvedValue([])
        productos.obtenerProductosCriticos.mockResolvedValue([])
        renderizar()
        expect(await screen.findByText('No hay productos registrados.')).toBeInTheDocument()
        expect(tarjeta('Productos')).toHaveTextContent('0')
        expect(tarjeta('Valor del inventario')).toHaveTextContent(precio(0))
    })
})