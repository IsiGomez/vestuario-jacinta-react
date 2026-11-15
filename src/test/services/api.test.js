import { apiFetch, ApiError, guardarAccessToken } from '../../services/api'

describe('apiFetch', () => {
    let fetchMock
    beforeEach(() => {
        fetchMock = vi.fn()
        vi.stubGlobal('fetch', fetchMock)
    })
    afterEach(() => vi.unstubAllGlobals())

    function responder(body, status = 200, tipo = 'application/json') {
        fetchMock.mockResolvedValue({ ok: status < 400, status,
            headers: new Headers({ 'Content-Type': tipo }),
            text: async () => body,
        })
    }

    it('envía JSON y lee el token en cada petición', async () => {
        responder('{"id":1}')
        guardarAccessToken('primero')
        expect(await apiFetch('/usuarios', { method: 'POST', body: { nombre: 'Ana' } }))
            .toEqual({ id: 1 })
        const [url, opciones] = fetchMock.mock.calls[0]
        expect(url).toBe(`${import.meta.env.VITE_API_URL}/usuarios`)
        expect(opciones.headers.get('Authorization')).toBe('Bearer primero')
        expect(opciones.headers.get('Content-Type')).toBe('application/json')
        expect(opciones.body).toBe('{"nombre":"Ana"}')
        guardarAccessToken('segundo')
        await apiFetch('/usuarios')
        expect(fetchMock.mock.calls[1][1].headers.get('Authorization')).toBe('Bearer segundo')
    })

    it('permite peticiones públicas y quitar el token', async () => {
        responder('{}')
        guardarAccessToken('token')
        await apiFetch('/auth/login', { autenticado: false })
        expect(fetchMock.mock.calls[0][1].headers.has('Authorization')).toBe(false)
        guardarAccessToken(null)
        await apiFetch('/productos')
        expect(fetchMock.mock.calls[1][1].headers.has('Authorization')).toBe(false)
    })

    it('conserva el estado HTTP y mensaje de error', async () => {
        responder('{"mensaje":"Sin acceso"}', 403)
        await expect(apiFetch('/usuarios')).rejects.toMatchObject({
            name: 'ApiError', status: 403, message: 'Sin acceso',
        })
        responder('', 401)
        await expect(apiFetch('/usuarios')).rejects.toBeInstanceOf(ApiError)
    })

    it('acepta respuestas vacías y texto', async () => {
        responder('', 204)
        expect(await apiFetch('/usuarios/1', { method: 'DELETE' })).toBeNull()
        responder('ok', 200, 'text/plain')
        expect(await apiFetch('/estado')).toBe('ok')
    })

    it('respeta FormData y propaga errores de red', async () => {
        responder('{}')
        const body = new FormData()
        body.append('nombre', 'Ana')
        await apiFetch('/archivo', { method: 'POST', body })
        expect(fetchMock.mock.calls[0][1].body).toBe(body)
        expect(fetchMock.mock.calls[0][1].headers.has('Content-Type')).toBe(false)
        fetchMock.mockRejectedValue(new TypeError('Sin conexión'))
        await expect(apiFetch('/estado')).rejects.toThrow('Sin conexión')
    })
})
