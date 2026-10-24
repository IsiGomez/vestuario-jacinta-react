import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import OrdenesAdmin from '../../../pages/admin/OrdenesAdmin'
import { precio } from '../../helpers'

const renderizar = () => render(<MemoryRouter><OrdenesAdmin /></MemoryRouter>)
const filaDe = (numero) => screen.getByText(`#${numero}`).closest('tr')
const numeros = () => screen.getAllByRole('row').slice(1).map((f) => within(f).getAllByRole('cell')[0].textContent)


describe('OrdenesAdmin', () => {
    it('lista las 4 órdenes iniciales', () => {
        renderizar()
        expect(numeros()).toHaveLength(4)
    })

    it('ordena de la más reciente a la más antigua', () => {
        renderizar()
        expect(numeros()).toEqual(['#2026101004', '#2026100203', '#2026091502', '#2026090101'])
    })

    it('muestra cliente, correo y total de cada orden', () => {
        renderizar()
        const fila = filaDe('2026090101')
        expect(within(fila).getByText(/Camila Rojas Pérez/)).toBeInTheDocument()
        expect(within(fila).getByText('camila.rojas@gmail.com')).toBeInTheDocument()
        expect(within(fila).getByText(precio(2 * 14990 + 17990))).toBeInTheDocument()
    })

    it('el selector de cada fila refleja el estado actual', () => {
        renderizar()
        expect(within(filaDe('2026091502')).getByRole('combobox')).toHaveValue('Pago fallido')
        expect(within(filaDe('2026090101')).getByRole('combobox')).toHaveValue('Pagada')
    })

    it('el color del selector depende del estado', () => {
        renderizar()
        expect(within(filaDe('2026090101')).getByRole('combobox')).toHaveClass('text-success')
        expect(within(filaDe('2026091502')).getByRole('combobox')).toHaveClass('text-danger')
    })

    it('cada orden enlaza a su boleta', () => {
        renderizar()
        expect(within(filaDe('2026091502')).getByRole('link', { name: 'Ver boleta' })).toHaveAttribute('href', '/admin/ordenes/2')
    })

    it('filtra por estado', async () => {
        renderizar()
        await userEvent.selectOptions(screen.getByLabelText('Filtrar por estado'), 'Pago fallido')
        expect(numeros()).toEqual(['#2026091502'])
    })

    it('muestra un mensaje si ninguna orden coincide con el filtro', async () => {
        renderizar()
        await userEvent.selectOptions(screen.getByLabelText('Filtrar por estado'), 'Pendiente')
        expect(screen.getByText('No hay órdenes para mostrar.')).toBeInTheDocument()
    })

})