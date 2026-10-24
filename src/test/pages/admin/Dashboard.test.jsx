import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from '../../../pages/admin/Dashboard'
import { AuthContext } from '../../../context/authContext'
import { crearUsuario } from '../../../data/usuarios'
import { actualizarProducto, obtenerProductos } from '../../../data/productos'
import { precio, tarjeta } from '../../helpers'

beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-10-22T12:00:00'))
})
afterEach(() => {
    vi.useRealTimers()
})

const renderizar = () =>
    render(
        <AuthContext.Provider value={{ usuario: { id: 1, nombre: 'Admin', tipoUsuario: 'Administrador' } }}>
            <MemoryRouter><Dashboard /></MemoryRouter>
        </AuthContext.Provider>
    )

const tarjetaPorTitulo = (t) => within(tarjeta(t))


describe('Dashboard - encabezado y accesos', () => {
    it('saluda al usuario en sesión', () => {
        renderizar()
        expect(screen.getByRole('heading', { name: 'Hola, Admin' })).toBeInTheDocument()
    })

    it('tiene accesos a nuevo producto y a las órdenes', () => {
        renderizar()
        expect(screen.getByRole('link', { name: /Nuevo producto/ })).toHaveAttribute('href', '/admin/productos/nuevo')
        expect(screen.getByRole('link', { name: /Ver órdenes/ })).toHaveAttribute('href', '/admin/ordenes')
    })
})


describe('Dashboard - tarjetas resumen', () => {
    it('Ventas totales: suma de órdenes pagadas y ticket promedio', () => {
        renderizar()
        expect(tarjeta('Ventas totales')).toHaveTextContent(precio(143910))
        expect(tarjeta('Ventas totales')).toHaveTextContent(`Ticket promedio ${precio(47970)}`)
    })

    it('Órdenes: total y desglose por estado', () => {
        renderizar()
        expect(tarjetaPorTitulo('Órdenes').getByText('4')).toBeInTheDocument()
        expect(tarjeta('Órdenes')).toHaveTextContent('3 pagadas · 0 pendientes · 1 fallidas')
    })

    it('Productos críticos: cantidad sobre el total de productos', () => {
        renderizar()
        expect(tarjetaPorTitulo('Productos críticos').getByText('1')).toBeInTheDocument()
        expect(tarjeta('Productos críticos')).toHaveTextContent('de 4 productos')
    })

    it('Clientes: solo cuenta usuarios de tipo Cliente', () => {
        crearUsuario({ run: '12345678-5', nombre: 'Ana', apellidos: 'Gómez', correo: 'ana@gmail.com', contrasena: 'abcd', tipoUsuario: 'Cliente' })
        renderizar()
        expect(tarjetaPorTitulo('Clientes').getByText('1')).toBeInTheDocument()
    })

    it('Clientes es 0 si solo existe el administrador', () => {
        renderizar()
        expect(tarjetaPorTitulo('Clientes').getByText('0')).toBeInTheDocument()
    })
})


describe('Dashboard - gráfico de ventas por mes', () => {
    it('dibuja 6 columnas', () => {
        const { container } = renderizar()
        expect(container.querySelectorAll('.dash-col')).toHaveLength(6)
    })

    it('los meses con ventas muestran su monto y los demás un guion', () => {
        const { container } = renderizar()
        const columnas = [...container.querySelectorAll('.dash-col')]

        expect(columnas.at(-1)).toHaveTextContent(precio(44970 + 50970)) // octubre
        expect(columnas.at(-1)).toHaveAttribute('title', '2 orden(es) pagada(s)')
        expect(columnas.at(-2)).toHaveTextContent(precio(47970))         // septiembre
        expect(columnas.slice(0, 4).every((c) => c.textContent.includes('—'))).toBe(true)
    })

    it('solo los meses con ventas tienen barra, y el mayor ocupa el 100%', () => {
        const { container } = renderizar()
        const barras = container.querySelectorAll('.dash-barra')
        expect(barras).toHaveLength(2)
        expect(barras[1].style.height).toBe('100%') // octubre es el mayor
    })
})


