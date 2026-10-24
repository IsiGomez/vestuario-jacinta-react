import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegionComunaSelect from '../../components/RegionComunaSelect'
import { obtenerRegiones, obtenerComunas } from '../../data/regionComuna'

describe('RegionComunaSelect', () => {
    it('muestra la lista de todas las regiones más la opción vacía', () => {
        render(<RegionComunaSelect onChange={() => {}} />)
        const select = screen.getByLabelText('Región')
        expect(select.querySelectorAll('option')).toHaveLength(obtenerRegiones().length + 1)
        expect(screen.getByRole('option', { name: '-- Selecciona Región --' })).toBeInTheDocument()
    })

    it('si no hay región seleccionada, la comuna está deshabilitada y sin opciones', () => {
        render(<RegionComunaSelect onChange={() => {}} />)
        const comuna = screen.getByLabelText('Comuna')
        expect(comuna).toBeDisabled()
        expect(comuna.querySelectorAll('option')).toHaveLength(1)
    })

    it('con una región seleccionada se habilitan las comunas correspondientes', () => {
        render(<RegionComunaSelect region="Valparaíso" onChange={() => {}} />)
        const comuna = screen.getByLabelText('Comuna')
        expect(comuna).toBeEnabled()
        expect(comuna.querySelectorAll('option')).toHaveLength(obtenerComunas('Valparaíso').length + 1)
        expect(screen.getByRole('option', { name: 'Viña del Mar' })).toBeInTheDocument()
    })

    it('muestra la región y la comuna recibidas como valor', () => {
        render(<RegionComunaSelect region="Valparaíso" comuna="Viña del Mar" onChange={() => {}} />)
        expect(screen.getByLabelText('Región')).toHaveValue('Valparaíso')
        expect(screen.getByLabelText('Comuna')).toHaveValue('Viña del Mar')
    })

    it('al cambiar la región avisa con la región nueva y la comuna reiniciada', async () => {
        const onChange = vi.fn()
        render(<RegionComunaSelect region="Valparaíso" comuna="Viña del Mar" onChange={onChange} />)
        await userEvent.selectOptions(screen.getByLabelText('Región'), 'Tarapacá')
        expect(onChange).toHaveBeenCalledWith({ region: 'Tarapacá', comuna: '' })
    })

    it('al cambiar la comuna se mantiene la región actual', async () => {
        const onChange = vi.fn()
        render(<RegionComunaSelect region="Valparaíso" onChange={onChange} />)
        await userEvent.selectOptions(screen.getByLabelText('Comuna'), 'Quilpué')
        expect(onChange).toHaveBeenCalledWith({ region: 'Valparaíso', comuna: 'Quilpué' })
    })

    it('disabled deshabilita ambos selects', () => {
        render(<RegionComunaSelect region="Valparaíso" onChange={() => {}} disabled />)
        expect(screen.getByLabelText('Región')).toBeDisabled()
        expect(screen.getByLabelText('Comuna')).toBeDisabled()
    })
})