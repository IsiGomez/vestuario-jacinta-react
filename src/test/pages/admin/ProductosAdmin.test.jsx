import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ProductosAdmin from '../../../pages/admin/ProductosAdmin'
import { actualizarProducto, obtenerProductos } from '../../../data/productos'
import { precio } from '../../helpers'

const renderizar = () => render(<MemoryRouter><ProductosAdmin /></MemoryRouter>)
const filaDe = (nombre) => screen.getByText(nombre).closest('tr')

describe('ProductosAdmin', () => {
    it('lista los 4 productos iniciales (más la fila de encabezado)', () => {
        renderizar()
        expect(screen.getAllByRole('row')).toHaveLength(5)
    })

    it('muestra categoría, género, precio y stock de cada producto', () => {
        renderizar()
        const fila = filaDe('Camisa manga larga hombre')
        expect(within(fila).getByText('Camisas')).toBeInTheDocument()
        expect(within(fila).getByText('hombre')).toBeInTheDocument()
        expect(within(fila).getByText(precio(17990))).toBeInTheDocument()
        expect(within(fila).getByText('3')).toBeInTheDocument()
    })

    it('pinta el stock en rojo si es crítico y en verde si no', () => {
        renderizar()
        expect(within(filaDe('Camisa manga larga hombre')).getByText('3')).toHaveClass('bg-danger')
        expect(within(filaDe('Camisa manga corta hombre')).getByText('25')).toHaveClass('bg-success')
    })

    it('muestra la miniatura de la primera imagen del primer color', () => {
        renderizar()
        const img = within(filaDe('Camisa manga corta hombre')).getByRole('img')
        expect(img).toHaveAttribute('src', '/assets/img/productos/hombre/cam_corta/azul_1.jpg')
    })

    it('muestra "Sin categoría" si la categoría ya no existe', () => {
        actualizarProducto(1, { categoriaId: 99 })
        renderizar()
        expect(within(filaDe('Camisa manga corta hombre')).getByText('Sin categoría')).toBeInTheDocument()
    })

    it('tiene los enlaces de reporte, críticos y nuevo producto', () => {
        renderizar()
        expect(screen.getByRole('link', { name: /Ver Reporte/ })).toHaveAttribute('href', '/admin/reportes/productos')
        expect(screen.getByRole('link', { name: /Críticos/ })).toHaveAttribute('href', '/admin/productos/criticos')
        expect(screen.getByRole('link', { name: /Nuevo producto/ })).toHaveAttribute('href', '/admin/productos/nuevo')
    })

    it('cada fila enlaza a la edición de su producto', () => {
        renderizar()
        const enlace = within(filaDe('Camisa manga larga mujer')).getByRole('link', { name: /Editar/ })
        expect(enlace).toHaveAttribute('href', '/admin/productos/4/editar')
    })

    it('no elimina si se cancela la confirmación', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(false)
        renderizar()

        await userEvent.click(within(filaDe('Camisa manga corta hombre')).getByRole('button', { name: /Eliminar/ }))

        expect(screen.getByText('Camisa manga corta hombre')).toBeInTheDocument()
        expect(obtenerProductos()).toHaveLength(4)
    })

    it('muestra un mensaje cuando no hay productos', () => {
        localStorage.setItem('jacinta_productos', '[]')
        renderizar()
        expect(screen.getByText('No hay productos registrados.')).toBeInTheDocument()
    })
})