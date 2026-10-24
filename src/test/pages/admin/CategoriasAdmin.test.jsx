import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import CategoriasAdmin from '../../../pages/admin/CategoriasAdmin'
import { crearCategoria, obtenerCategorias } from '../../../data/categorias'

const renderizar = () => render(<MemoryRouter><CategoriasAdmin /></MemoryRouter>)

describe('CategoriasAdmin', () => {
    it('lista las categorías con su cantidad de productos', () => {
        renderizar()
        const fila = screen.getByText('Camisas').closest('tr')
        expect(within(fila).getByText('4')).toBeInTheDocument()
    })

    it('tiene el enlace para crear una nueva categoría', () => {
        renderizar()
        expect(screen.getByRole('link', { name: /Nueva categoría/ })).toHaveAttribute('href', '/admin/categorias/nueva')
    })

    it('cada categoría enlaza a su edición', () => {
        renderizar()
        expect(screen.getByRole('link', { name: 'Editar' })).toHaveAttribute('href', '/admin/categorias/1/editar')
    })

    it('deshabilita "Eliminar" si la categoría tiene productos', () => {
        renderizar()
        expect(screen.getByRole('button', { name: 'Eliminar' })).toBeDisabled()
    })

    it('no elimina si el usuario cancela la confirmación', async () => {
        crearCategoria({ nombre: 'Poleras', descripcion: 'Poleras varias' })
        vi.spyOn(window, 'confirm').mockReturnValue(false)
        renderizar()

        const fila = screen.getByText('Poleras').closest('tr')
        await userEvent.click(within(fila).getByRole('button', { name: 'Eliminar' }))

        expect(screen.getByText('Poleras')).toBeInTheDocument()
        expect(obtenerCategorias()).toHaveLength(2)
    })

    it('muestra un mensaje cuando no hay categorías', () => {
        localStorage.setItem('jacinta_categorias', '[]')
        renderizar()
        expect(screen.getByText('No hay categorías registradas.')).toBeInTheDocument()
    })
})