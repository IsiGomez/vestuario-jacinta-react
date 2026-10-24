import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ReportesProductos from '../../../pages/admin/ReportesProductos'
import { crearCategoria } from '../../../data/categorias'
import { actualizarProducto } from '../../../data/productos'
import { precio, tarjeta } from '../../helpers'

const renderizar = () => render(<MemoryRouter><ReportesProductos /></MemoryRouter>)

describe('ReportesProductos', () => {
    it('muestra el título y los enlaces de navegación', () => {
        renderizar()
        expect(screen.getByRole('heading', { name: 'Reporte de productos' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /Ir a reportes/ })).toHaveAttribute('href', '/admin/reportes')
        expect(screen.getByRole('link', { name: /Ir a productos/ })).toHaveAttribute('href', '/admin/productos')
    })

    it('muestra las tarjetas con las cifras del inventario inicial', () => {
        renderizar()
        expect(tarjeta('Productos')).toHaveTextContent('4')
        expect(tarjeta('Unidades en stock')).toHaveTextContent('48')
        expect(tarjeta('Valor del inventario')).toHaveTextContent(precio(752520))
        expect(tarjeta('Productos críticos')).toHaveTextContent('1')
    })

    it('muestra el inventario agrupado por categoría', () => {
        renderizar()
        const fila = screen.getByText('Camisas', { selector: 'td' }).closest('tr')
        expect(within(fila).getAllByRole('cell').map((c) => c.textContent)).toEqual(['Camisas', '4', '48', precio(752520)])
    })

    it('las categorías vacías no aparecen en la tabla', () => {
        crearCategoria({ nombre: 'Poleras', descripcion: 'Sin productos todavía' })
        renderizar()
        expect(screen.queryByText('Poleras')).not.toBeInTheDocument()
    })

    it('productos con una categoría inexistente se agrupan como "Sin categoría"', () => {
        actualizarProducto(1, { categoriaId: 99 })
        renderizar()
        expect(screen.getByText('Sin categoría', { selector: 'td' })).toBeInTheDocument()
    })

    it('sin productos muestra ceros y el mensaje vacío', () => {
        localStorage.setItem('jacinta_productos', '[]')
        renderizar()
        expect(tarjeta('Productos')).toHaveTextContent('0')
        expect(tarjeta('Valor del inventario')).toHaveTextContent(precio(0))
        expect(screen.getByText('No hay productos registrados.')).toBeInTheDocument()
    })
})