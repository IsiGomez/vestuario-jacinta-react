import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ReportesAdmin from '../../../pages/admin/ReportesAdmin'
import * as ordenes from '../../../services/ordenService'
import { ordenesDeLaApi, orden1 } from '../../fixtures/ordenes'
import { precio, tarjeta } from '../../helpers'

vi.mock('../../../services/ordenService', () => ({ obtenerOrdenes: vi.fn() }))

const renderizar = () => render(<MemoryRouter><ReportesAdmin /></MemoryRouter>)
const cargado = () => screen.findByText('Camisa manga corta hombre')

describe('ReportesAdmin', () => {
    beforeEach(() => {
        ordenes.obtenerOrdenes.mockResolvedValue(ordenesDeLaApi)
    })

    it('muestra el título y la aclaración de que solo cuentan órdenes pagadas', async () => {
        renderizar()
        await cargado()
        expect(screen.getByRole('heading', { name: 'Reportes' })).toBeInTheDocument()
        expect(screen.getByText('Resumen de ventas (solo órdenes pagadas)')).toBeInTheDocument()
    })

    it('enlaza al reporte de productos', async () => {
        renderizar()
        await cargado()
        expect(screen.getByRole('link', { name: /Ver Reporte de Productos/ })).toHaveAttribute('href', '/admin/reportes/productos')
    })

    it('muestra las 4 tarjetas con las cifras de las órdenes', async () => {
        renderizar()
        await cargado()
        expect(tarjeta('Ventas totales')).toHaveTextContent(precio(143910))
        expect(tarjeta('Órdenes pagadas')).toHaveTextContent('3')
        expect(tarjeta('Ticket promedio')).toHaveTextContent(precio(47970))
        expect(tarjeta('Pagos fallidos')).toHaveTextContent('1')
    })

    it('lista los productos más vendidos con unidades y monto', async () => {
        renderizar()
        await cargado()
        const filas = screen.getAllByRole('row').slice(1)
        const celdas = filas.map((f) => within(f).getAllByRole('cell').map((c) => c.textContent))
        expect(celdas).toEqual([
            ['Camisa manga corta hombre', '6', precio(89940)],
            ['Camisa manga larga mujer', '3', precio(53970)],
        ])
    })

    it('las ventas usan el total que calcula el servidor', async () => {
        ordenes.obtenerOrdenes.mockResolvedValue([{ ...orden1, total: 1000 }])
        renderizar()
        await cargado()
        expect(tarjeta('Ventas totales')).toHaveTextContent(precio(1000))
    })

    it('sin órdenes muestra ceros y el mensaje vacío', async () => {
        ordenes.obtenerOrdenes.mockResolvedValue([])
        renderizar()
        expect(await screen.findByText('Todavía no hay ventas registradas.')).toBeInTheDocument()
        expect(tarjeta('Ventas totales')).toHaveTextContent(precio(0))
        expect(tarjeta('Ticket promedio')).toHaveTextContent(precio(0))
    })

    it('muestra el error si falla la carga y no el aviso de "sin ventas"', async () => {
        ordenes.obtenerOrdenes.mockRejectedValue(new Error('Error HTTP 500'))
        renderizar()
        expect(await screen.findByRole('alert')).toHaveTextContent('Error HTTP 500')
        expect(screen.queryByText('Todavía no hay ventas registradas.')).not.toBeInTheDocument()
    })
})