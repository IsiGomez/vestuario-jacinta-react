import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ReportesAdmin from '../../../pages/admin/ReportesAdmin'
import { precio, tarjeta } from '../../helpers'

const renderizar = () => render(<MemoryRouter><ReportesAdmin /></MemoryRouter>)

describe('ReportesAdmin', () => {
    it('muestra el título y la aclaración de que solo cuentan órdenes pagadas', () => {
        renderizar()
        expect(screen.getByRole('heading', { name: 'Reportes' })).toBeInTheDocument()
        expect(screen.getByText('Resumen de ventas (solo órdenes pagadas)')).toBeInTheDocument()
    })

    it('enlaza al reporte de productos', () => {
        renderizar()
        expect(screen.getByRole('link', { name: /Ver Reporte de Productos/ })).toHaveAttribute('href', '/admin/reportes/productos')
    })

    it('muestra las 4 tarjetas con las cifras de las órdenes iniciales', () => {
        renderizar()
        expect(tarjeta('Ventas totales')).toHaveTextContent(precio(143910))
        expect(tarjeta('Órdenes pagadas')).toHaveTextContent('3')
        expect(tarjeta('Ticket promedio')).toHaveTextContent(precio(47970))
        expect(tarjeta('Pagos fallidos')).toHaveTextContent('1')
    })

    it('lista los productos más vendidos con unidades y monto', () => {
        renderizar()
        const filas = screen.getAllByRole('row').slice(1)
        const celdas = filas.map((f) => within(f).getAllByRole('cell').map((c) => c.textContent))
        expect(celdas).toEqual([
            ['Camisa manga corta hombre', '6', precio(89940)],
            ['Camisa manga larga mujer', '3', precio(53970)],
        ])
    })

    it('sin órdenes muestra ceros y el mensaje vacío', () => {
        localStorage.setItem('jacinta_ordenes', '[]')
        renderizar()
        expect(tarjeta('Ventas totales')).toHaveTextContent(precio(0))
        expect(tarjeta('Ticket promedio')).toHaveTextContent(precio(0))
        expect(screen.getByText('Todavía no hay ventas registradas.')).toBeInTheDocument()
    })
})