import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TarjetaResumen from '../../components/TarjetaResumen'

describe('TarjetaResumen', () => {
    it('muestra el título y el valor', () => {
        render(<TarjetaResumen titulo="Órdenes" valor={12} icono="bi-receipt" />)
        expect(screen.getByText('Órdenes')).toBeInTheDocument()
        expect(screen.getByText('12')).toBeInTheDocument()
    })

    it('acepta el valor 0 (no lo oculta)', () => {
        render(<TarjetaResumen titulo="Clientes" valor={0} icono="bi-people" />)
        expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('usa el color "primary" por defecto', () => {
        const { container } = render(<TarjetaResumen titulo="X" valor={1} icono="bi-x" />)
        expect(container.firstChild).toHaveClass('card', 'text-bg-primary')
    })

    it('aplica el color indicado', () => {
        const { container } = render(<TarjetaResumen titulo="X" valor={1} icono="bi-x" color="danger" />)
        expect(container.firstChild).toHaveClass('text-bg-danger')
        expect(container.firstChild).not.toHaveClass('text-bg-primary')
    })

    it('muestra el detalle solo si se entrega la información', () => {
        const { rerender } = render(<TarjetaResumen titulo="X" valor={1} icono="bi-x" />)
        expect(screen.queryByText('Ticket promedio $100')).not.toBeInTheDocument()

        rerender(<TarjetaResumen titulo="X" valor={1} icono="bi-x" detalle="Ticket promedio $100" />)
        expect(screen.getByText('Ticket promedio $100')).toBeInTheDocument()
    })

    it('muestra el icono de Bootstrap Icons indicado', () => {
        const { container } = render(<TarjetaResumen titulo="X" valor={1} icono="bi-cash-coin" />)
        expect(container.querySelector('i')).toHaveClass('bi', 'bi-cash-coin')
    })
})