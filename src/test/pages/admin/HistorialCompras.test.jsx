import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import HistorialCompras from '../../../pages/admin/HistorialCompras'
import { crearUsuario } from '../../../data/usuarios'
import { crearOrden } from '../../../data/ordenes'
import { precio, tarjeta } from '../../helpers'

const crearCliente = (extra = {}) =>
    crearUsuario({
        run: '12345678-5', nombre: 'Camila', apellidos: 'Rojas Pérez', correo: 'camila.rojas@gmail.com',
        contrasena: 'abcd', tipoUsuario: 'Cliente', ...extra,
    })

const renderizar = (id) =>
    render(
        <MemoryRouter initialEntries={[`/admin/usuarios/${id}/historial`]}>
            <Routes>
                <Route path="/admin/usuarios/:id/historial" element={<HistorialCompras />} />
            </Routes>
        </MemoryRouter>
    )


describe('HistorialCompras', () => {
    it('muestra el nombre y el correo del cliente', () => {
        crearCliente()
        renderizar(2)
        expect(screen.getByRole('heading', { name: 'Historial de compras' })).toBeInTheDocument()
        expect(screen.getByText('Camila Rojas Pérez · camila.rojas@gmail.com')).toBeInTheDocument()
    })

    it('encuentra las órdenes del cliente por su correo', () => {
        crearCliente()
        renderizar(2)
        const numeros = screen.getAllByRole('row').slice(1).map((f) => within(f).getAllByRole('cell')[0].textContent)
        expect(numeros).toEqual(['#2026100203', '#2026090101']) // de la más nueva a la más antigua
    })

    it('el resumen cuenta solo compras pagadas y suma su total', () => {
        crearCliente()
        crearOrden({
            usuarioId: 2,
            cliente: { nombre: 'Camila', apellidos: 'Rojas Pérez', correo: 'camila.rojas@gmail.com' },
            entrega: { calle: 'x', departamento: '', region: 'x', comuna: 'x', indicaciones: '' },
            items: [{ productoId: 1, nombre: 'Camisa', precio: 99999, cantidad: 1 }],
            estado: 'Pago fallido',
        })
        renderizar(2)

        expect(tarjeta('Compras pagadas')).toHaveTextContent('2')
        expect(tarjeta('Total gastado')).toHaveTextContent(precio(47970 + 44970))
    })

    it('muestra el estado de cada orden con su color', () => {
        crearCliente({ nombre: 'Pedro', apellidos: 'Soto Díaz', correo: 'pedro.soto@gmail.com' })
        renderizar(2)
        const filaFallida = screen.getByText('#2026091502').closest('tr')
        expect(within(filaFallida).getByText('Pago fallido')).toHaveClass('text-bg-danger')
        expect(within(screen.getByText('#2026101004').closest('tr')).getByText('Pagada')).toHaveClass('text-bg-success')
    })

    it('cada orden enlaza a su boleta', () => {
        crearCliente()
        renderizar(2)
        const fila = screen.getByText('#2026090101').closest('tr')
        expect(within(fila).getByRole('link', { name: 'Ver boleta' })).toHaveAttribute('href', '/admin/ordenes/1')
    })

})