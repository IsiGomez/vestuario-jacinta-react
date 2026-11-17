import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductosCriticos from '../../../pages/admin/ProductosCriticos'
import * as productos from '../../../services/productoService'
import { camisaLargaHombre, camisaCortaMujer } from '../../fixtures/productos'

vi.mock('../../../services/productoService', () => ({ obtenerProductosCriticos: vi.fn() }))

const renderizar = () => render(<MemoryRouter><ProductosCriticos /></MemoryRouter>)

describe('ProductosCriticos', () => {
    it('lista el producto con stock bajo y lo marca como "Crítico"', async () => {
        productos.obtenerProductosCriticos.mockResolvedValue([camisaLargaHombre])
        renderizar()
        const fila = (await screen.findByText('Camisa manga larga hombre')).closest('tr')
        expect(within(fila).getByText('Crítico')).toBeInTheDocument()
        expect(within(fila).getAllByText('3').length).toBeGreaterThan(0) // stock actual
        expect(within(fila).getByText('5')).toBeInTheDocument()          // stock crítico
    })

    it('muestra solo lo que devuelve el servidor, sin recalcular qué es crítico', async () => {
        productos.obtenerProductosCriticos.mockResolvedValue([camisaLargaHombre])
        renderizar()
        await screen.findByText('Camisa manga larga hombre')
        expect(screen.queryByText('Camisa manga corta hombre')).not.toBeInTheDocument()
    })

    it('marca como "Agotado" los productos sin stock', async () => {
        productos.obtenerProductosCriticos.mockResolvedValue([{ ...camisaCortaMujer, stock: 0 }])
        renderizar()
        const fila = (await screen.findByText('Camisa manga corta mujer')).closest('tr')
        expect(within(fila).getByText('Agotado')).toBeInTheDocument()
    })

    it('respeta el orden que entrega el servidor (menor stock primero)', async () => {
        productos.obtenerProductosCriticos.mockResolvedValue([{ ...camisaCortaMujer, stock: 0 }, camisaLargaHombre])
        renderizar()
        await screen.findByText('Camisa manga corta mujer')
        const filas = screen.getAllByRole('row').slice(1).map((f) => f.textContent)
        expect(filas[0]).toContain('Camisa manga corta mujer')
        expect(filas[1]).toContain('Camisa manga larga hombre')
    })

    it('cada fila enlaza a la edición del producto', async () => {
        productos.obtenerProductosCriticos.mockResolvedValue([camisaLargaHombre])
        renderizar()
        expect(await screen.findByRole('link', { name: 'Editar stock' })).toHaveAttribute('href', '/admin/productos/2/editar')
    })

    it('tiene un enlace para volver al listado de productos', async () => {
        productos.obtenerProductosCriticos.mockResolvedValue([])
        renderizar()
        await screen.findByText(/Todos los productos tienen stock/)
        expect(screen.getByRole('link', { name: /Volver a productos/ })).toHaveAttribute('href', '/admin/productos')
    })

    it('si ninguno es crítico muestra el mensaje de éxito en vez de la tabla', async () => {
        productos.obtenerProductosCriticos.mockResolvedValue([])
        renderizar()
        expect(await screen.findByText(/Todos los productos tienen stock sobre su nivel crítico/)).toBeInTheDocument()
        expect(screen.queryByRole('table')).not.toBeInTheDocument()
    })
})