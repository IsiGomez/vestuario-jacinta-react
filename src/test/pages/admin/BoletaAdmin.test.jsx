import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import BoletaAdmin from '../../../pages/admin/BoletaAdmin'
import { crearOrden } from '../../../data/ordenes'
import { precio } from '../../helpers'

const renderizar = (id) =>
    render(
        <MemoryRouter initialEntries={[`/admin/ordenes/${id}`]}>
            <Routes>
                <Route path="/admin/ordenes/:id" element={<BoletaAdmin />} />
            </Routes>
        </MemoryRouter>
    )

    
describe('BoletaAdmin', () => {
    it('muestra el número de boleta y el estado', () => {
        renderizar(1)
        expect(screen.getByRole('heading', { level: 1, name: 'Boleta #2026090101' })).toBeInTheDocument()
        expect(screen.getByText('Pagada')).toHaveClass('bg-success')
    })

    it('una orden con pago fallido se marca en rojo', () => {
        renderizar(2)
        expect(screen.getByText('Pago fallido')).toHaveClass('bg-danger')
    })

    it('muestra los datos del cliente', () => {
        renderizar(1)
        expect(screen.getByText('Camila Rojas Pérez')).toBeInTheDocument()
        expect(screen.getByText('camila.rojas@gmail.com')).toBeInTheDocument()
    })

    it('muestra la dirección de entrega', () => {
        renderizar(1)
        expect(screen.getByText('Los Aromos 1234')).toBeInTheDocument()
        expect(screen.getByText('Providencia, Región Metropolitana de Santiago')).toBeInTheDocument()
    })

    it('incluye departamento e indicaciones solo si existen', () => {
        const orden = crearOrden({
            cliente: { nombre: 'Ana', apellidos: 'Gómez', correo: 'ana@gmail.com' },
            entrega: { calle: 'Calle 1', departamento: '12B', region: 'Valparaíso', comuna: 'Quilpué', indicaciones: 'Dejar con conserje' },
            items: [{ productoId: 1, nombre: 'Camisa', precio: 1000, cantidad: 1 }],
        })
        renderizar(orden.id)
        expect(screen.getByText('Calle 1, Depto 12B')).toBeInTheDocument()
        expect(screen.getByText('Dejar con conserje')).toBeInTheDocument()
    })

    it('sin departamento ni indicaciones no muestra "Depto"', () => {
        renderizar(1)
        expect(screen.queryByText(/Depto/)).not.toBeInTheDocument()
    })

    it('detalla cada ítem con precio, cantidad y subtotal', () => {
        renderizar(1)
        const fila = screen.getByText('Camisa manga corta hombre').closest('tr')
        const celdas = within(fila).getAllByRole('cell').map((c) => c.textContent)
        expect(celdas).toEqual(['Camisa manga corta hombre', precio(14990), '2', precio(29980)])
    })

    it('el total es la suma de los subtotales', () => {
        renderizar(1)
        const pie = screen.getByText('Total').closest('tr')
        expect(pie).toHaveTextContent(precio(14990 * 2 + 17990))
    })

    it('Volver a órdenes enlaza al listado', () => {
        renderizar(1)
        expect(screen.getByRole('link', { name: 'Volver a órdenes' })).toHaveAttribute('href', '/admin/ordenes')
    })

    it('Imprimir llama a window.print', async () => {
        const imprimir = vi.spyOn(window, 'print').mockImplementation(() => {})
        renderizar(1)
        await userEvent.click(screen.getByRole('button', { name: /Imprimir/ }))
        expect(imprimir).toHaveBeenCalledTimes(1)
    })

})