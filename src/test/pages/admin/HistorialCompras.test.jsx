import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import HistorialCompras from '../../../pages/admin/HistorialCompras'
import * as usuarios from '../../../services/usuarioService'
import * as ordenes from '../../../services/ordenService'
import { orden1, orden2, orden3 } from '../../fixtures/ordenes'
import { precio, tarjeta } from '../../helpers'

vi.mock('../../../services/usuarioService', () => ({ obtenerUsuarioPorId: vi.fn() }))
vi.mock('../../../services/ordenService', () => ({ obtenerOrdenesDeUsuario: vi.fn() }))

const camila = {
    id: 2, run: '12345678-5', nombre: 'Camila', apellidos: 'Rojas Pérez', correo: 'camila.rojas@gmail.com', tipoUsuario: 'CLIENTE',
}

const renderizar = (id = 2) =>
    render(
        <MemoryRouter initialEntries={[`/admin/usuarios/${id}/historial`]}>
            <Routes>
                <Route path="/admin/usuarios/:id/historial" element={<HistorialCompras />} />
            </Routes>
        </MemoryRouter>
    )
const cargado = () => screen.findByRole('heading', { name: 'Historial de compras' })

describe('HistorialCompras', () => {
    beforeEach(() => {
        usuarios.obtenerUsuarioPorId.mockResolvedValue(camila)
        ordenes.obtenerOrdenesDeUsuario.mockResolvedValue([orden3, orden1]) // la API las entrega de la más nueva a la más antigua
    })

    it('muestra el nombre y el correo del cliente', async () => {
        renderizar()
        await cargado()
        expect(screen.getByText('Camila Rojas Pérez · camila.rojas@gmail.com')).toBeInTheDocument()
    })

    it('pide las órdenes por id de usuario (no por correo)', async () => {
        renderizar()
        await cargado()
        expect(ordenes.obtenerOrdenesDeUsuario).toHaveBeenCalledWith('2')
    })

    it('lista las órdenes en el orden que entrega el servidor', async () => {
        renderizar()
        await cargado()
        await screen.findByText('#2026100203')
        const numeros = screen.getAllByRole('row').slice(1).map((f) => within(f).getAllByRole('cell')[0].textContent)
        expect(numeros).toEqual(['#2026100203', '#2026090101'])
    })

    it('el resumen cuenta solo compras pagadas y suma el total del servidor', async () => {
        ordenes.obtenerOrdenesDeUsuario.mockResolvedValue([
            { ...orden2, usuarioId: 2, total: 99999 }, orden3, orden1,
        ])
        renderizar()
        await cargado()
        await screen.findByText('#2026100203')

        expect(tarjeta('Compras pagadas')).toHaveTextContent('2')
        expect(tarjeta('Total gastado')).toHaveTextContent(precio(47970 + 44970))
    })

    it('muestra el estado de cada orden con su color', async () => {
        ordenes.obtenerOrdenesDeUsuario.mockResolvedValue([orden3, orden2])
        renderizar()
        await cargado()
        const filaFallida = (await screen.findByText('#2026091502')).closest('tr')
        expect(within(filaFallida).getByText('Pago fallido')).toHaveClass('text-bg-danger')
        expect(within(screen.getByText('#2026100203').closest('tr')).getByText('Pagada')).toHaveClass('text-bg-success')
    })

    it('cada orden enlaza a su boleta', async () => {
        renderizar()
        await cargado()
        const fila = (await screen.findByText('#2026090101')).closest('tr')
        expect(within(fila).getByRole('link', { name: 'Ver boleta' })).toHaveAttribute('href', '/admin/ordenes/1')
    })

})