describe('Dashboard - órdenes por estado y más vendidos', () => {
    it('lista cada estado con su cantidad', () => {
        renderizar()
        const lista = screen.getByText('Pago fallido', { selector: 'li > span' }).closest('ul')
        expect(within(lista).getByText('Pagada').closest('li')).toHaveTextContent('3')
        expect(within(lista).getByText('Pago fallido').closest('li')).toHaveTextContent('1')
        expect(within(lista).getByText('Pendiente').closest('li')).toHaveTextContent('0')
    })

    it('la barra de progreso tiene un segmento por estado', () => {
        const { container } = renderizar()
        const segmentos = container.querySelectorAll('.progress-bar')
        expect(segmentos).toHaveLength(3)
        expect(segmentos[0]).toHaveStyle({ width: '75%' }) // 3 de 4 pagadas
        expect(segmentos[0]).toHaveClass('bg-success')
    })

    it('lista los más vendidos con sus unidades (solo órdenes pagadas)', () => {
        renderizar()
        const items = screen.getAllByRole('listitem').filter((li) => li.textContent.includes('uds.'))
        expect(items.map((li) => li.textContent.replace(/\s+/g, ' ').trim())).toEqual([
            'Camisa manga corta hombre · 6 uds.',
            'Camisa manga larga mujer · 3 uds.',
        ])
    })

    it('sin órdenes muestra los mensajes vacíos', () => {
        localStorage.setItem('jacinta_ordenes', '[]')
        renderizar()
        expect(screen.getByText('Sin ventas registradas.')).toBeInTheDocument()
        expect(screen.getAllByText('Todavía no hay órdenes.')).toHaveLength(2) // tarjeta de estados + tabla
        expect(tarjeta('Ventas totales')).toHaveTextContent(precio(0))
    })
})


describe('Dashboard - últimas órdenes', () => {
    it('muestra las órdenes de la más reciente a la más antigua con enlace a su boleta', () => {
        renderizar()
        const tabla = screen.getByText('Últimas órdenes').closest('.card-body')
        const numeros = within(tabla).getAllByText(/^#/).map((n) => n.textContent)
        expect(numeros).toEqual(['#2026101004', '#2026100203', '#2026091502', '#2026090101'])

        const fila = within(tabla).getByText('#2026091502').closest('tr')
        expect(within(fila).getByText('Pago fallido')).toHaveClass('text-bg-danger')
        expect(within(fila).getByRole('link', { name: 'Boleta' })).toHaveAttribute('href', '/admin/ordenes/2')
    })

    it('muestra como máximo 5 órdenes', () => {
        const base = JSON.parse(JSON.stringify([{
            id: 1, numero: '1', fecha: '2026-10-01T10:00:00', usuarioId: null, estado: 'Pagada',
            cliente: { nombre: 'A', apellidos: 'B', correo: 'a@gmail.com' }, entrega: {},
            items: [{ productoId: 1, nombre: 'X', precio: 1000, cantidad: 1 }],
        }]))
        const siete = Array.from({ length: 7 }, (_, i) => ({ ...base[0], id: i + 1, numero: String(1000 + i) }))
        localStorage.setItem('jacinta_ordenes', JSON.stringify(siete))
        renderizar()

        const tabla = screen.getByText('Últimas órdenes').closest('.card-body')
        expect(within(tabla).getAllByRole('link', { name: 'Boleta' })).toHaveLength(5)
    })

    it('tiene el enlace "Ver todas" a las órdenes', () => {
        renderizar()
        expect(screen.getAllByRole('link', { name: 'Ver todas' })[0]).toHaveAttribute('href', '/admin/ordenes')
    })
})


describe('Dashboard - stock crítico', () => {
    it('lista los productos críticos con su stock y enlace de edición', () => {
        renderizar()
        const tarjetaCriticos = screen.getByText('Stock crítico').closest('.card-body')
        expect(within(tarjetaCriticos).getByText('Camisa manga larga hombre')).toBeInTheDocument()
        expect(within(tarjetaCriticos).getByText('Stock 3 · crítico en 5')).toBeInTheDocument()
        expect(within(tarjetaCriticos).getByText('Crítico')).toBeInTheDocument()
        expect(within(tarjetaCriticos).getByRole('link', { name: 'Editar' })).toHaveAttribute('href', '/admin/productos/2/editar')
    })

    it('marca "Agotado" y ordena primero los de menor stock', () => {
        actualizarProducto(3, { stock: 0 })
        renderizar()
        const tarjetaCriticos = screen.getByText('Stock crítico').closest('.card-body')
        const nombres = within(tarjetaCriticos).getAllByRole('listitem').map((li) => li.querySelector('.fw-semibold').textContent)
        expect(nombres).toEqual(['Camisa manga corta mujer', 'Camisa manga larga hombre'])
        expect(within(tarjetaCriticos).getByText('Agotado')).toBeInTheDocument()
    })

    it('si no hay críticos muestra el mensaje de éxito', () => {
        obtenerProductos().forEach((p) => actualizarProducto(p.id, { stock: 100 }))
        renderizar()
        expect(screen.getByText('Todos los productos tienen stock sobre su nivel crítico.')).toBeInTheDocument()
    })

    it('tiene el enlace "Ver todos" a los críticos', () => {
        renderizar()
        expect(screen.getByRole('link', { name: 'Ver todos' })).toHaveAttribute('href', '/admin/productos/criticos')
    })
})