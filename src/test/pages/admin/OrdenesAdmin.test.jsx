import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext } from '../../../context/authContext'
import OrdenesAdmin from '../../../pages/admin/OrdenesAdmin'
import * as ordenes from '../../../services/ordenService'
import { admin } from '../../fixtures/usuarios'
import { ordenesDeLaApi } from '../../fixtures/ordenes'
import { precio } from '../../helpers'

vi.mock('../../../services/ordenService', () => ({ obtenerOrdenes: vi.fn(), actualizarEstadoOrden: vi.fn() }))

const renderizar = (tipoUsuario = 'ADMINISTRADOR') => render(
    <AuthContext.Provider value={{ usuario: { ...admin, tipoUsuario } }}>
        <MemoryRouter><OrdenesAdmin /></MemoryRouter>
    </AuthContext.Provider>
)
const filaDe = async (numero) => (await screen.findByText(`#${numero}`)).closest('tr')
const numeros = () => screen.getAllByRole('row').slice(1).map((f) => within(f).getAllByRole('cell')[0].textContent)


describe('OrdenesAdmin', () => {
    beforeEach(() => {
        ordenes.obtenerOrdenes.mockResolvedValue(ordenesDeLaApi)
        ordenes.actualizarEstadoOrden.mockResolvedValue({})
    })

    it('lista las órdenes en el orden que entrega el servidor (la más reciente primero)', async () => {
        renderizar()
        await screen.findByText('#2026101004')
        expect(numeros()).toEqual(['#2026101004', '#2026100203', '#2026091502', '#2026090101'])
    })

    it('muestra cliente, correo y el total calculado por el servidor', async () => {
        renderizar()
        const fila = await filaDe('2026090101')
        expect(within(fila).getByText(/Camila Rojas Pérez/)).toBeInTheDocument()
        expect(within(fila).getByText('camila.rojas@gmail.com')).toBeInTheDocument()
        expect(within(fila).getByText(precio(47970))).toBeInTheDocument()
    })

    it('el selector de cada fila refleja el estado actual', async () => {
        renderizar()
        expect(within(await filaDe('2026091502')).getByRole('combobox')).toHaveValue('PAGO_FALLIDO')
        expect(within(await filaDe('2026090101')).getByRole('combobox')).toHaveValue('PAGADA')
    })

    it('el color del selector depende del estado', async () => {
        renderizar()
        expect(within(await filaDe('2026090101')).getByRole('combobox')).toHaveClass('text-success')
        expect(within(await filaDe('2026091502')).getByRole('combobox')).toHaveClass('text-danger')
    })

    it('cada orden enlaza a su boleta', async () => {
        renderizar()
        expect(within(await filaDe('2026091502')).getByRole('link', { name: 'Ver boleta' })).toHaveAttribute('href', '/admin/ordenes/2')
    })

    it('filtra por estado', async () => {
        renderizar()
        await screen.findByText('#2026091502')
        await userEvent.selectOptions(screen.getByLabelText('Filtrar por estado'), 'PAGO_FALLIDO')
        expect(numeros()).toEqual(['#2026091502'])
    })

    it('muestra un mensaje si ninguna orden coincide con el filtro', async () => {
        renderizar()
        await screen.findByText('#2026091502')
        await userEvent.selectOptions(screen.getByLabelText('Filtrar por estado'), 'PENDIENTE')
        expect(screen.getByText('No hay órdenes para mostrar.')).toBeInTheDocument()
    })

})