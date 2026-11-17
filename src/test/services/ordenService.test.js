import {
    obtenerOrdenes, obtenerOrdenPorId, obtenerOrdenesDeUsuario, actualizarEstadoOrden, crearOrden,
} from '../../services/ordenService'
import { apiFetch } from '../../services/api'

vi.mock('../../services/api', () => ({ apiFetch: vi.fn(), CLAVE_ACCESS_TOKEN: 'jacinta_access_token' }))

const datos = { cliente: {}, entrega: {}, items: [{ productoId: 1, cantidad: 1, talla: 'M', color: 'azul' }] }
const iniciarSesion = () => localStorage.setItem('jacinta_access_token', JSON.stringify('token'))

describe('ordenService', () => {
    beforeEach(() => {
        apiFetch.mockReset()
    })

    it('usa los endpoints de consulta', async () => {
        apiFetch.mockResolvedValue([])

        await obtenerOrdenes()
        await obtenerOrdenPorId(7)
        await obtenerOrdenesDeUsuario(2)

        expect(apiFetch).toHaveBeenNthCalledWith(1, '/ordenes')
        expect(apiFetch).toHaveBeenNthCalledWith(2, '/ordenes/7')
        expect(apiFetch).toHaveBeenNthCalledWith(3, '/ordenes/usuario/2')
    })

    it('cambia el estado con PATCH y el estado en el cuerpo', async () => {
        apiFetch.mockResolvedValue({})

        await actualizarEstadoOrden(7, 'PAGO_FALLIDO')

        expect(apiFetch).toHaveBeenCalledWith('/ordenes/7/estado', { method: 'PATCH', body: { estado: 'PAGO_FALLIDO' } })
    })

    it('crea la orden con POST y devuelve lo que responde el servidor', async () => {
        apiFetch.mockResolvedValue({ id: 9 })

        const orden = await crearOrden(datos)

        expect(orden).toEqual({ id: 9 })
        expect(apiFetch).toHaveBeenCalledWith('/ordenes', { method: 'POST', body: datos })
    })

    it('con sesión iniciada la renueva antes de comprar, para que la orden quede con su usuario', async () => {
        iniciarSesion()
        apiFetch.mockResolvedValue({ id: 9 })

        await crearOrden(datos)

        expect(apiFetch).toHaveBeenNthCalledWith(1, '/auth/me')
        expect(apiFetch).toHaveBeenNthCalledWith(2, '/ordenes', { method: 'POST', body: datos })
    })

    it('un invitado compra sin consultar la sesión', async () => {
        apiFetch.mockResolvedValue({ id: 9 })

        await crearOrden(datos)

        expect(apiFetch).toHaveBeenCalledTimes(1)
        expect(apiFetch).toHaveBeenCalledWith('/ordenes', expect.anything())
    })

    it('un error del servidor al comprar se propaga a la página', async () => {
        apiFetch.mockRejectedValue(Object.assign(new Error('Sin stock'), { status: 409 }))

        await expect(crearOrden(datos)).rejects.toMatchObject({ status: 409 })
    })
})