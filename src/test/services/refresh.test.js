import { apiFetch, guardarTokens } from '../../services/api'
function respuesta(body, status = 200) {
    return { ok: status < 400, status, headers: new Headers({ 'Content-Type': 'application/json' }), text: async () => JSON.stringify(body) }
}
afterEach(() => vi.unstubAllGlobals())
it('renueva una sola vez para peticiones simultáneas y repite con el token nuevo', async () => {
    guardarTokens('viejo', 'refresh')
    const fetchMock = vi.fn(async (url, options) => {
        if (url.endsWith('/auth/refresh')) return respuesta({ accessToken: 'nuevo' })
        return options.headers.get('Authorization') === 'Bearer nuevo'
            ? respuesta({ id: 1 }) : respuesta({ mensaje: 'Vencido' }, 401)
    })
    vi.stubGlobal('fetch', fetchMock)
    const resultados = await Promise.all([apiFetch('/auth/me'), apiFetch('/usuarios')])
    expect(resultados).toEqual([{ id: 1 }, { id: 1 }])
    expect(fetchMock.mock.calls.filter(([url]) => url.endsWith('/auth/refresh'))).toHaveLength(1)
})
it('borra la sesión si el refresh es inválido', async () => {
    guardarTokens('viejo', 'refresh')
    vi.stubGlobal('fetch', vi.fn(async () => respuesta({ mensaje: 'Vencido' }, 401)))
    const expirada = vi.fn()
    window.addEventListener('jacinta:sesion-expirada', expirada)
    try {
        await expect(apiFetch('/auth/me')).rejects.toMatchObject({ status: 401 })
        expect(expirada).toHaveBeenCalledTimes(1)
        expect(localStorage.getItem('jacinta_access_token')).toBeNull()
    } finally { window.removeEventListener('jacinta:sesion-expirada', expirada) }
})
