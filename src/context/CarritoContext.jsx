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

const stockDe = (lista, id) => lista.find((item) => item.id === id)?.stock ?? Infinity
const unidadesDe = (lista, id) => lista.reduce((suma, item) => (item.id === id ? suma + item.cantidad : suma), 0)

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

        setCarrito((previo) => {
            const stock = producto.stock ?? Infinity
            const anterior = previo.map((item) => (item.id === producto.id ? { ...item, stock } : item))
            const disponible = stock - unidadesDe(anterior, producto.id)
            const cantidadFinal = Math.min(cantidadNum, disponible)
            if (cantidadFinal <= 0) return anterior

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
                    cantidad: copia[indice].cantidad + cantidadFinal,
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
                    stock: producto.stock ?? null,
                    cantidad: cantidadFinal,
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
            const item = copia[indice]
            if (!item) return anterior

            const maximo = (item.stock ?? Infinity) - (unidadesDe(anterior, item.id) - item.cantidad)
            const nueva = Math.min(cantidadNum, maximo)
            if (nueva <= 0) return anterior

            copia[indice] = { ...item, cantidad: nueva }
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

    const disponibleParaAgregar = (id, stock = stockDe(carrito, id)) => Math.max(stock - unidadesDe(carrito, id), 0)

    const unidadesEnCarrito = (id) => unidadesDe(carrito, id)

    const valor = {
        carrito,
        disponibleParaAgregar,
        unidadesEnCarrito,
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
