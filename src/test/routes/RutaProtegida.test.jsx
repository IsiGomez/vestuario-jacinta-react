import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'
import RutaProtegida from '../../routes/RutaProtegida'
function mostrar(usuario, cargando = false) {
    render(<AuthContext.Provider value={{ usuario, cargando }}><MemoryRouter initialEntries={['/admin/usuarios']}><Routes>
        <Route path="/admin/usuarios" element={<RutaProtegida roles={['ADMINISTRADOR']}><p>Usuarios privados</p></RutaProtegida>} />
        <Route path="/login" element={<p>Login</p>} /><Route path="/" element={<p>Tienda</p>} />
    </Routes></MemoryRouter></AuthContext.Provider>)
}
it('espera la restauración antes de redirigir', () => {
    mostrar(null, true); expect(screen.getByRole('status')).toHaveTextContent('Cargando sesión')
    expect(screen.queryByText('Login')).not.toBeInTheDocument()
})
it('rechaza acceso directo de vendedor a usuarios', () => {
    mostrar({ tipoUsuario: 'VENDEDOR' }); expect(screen.getByText('Tienda')).toBeInTheDocument()
})
it('rechaza acceso directo del cliente al panel', () => {
    mostrar({ tipoUsuario: 'CLIENTE' }); expect(screen.queryByText('Usuarios privados')).not.toBeInTheDocument()
})
it('permite al administrador', () => {
    mostrar({ tipoUsuario: 'ADMINISTRADOR' }); expect(screen.getByText('Usuarios privados')).toBeInTheDocument()
})
