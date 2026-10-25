function Footer() {
    return (
        <footer className="footer py-4">
            <div className="container">
                <div className="row g-3 text-center">
                    <div className="col-12 col-md-6">
                        <div className="footer-bloque h-100">
                            <h5 className="mb-3">Vestuario Jacinta</h5>
                            <p className="mb-0">Tu clóset ideal para cada momento, desde 1956.</p>
                        </div>
                    </div>
                    
                    <div className="col-12 col-md-6">
                        <div className="py-3">
                            <h5 className="mb-3">Síguenos</h5>
                            <div className="footer-redes d-flex justify-content-center gap-3">
                                <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
                                    <i className="bi bi-instagram" />
                                </a>
                                <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook">
                                    <i className="bi bi-facebook" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <hr className="my-3" />
                <p className="text-center mb-0">&copy; {new Date().getFullYear()} Vestuario Jacinta. Todos los derechos reservados.</p>
            </div>
        </footer>
    )
}

export default Footer