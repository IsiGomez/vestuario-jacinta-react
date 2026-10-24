import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MiniaturaImagen from '../../components/MiniaturaImagen'

describe('MiniaturaImagen', () => {
    it('muestra la imagen con su src y alt', () => {
        render(<MiniaturaImagen src="/foto.jpg" alt="Camisa azul" />)
        const img = screen.getByRole('img', { name: 'Camisa azul' })
        expect(img).toHaveAttribute('src', '/foto.jpg')
    })

    it('muestra "Sin foto" si no hay src', () => {
        render(<MiniaturaImagen alt="Camisa" />)
        expect(screen.getByText('Sin foto')).toBeInTheDocument()
        expect(screen.queryByRole('img')).not.toBeInTheDocument()
    })

    it('muestra "Sin foto" si el src es una cadena vacía', () => {
        render(<MiniaturaImagen src="" alt="Camisa" />)
        expect(screen.getByText('Sin foto')).toBeInTheDocument()
    })

    it('cambia a "Sin foto" cuando la imagen falla al cargar', () => {
        render(<MiniaturaImagen src="/rota.jpg" alt="Camisa" />)
        fireEvent.error(screen.getByRole('img'))
        expect(screen.getByText('Sin foto')).toBeInTheDocument()
        expect(screen.queryByRole('img')).not.toBeInTheDocument()
    })
})