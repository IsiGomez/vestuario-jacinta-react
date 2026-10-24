import { formatearPrecio } from '../utils/formato'

export const precio = (n) => formatearPrecio(n).replace(/\s/g, ' ')

export const tarjeta = (titulo) =>
    [...document.querySelectorAll('.card')].find(
        (c) => c.querySelector('.text-uppercase')?.textContent === titulo
    )