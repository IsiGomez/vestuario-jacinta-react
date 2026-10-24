import { Link, NavLink, Outlet } from 'react-router-dom'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { useAuth } from '../hooks/useAuth'


function TiendaLayout() {
    const { usuario, esAdmin, cerrarSesion } = useAuth()

    return (
        <>
            <Navbar expand="xl" className="bg-body-tertiary text-nowrap">
                <Container>
                    <Navbar.Brand as={Link} to="/" className="d-flex align-items-center py-0">
                        <img
                            src={`${import.meta.env.BASE_URL}assets/img/logo.svg`}
                            alt="Jacinta Logo"
                            className="navbar-logo"
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="menu-tienda" />
                    <Navbar.Collapse id="menu-tienda">
                        <Nav className="me-auto">
                            <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
                            <Nav.Link as={NavLink} to="/productos">Productos</Nav.Link>
                            <Nav.Link as={NavLink} to="/categorias">Categorías</Nav.Link>
                            <Nav.Link as={NavLink} to="/ofertas">Ofertas</Nav.Link>
                            <Nav.Link as={NavLink} to="/nosotros">Nosotros</Nav.Link>
                            <Nav.Link as={NavLink} to="/blog">Blog</Nav.Link>
                            <Nav.Link as={NavLink} to="/contacto">Contacto</Nav.Link>
                        </Nav>
                        <Nav>
                            <Nav.Link as={NavLink} to="/carrito">
                                <i className="bi bi-cart3" /> Carrito
                            </Nav.Link>
                            {usuario ? (
                                <>
                                    {esAdmin && <Nav.Link as={NavLink} to="/admin">Panel admin</Nav.Link>}
                                    <Navbar.Text className="mx-2">Hola, {usuario.nombre}</Navbar.Text>
                                    <Nav.Link as="button" onClick={cerrarSesion}>Cerrar sesión</Nav.Link>
                                </>
                            ) : (
                                <>
                                    <Nav.Link as={NavLink} to="/login">Iniciar sesión</Nav.Link>
                                    <Nav.Link as={NavLink} to="/registro">Crear cuenta</Nav.Link>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container>
                <Outlet />
            </Container>
        </>
    )

}

export default TiendaLayout