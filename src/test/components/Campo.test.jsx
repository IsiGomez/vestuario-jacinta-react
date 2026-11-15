import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Campo from '../../components/Campo'
import { validarClave } from '../../utils/validacionUsuario'

it('asigna límites razonables y permite un límite específico para cada formulario', () => {
    render(<>
        <Campo etiqueta="Nombre" nombre="nombre" valor="" onChange={() => {}} />
        <Campo etiqueta="Correo" nombre="correo" valor="" onChange={() => {}} />
        <Campo etiqueta="Teléfono" nombre="telefono" valor="" onChange={() => {}} />
        <Campo etiqueta="Producto" nombre="producto" maxLength={80} valor="" onChange={() => {}} />
        <Campo etiqueta="Descripción" nombre="descripcion" as="textarea" valor="" onChange={() => {}} />
        <Campo etiqueta="Stock" nombre="stock" type="number" valor="0" onChange={() => {}} />
    </>)
    expect(screen.getByLabelText('Nombre')).toHaveAttribute('maxLength', '50')
    expect(screen.getByLabelText('Correo')).toHaveAttribute('maxLength', '100')
    expect(screen.getByLabelText('Teléfono')).toHaveAttribute('maxLength', '25')
    expect(screen.getByLabelText('Producto')).toHaveAttribute('maxLength', '80')
    expect(screen.getByLabelText('Descripción')).toHaveAttribute('maxLength', '500')
    expect(screen.getByLabelText('Stock')).not.toHaveAttribute('maxLength')
})

it('limita contraseñas a 24 caracteres y acepta caracteres no ASCII', async () => {
    function Formulario() {
        const [valor, setValor] = useState('')
        return <Campo etiqueta="Contraseña" nombre="contrasena" type="password" valor={valor}
            onChange={(e) => setValor(e.target.value)} />
    }
    render(<Formulario />)
    const input = screen.getByLabelText('Contraseña')
    await userEvent.type(input, '界'.repeat(25))
    expect(input).toHaveValue('界'.repeat(24))
    expect(validarClave('界'.repeat(24))).toBeNull()
    expect(validarClave('界'.repeat(25))).toBe('La contraseña debe tener entre 8 y 24 caracteres')
    expect(validarClave('a'.repeat(7))).toContain('8 y 24 caracteres')
})
