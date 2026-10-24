import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductosCriticos from '../../../pages/admin/ProductosCriticos'
import { actualizarProducto, obtenerProductos } from '../../../data/productos'

const renderizar = () => render(<MemoryRouter><ProductosCriticos /></MemoryRouter>)

describe('ProductosCriticos', () => {
    it('lista el producto con stock bajo y lo marca como "Crítico"', () => {
        renderizar()
        const fila = screen.getByText('Camisa manga larga hombre').closest('tr')
        expect(within(fila).getByText('Crítico')).toBeInTheDocument()
        expect(within(fila).getAllByText('3').length).toBeGreaterThan(0) // stock actual
        expect(within(fila).getByText('5')).toBeInTheDocument()          // stock crítico
    })

    it('no lista productos con stock sobre el nivel crítico', () => {
        renderizar()
        expect(screen.queryByText('Camisa manga corta hombre')).not.toBeInTheDocument()
    })

    it('marca como "Agotado" los productos sin stock', () => {
        actualizarProducto(3, { stock: 0 })
        renderizar()
        const fila = screen.getByText('Camisa manga corta mujer').closest('tr')
        expect(within(fila).getByText('Agotado')).toBeInTheDocument()
    })

    it('ordena de menor a mayor stock', () => {
        actualizarProducto(3, { stock: 0 })
        renderizar()
        const nombres = screen.getAllByRole('row').slice(1).map((f) => f.textContent)
        expect(nombres[0]).toContain('Camisa manga corta mujer') // stock 0
        expect(nombres[1]).toContain('Camisa manga larga hombre') // stock 3
    })

    it('cada fila enlaza a la edición del producto', () => {
        renderizar()
        expect(screen.getByRole('link', { name: 'Editar stock' })).toHaveAttribute('href', '/admin/productos/2/editar')
    })

    it('tiene un enlace para volver al listado de productos', () => {
        renderizar()
        expect(screen.getByRole('link', { name: /Volver a productos/ })).toHaveAttribute('href', '/admin/productos')
    })

    it('si ninguno es crítico muestra el mensaje de éxito en vez de la tabla', () => {
        obtenerProductos().forEach((p) => actualizarProducto(p.id, { stock: 100 }))
        renderizar()
        expect(screen.getByText(/Todos los productos tienen stock sobre su nivel crítico/)).toBeInTheDocument()
        expect(screen.queryByRole('table')).not.toBeInTheDocument()
    })
})