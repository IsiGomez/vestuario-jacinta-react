import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import BoletaAdmin from '../../../pages/admin/BoletaAdmin'
import * as ordenes from '../../../services/ordenService'
import { ApiError } from '../../../services/api'
import { orden1, orden2 } from '../../fixtures/ordenes'
import { precio } from '../../helpers'

vi.mock('../../../services/ordenService', () => ({ obtenerOrdenPorId: vi.fn() }))

const renderizar = (id = 1) =>
    render(
        <MemoryRouter initialEntries={[`/admin/ordenes/${id}`]}>
            <Routes>
                <Route path="/admin/ordenes/:id" element={<BoletaAdmin />} />
            </Routes>
        </MemoryRouter>
    )


describe('BoletaAdmin', () => {
    beforeEach(() => {
        ordenes.obtenerOrdenPorId.mockResolvedValue(orden1)
    })

    it('pide la orden al servidor y muestra el número de boleta y el estado', async () => {
        renderizar(1)
        expect(await screen.findByRole('heading', { level: 1, name: 'Boleta #2026090101' })).toBeInTheDocument()
        expect(ordenes.obtenerOrdenPorId).toHaveBeenCalledWith('1')
        expect(screen.getByText('Pagada')).toHaveClass('bg-success')
    })

    it('una orden con pago fallido se marca en rojo y una pendiente en amarillo', async () => {
        ordenes.obtenerOrdenPorId.mockResolvedValue(orden2)
        const { unmount } = renderizar(2)
        expect(await screen.findByText('Pago fallido')).toHaveClass('bg-danger')
        unmount()

        ordenes.obtenerOrdenPorId.mockResolvedValue({ ...orden2, estado: 'PENDIENTE' })
        renderizar(2)
        expect(await screen.findByText('Pendiente')).toHaveClass('bg-warning')
    })

    it('muestra los datos del cliente', async () => {
        renderizar()
        expect(await screen.findByText('Camila Rojas Pérez')).toBeInTheDocument()
        expect(screen.getByText('camila.rojas@gmail.com')).toBeInTheDocument()
    })

    it('muestra la dirección de entrega', async () => {
        renderizar()
        expect(await screen.findByText('Los Aromos 1234')).toBeInTheDocument()
        expect(screen.getByText('Providencia, Región Metropolitana de Santiago')).toBeInTheDocument()
    })

    it('incluye departamento e indicaciones solo si existen', async () => {
        ordenes.obtenerOrdenPorId.mockResolvedValue({
            ...orden1,
            entrega: { calle: 'Calle 1', departamento: '12B', region: 'Valparaíso', comuna: 'Quilpué', indicaciones: 'Dejar con conserje' },
        })
        renderizar()
        expect(await screen.findByText('Calle 1, Depto 12B')).toBeInTheDocument()
        expect(screen.getByText('Dejar con conserje')).toBeInTheDocument()
    })

    it('un retiro en tienda no muestra comuna ni región vacías', async () => {
        ordenes.obtenerOrdenPorId.mockResolvedValue({
            ...orden1, entrega: { calle: 'Retiro en tienda', departamento: '', region: '', comuna: '', indicaciones: '' },
        })
        renderizar()
        expect(await screen.findByText('Retiro en tienda')).toBeInTheDocument()
        expect(screen.queryByText(/Providencia/)).not.toBeInTheDocument()
    })

    it('sin departamento ni indicaciones no muestra "Depto"', async () => {
        renderizar()
        await screen.findByText('Los Aromos 1234')
        expect(screen.queryByText(/Depto/)).not.toBeInTheDocument()
    })

    it('detalla cada ítem con precio, cantidad y subtotal', async () => {
        renderizar()
        const fila = (await screen.findByText('Camisa manga corta hombre')).closest('tr')
        const celdas = within(fila).getAllByRole('cell').map((c) => c.textContent)
        expect(celdas).toEqual(['Camisa manga corta hombre', precio(14990), '2', precio(29980)])
    })

    it('muestra talla y el nombre legible del color (la API entrega su clave)', async () => {
        ordenes.obtenerOrdenPorId.mockResolvedValue({
            ...orden1, items: [{ productoId: 1, nombre: 'Camisa manga corta hombre', precio: 14990, cantidad: 1, talla: 'M', color: 'azul' }],
        })
        renderizar()
        expect(await screen.findByText('Talla M · Color Azul')).toBeInTheDocument()
    })

    it('el total es el que calcula el servidor', async () => {
        ordenes.obtenerOrdenPorId.mockResolvedValue({ ...orden1, total: 99999 })
        renderizar()
        const pie = (await screen.findByText('Total')).closest('tr')
        expect(pie).toHaveTextContent(precio(99999))
    })

    it('Volver a órdenes enlaza al listado', async () => {
        renderizar()
        expect(await screen.findByRole('link', { name: 'Volver a órdenes' })).toHaveAttribute('href', '/admin/ordenes')
    })

    it('avisa si la orden no existe', async () => {
        ordenes.obtenerOrdenPorId.mockRejectedValue(new ApiError(404, { mensaje: 'Orden no encontrada' }))
        renderizar(99)
        expect(await screen.findByText('No existe una orden con id 99.')).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Volver a órdenes' })).toHaveAttribute('href', '/admin/ordenes')
    })

    it('muestra otros errores del servidor tal cual', async () => {
        ordenes.obtenerOrdenPorId.mockRejectedValue(new ApiError(403, { mensaje: 'Acceso denegado' }))
        renderizar()
        expect(await screen.findByText('Acceso denegado')).toBeInTheDocument()
    })

    it('Imprimir llama a window.print', async () => {
        const imprimir = vi.spyOn(window, 'print').mockImplementation(() => {})
        renderizar()
        await userEvent.click(await screen.findByRole('button', { name: /Imprimir/ }))
        expect(imprimir).toHaveBeenCalledTimes(1)
    })

})