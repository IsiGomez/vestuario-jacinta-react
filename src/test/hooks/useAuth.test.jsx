import { renderHook } from '@testing-library/react'
import { AuthContext } from '../../context/authContext'
import { useAuth } from '../../hooks/useAuth'

describe('useAuth', () => {
    it('expone puede y actualiza los permisos al cambiar la sesión', () => {
        function Wrapper({ children, usuario }) {
            return <AuthContext.Provider value={{ usuario }}>{children}</AuthContext.Provider>
        }
        let usuario = { tipoUsuario: 'Administrador' }
        const wrapper = ({ children }) => <Wrapper usuario={usuario}>{children}</Wrapper>
        const { result, rerender } = renderHook(() => useAuth(), { wrapper })
        expect(result.current.usuario).toBe(usuario)
        expect(result.current.puede('productos:eliminar')).toBe(true)
        usuario = { tipoUsuario: 'VENDEDOR' }
        rerender()
        expect(result.current.puede('productos:eliminar')).toBe(false)
        expect(result.current.puede('productos:editar')).toBe(true)
        usuario = null
        rerender()
        expect(result.current.puede('productos:editar')).toBe(false)
    })
})
