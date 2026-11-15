import { crearUsuario, actualizarUsuario, eliminarUsuario, actualizarPerfil } from '../../services/usuarioService'
import { apiFetch } from '../../services/api'
vi.mock('../../services/api', () => ({ apiFetch: vi.fn().mockResolvedValue({ id: 1 }) }))
it('usa endpoints de usuarios y convierte fecha vacía a null', async () => {
    await crearUsuario({ nombre: 'Ana', fechaNacimiento: '' })
    expect(apiFetch).toHaveBeenCalledWith('/usuarios', { method: 'POST', body: { nombre: 'Ana', fechaNacimiento: null } })
    await actualizarUsuario(2, { nombre: 'Ana' })
    expect(apiFetch).toHaveBeenCalledWith('/usuarios/2', expect.objectContaining({ method: 'PUT' }))
    await actualizarPerfil({ nombre: 'Ana' })
    expect(apiFetch).toHaveBeenCalledWith('/usuarios/perfil', expect.objectContaining({ method: 'PUT' }))
    await eliminarUsuario(2)
    expect(apiFetch).toHaveBeenCalledWith('/usuarios/2', { method: 'DELETE' })
})
