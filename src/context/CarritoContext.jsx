import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { leer, guardar } from '../utils/storage'
import { useAuth } from '../hooks/useAuth'

const CarritoContext = createContext(null)

function obtenerClaveCarrito(usuario) {
    if (usuario?.id) {
        return `jacinta_carrito_${usuario.id}`
    }
    return 'jacinta_carrito_guest'
}

function obtenerCarritoPorClave(clave) {
    const guardado = leer(clave, [])
    return Array.isArray(guardado) ? guardado : []
}

export function CarritoProvider({ children }) {
    const { usuario } = useAuth()
    const claveCarrito = obtenerClaveCarrito(usuario)
    const claveAnteriorRef = useRef(claveCarrito)

    const [carrito, setCarrito] = useState(() => obtenerCarritoPorClave(claveCarrito))

    useEffect(() => {
        if (claveAnteriorRef.current !== claveCarrito) {
            claveAnteriorRef.current = claveCarrito
            setCarrito(obtenerCarritoPorClave(claveCarrito))
            return
        }
        guardar(claveCarrito, carrito)
    }, [carrito, claveCarrito])

    const agregarProducto = (producto, cantidad = 1, talla = null, color = null) => {
        if (!producto) return
        const cantidadNum = Number(cantidad) || 1
        if (cantidadNum <= 0) return

        setCarrito((anterior) => {
            const indice = anterior.findIndex(
                (item) =>
                    item.id === producto.id &&
                    item.talla === talla &&
                    item.color?.clave === color?.clave
            )

            if (indice >= 0) {
                const copia = [...anterior]
                copia[indice] = {
                    ...copia[indice],
                    cantidad: copia[indice].cantidad + cantidadNum,
                }
                return copia
            }

            const colorActual = color || producto.colores?.[0] || null
            const imagen = colorActual?.imagenes?.[0] || producto.imagen || null

            return [
                ...anterior,
                {
                    id: producto.id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    imagen,
                    talla,
                    color: colorActual ? { nombre: colorActual.nombre, clave: colorActual.clave } : null,
                    cantidad: cantidadNum,
                },
            ]
        })
    }

    const quitarCantidad = (indice, cantidadAQuitar = 1) => {
        const cantidadNum = Number(cantidadAQuitar) || 1
        if (cantidadNum <= 0) return

        setCarrito((anterior) => {
            const copia = [...anterior]
            if (!copia[indice]) return anterior
            if (cantidadNum >= copia[indice].cantidad) {
                copia.splice(indice, 1)
                return copia
            }
            copia[indice] = {
                ...copia[indice],
                cantidad: copia[indice].cantidad - cantidadNum,
            }
            return copia
        })
    }

    const eliminarProducto = (indice) => {
        setCarrito((anterior) => {
            const copia = [...anterior]
            copia.splice(indice, 1)
            return copia
        })
    }

    const actualizarCantidad = (indice, cantidad) => {
        const cantidadNum = Number(cantidad) || 0
        if (cantidadNum <= 0) {
            eliminarProducto(indice)
            return
        }
        setCarrito((anterior) => {
            const copia = [...anterior]
            if (!copia[indice]) return anterior
            copia[indice] = { ...copia[indice], cantidad: cantidadNum }
            return copia
        })
    }

    const vaciarCarrito = () => {
        setCarrito([])
    }

    const obtenerTotal = () => {
        return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0)
    }

    const obtenerCantidadTotal = () => {
        return carrito.reduce((total, item) => total + item.cantidad, 0)
    }

    const valor = {
        carrito,
        agregarProducto,
        quitarCantidad,
        eliminarProducto,
        actualizarCantidad,
        vaciarCarrito,
        obtenerTotal,
        obtenerCantidadTotal,
    }

    return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>
}

export function useCarrito() {
    const contexto = useContext(CarritoContext)
    if (!contexto) {
        throw new Error('useCarrito debe usarse dentro de un CarritoProvider')
    }
    return contexto
}

export default CarritoContext
