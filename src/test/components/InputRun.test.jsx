import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import InputRun from '../../components/InputRun'

describe('InputRun', () => {
    it('muestra el campo con su etiqueta RUN, placeholder y máximo de 12 caracteres', () => {
        render(<InputRun valor="" onChange={() => {}} />)
        const input = screen.getByLabelText('RUN')
        expect(input).toHaveAttribute('placeholder', 'Ej: 19.011.022-2 o 190110222')
        expect(input).toHaveAttribute('maxlength', '12')
        expect(input).toHaveAttribute('name', 'run')
    })

    it('muestra el valor recibido', () => {
        render(<InputRun valor="19.011.022-2" onChange={() => {}} />)
        expect(screen.getByLabelText('RUN')).toHaveValue('19.011.022-2')
    })

    it('envia el evento onChange al escribir', async () => {
        const onChange = vi.fn()
        render(<InputRun valor="" onChange={onChange} />)
        await userEvent.type(screen.getByLabelText('RUN'), '1')
        expect(onChange).toHaveBeenCalledTimes(1)
        expect(onChange.mock.calls[0][0].target.name).toBe('run')
    })

    it('muestra el mensaje de error cuando se entrega', () => {
        render(<InputRun valor="" error="El RUN es obligatorio" onChange={() => {}} />)
        expect(screen.getByText('El RUN es obligatorio')).toBeInTheDocument()
        expect(screen.getByLabelText('RUN')).toHaveClass('is-invalid')
    })

    it('puede deshabilitarse', () => {
        render(<InputRun valor="" onChange={() => {}} disabled />)
        expect(screen.getByLabelText('RUN')).toBeDisabled()
    })

    it('por defecto está habilitado', () => {
        render(<InputRun valor="" onChange={() => {}} />)
        expect(screen.getByLabelText('RUN')).toBeEnabled()
    })
})