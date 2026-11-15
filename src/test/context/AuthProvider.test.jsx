import { renderHook, waitFor, act } from '@testing-library/react'
import { AuthProvider } from '../../context/AuthProvider'
import { useAuth } from '../../hooks/useAuth'
import * as auth from '../../services/authService'
import { guardarTokens } from '../../services/api'
import { admin } from '../fixtures/usuarios'
vi.mock('../../services/authService', () => ({ login: vi.fn(), guardarSesion: vi.fn(), obtenerSesion: vi.fn() }))
const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>
it('ignora una sesión basada en ID de localStorage', async () => {
    localStorage.setItem('jacinta_sesion', '1')
    const { result } = renderHook(() => useAuth(), { wrapper })
    await waitFor(() => expect(result.current.cargando).toBe(false))
    expect(result.current.usuario).toBeNull()
    expect(localStorage.getItem('jacinta_sesion')).toBeNull()
})
it('espera /me antes de restaurar la sesión y borra tokens al salir', async () => {
    guardarTokens('access', 'refresh')
    let resolver
    auth.obtenerSesion.mockReturnValue(new Promise((resolve) => { resolver = resolve }))
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.cargando).toBe(true)
    expect(result.current.usuario).toBeNull()
    await act(async () => resolver(admin))
    await waitFor(() => expect(result.current.usuario).toEqual(admin))
    act(() => result.current.cerrarSesion())
    expect(result.current.usuario).toBeNull()
    expect(localStorage.getItem('jacinta_access_token')).toBeNull()
    expect(localStorage.getItem('jacinta_refresh_token')).toBeNull()
})
it('no restaura una petición antigua después de cerrar sesión', async () => {
    guardarTokens('access', 'refresh')
    let resolver
    auth.obtenerSesion.mockReturnValue(new Promise((resolve) => { resolver = resolve }))
    const { result } = renderHook(() => useAuth(), { wrapper })
    act(() => result.current.cerrarSesion())
    await act(async () => resolver(admin))
    expect(result.current.usuario).toBeNull()
})
