function Nosotros() {
    return (
        <div className="container py-5">
            <section className="mb-5">
                <div className="p-4 rounded-3 text-center" style={{ backgroundColor: 'var(--jc-durazno)' }}>
                    <h1 className="h2 mb-3" style={{ fontFamily: 'var(--jc-fuente-titulo)', color: 'var(--jc-azul)' }}>
                        Nuestra Historia
                    </h1>
                    <p className="mb-0" style={{ color: 'var(--jc-azul)', textAlign: 'justify', lineHeight: '1.7' }}>
                        En <strong>Vestuario Jacinta</strong>, nos hemos consolidado como un referente del vestuario casual y urbano en Chile. 
                        Con 70 años de trayectoria, acompañamos a nuestros clientes en cada etapa de su vida, ofreciendo prendas modernas, 
                        cómodas y pensadas para todas las edades y estilos. Desde hitos locales como vestir a la selección infantil de 
                        básquetbol de nuestra comuna en 1956, hemos mantenido un fuerte compromiso con nuestra gente y la comunidad.
                    </p>
                </div>
            </section>

            <section className="row g-4 mb-5">
                <div className="col-md-6">
                    <div className="card h-100 border-0 shadow-sm">
                        <div className="card-header text-center py-2" style={{ backgroundColor: 'var(--jc-durazno-claro)' }}>
                            <h3 className="h4 mb-0" style={{ color: 'var(--jc-azul)', fontFamily: 'var(--jc-fuente-titulo)' }}>Antes</h3>
                        </div>
                        <img 
                            src={`${import.meta.env.BASE_URL}assets/img/historia/antes.jpg`} 
                            className="card-img-top" 
                            alt="Vestuario Jacinta - Taller textil de antes" 
                            style={{ height: '350px', objectFit: 'cover' }}
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card h-100 border-0 shadow-sm">
                        <div className="card-header text-center py-2" style={{ backgroundColor: 'var(--jc-durazno-claro)' }}>
                            <h3 className="h4 mb-0" style={{ color: 'var(--jc-azul)', fontFamily: 'var(--jc-fuente-titulo)' }}>Después</h3>
                        </div>
                        <img 
                            src={`${import.meta.env.BASE_URL}assets/img/historia/despues.jpg`} 
                            className="card-img-top" 
                            alt="Vestuario Jacinta - Tienda actual" 
                            style={{ height: '350px', objectFit: 'cover' }}
                        />
                    </div>
                </div>
            </section>

            <section className="row g-4 mb-5">
                <div className="col-md-6">
                    <div className="h-100 p-4 rounded-3 text-center" style={{ backgroundColor: 'var(--jc-durazno-claro)', color: 'var(--jc-azul)' }}>
                        <i className="bi bi-bullseye fs-1 mb-3 d-block" style={{ color: 'var(--jc-azul)' }}></i>
                        <h3 className="h3 mb-3" style={{ fontFamily: 'var(--jc-fuente-titulo)', color: 'var(--jc-azul)' }}>Misión</h3>
                        <p className="mb-0" style={{ textAlign: 'justify', lineHeight: '1.7' }}>
                            Ofrecer prendas de vestir cómodas, modernas y de buena calidad para todas las edades y estilos, 
                            brindando una experiencia de compra cercana y agradable, mientras acompañamos a nuestros clientes 
                            en cada etapa de su vida.
                        </p>
                    </div>
                </div>
                
                <div className="col-md-6">
                    <div className="h-100 p-4 rounded-3 text-center" style={{ backgroundColor: 'var(--jc-durazno-claro)', color: 'var(--jc-azul)' }}>
                        <i className="bi bi-eye fs-1 mb-3 d-block" style={{ color: 'var(--jc-azul)' }}></i>
                        <h3 className="h3 mb-3" style={{ fontFamily: 'var(--jc-fuente-titulo)', color: 'var(--jc-azul)' }}>Visión</h3>
                        <p className="mb-0" style={{ textAlign: 'justify', lineHeight: '1.7' }}>
                            Convertirnos en la tienda online de ropa líder en Chile, reconocida por su variedad, calidad y 
                            cercanía con la comunidad, apoyando además el emprendimiento textil local.
                        </p>
                    </div>
                </div>
            </section>

            <section>
                <div className="p-4 rounded-3 text-center" style={{ backgroundColor: 'var(--jc-durazno)' }}>
                    <h3 className="h3 mb-3" style={{ fontFamily: 'var(--jc-fuente-titulo)', color: 'var(--jc-azul)' }}>
                        Compromiso con la Comunidad y los Emprendedores
                    </h3>
                    <p className="mb-0" style={{ color: 'var(--jc-azul)', textAlign: 'justify', lineHeight: '1.7' }}>
                        Nos apasiona apoyar el talento nacional. Cada compra realizada en nuestra tienda impulsa el trabajo 
                        de talleres textiles y emprendedores locales, promoviendo un comercio más justo y una moda sustentable.
                    </p>
                </div>
            </section>
        </div>
    )
}

export default Nosotros