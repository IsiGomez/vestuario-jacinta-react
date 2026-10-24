import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import UsuariosAdmin from '../../../pages/admin/UsuariosAdmin'
import { AuthContext } from '../../../context/authContext'
import { crearUsuario, obtenerUsuarios } from '../../../data/usuarios'

const SESION_ADMIN = { id: 1, nombre: 'Admin', tipoUsuario: 'Administrador' }

const crearCliente = (extra = {}) =>
    crearUsuario({
        run: '12345678-5',
        nombre: 'Ana',
        apellidos: 'Gómez',
        correo: 'ana@gmail.com',
        contrasena: 'abcd',
        tipoUsuario: 'Cliente',
        region: 'Valparaíso',
        comuna: 'Quilpué',
        direccion: 'Calle Falsa 12345',
        ...extra,
    })

const renderizar = () =>
    render(
        <AuthContext.Provider value={{ usuario: SESION_ADMIN }}>
            <MemoryRouter><UsuariosAdmin /></MemoryRouter>
        </AuthContext.Provider>
    )

const filaDe = (texto) => screen.getByText(texto).closest('tr')


describe('UsuariosAdmin', () => {
    it('lista el administrador con RUN formateado, correo, tipo y ubicación', () => {
        renderizar()
        const fila = filaDe('Admin Jacinta')
        expect(within(fila).getByText('19.011.022-2')).toBeInTheDocument()
        expect(within(fila).getByText('admin@duoc.cl')).toBeInTheDocument()
        expect(within(fila).getByText('Administrador')).toHaveClass('bg-primary')
        expect(within(fila).getByText('Valparaíso / Viña del Mar')).toBeInTheDocument()
    })

    it('los clientes se muestran con la insignia secundaria', () => {
        crearCliente()
        renderizar()
        expect(within(filaDe('Ana Gómez')).getByText('Cliente')).toHaveClass('bg-secondary')
    })

    it('tiene el enlace para crear un usuario nuevo', () => {
        renderizar()
        expect(screen.getByRole('link', { name: /Nuevo usuario/ })).toHaveAttribute('href', '/admin/usuarios/nuevo')
    })

    it('cada fila enlaza a la edición del usuario', () => {
        renderizar()
        expect(within(filaDe('Admin Jacinta')).getByRole('link', { name: /Editar/ })).toHaveAttribute('href', '/admin/usuarios/1/editar')
    })

    it('"Historial" aparece solo para clientes', () => {
        crearCliente()
        renderizar()
        expect(within(filaDe('Ana Gómez')).getByRole('link', { name: /Historial/ })).toHaveAttribute('href', '/admin/usuarios/2/historial')
        expect(within(filaDe('Admin Jacinta')).queryByRole('link', { name: /Historial/ })).not.toBeInTheDocument()
    })

    it('no deja eliminar la propia cuenta (botón deshabilitado con explicación)', () => {
        renderizar()
        const boton = within(filaDe('Admin Jacinta')).getByRole('button', { name: /Eliminar/ })
        expect(boton).toBeDisabled()
        expect(boton.closest('span')).toHaveAttribute('title', 'No puedes eliminar tu propia cuenta')
    })

    it('no elimina si se cancela la confirmación', async () => {
        crearCliente()
        vi.spyOn(window, 'confirm').mockReturnValue(false)
        renderizar()

        await userEvent.click(within(filaDe('Ana Gómez')).getByRole('button', { name: /Eliminar/ }))

        expect(screen.getByText('Ana Gómez')).toBeInTheDocument()
        expect(obtenerUsuarios()).toHaveLength(2)
    })

    it('muestra un mensaje cuando no hay usuarios', () => {
        localStorage.setItem('jacinta_usuarios', '[]')
        renderizar()
        expect(screen.getByText('No hay usuarios registrados.')).toBeInTheDocument()
    })
})