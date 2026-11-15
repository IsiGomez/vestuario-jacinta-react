import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdminLayout from '../../layouts/AdminLayout'
import { AuthContext } from '../../context/authContext'
it('el vendedor no tiene acceso al menú de usuarios ni reportes generales', () => {
    render(<AuthContext.Provider value={{ usuario: { nombre: 'Vendedor', tipoUsuario: 'VENDEDOR' }, esAdmin: false, cerrarSesion: vi.fn() }}>
        <MemoryRouter><AdminLayout /></MemoryRouter></AuthContext.Provider>)
    expect(screen.queryByRole('link', { name: 'Usuarios' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Reportes', exact: true })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Reportes de productos' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Categorías' })).toBeInTheDocument()
})
