import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <a className="navbar-brand fw-bold" href="/">Logo</a>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item"><a className="nav-link" href="#cursos">Cursos</a></li>
            <li className="nav-item"><a className="nav-link" href="#marketplace">Marketplace</a></li>
            <li className="nav-item"><a className="nav-link" href="#oportunidades">Oportunidades</a></li>
            <li className="nav-item"><a className="nav-link" href="#finanzas">Finanzas</a></li>
          </ul>
          
          <div className="d-flex">
            <button className="btn btn-link text-dark text-decoration-none me-2">Entrar</button>
            <button className="btn btn-primary rounded-pill" style={{ backgroundColor: '#F472B6', border: 'none' }}>
              Crear cuenta
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const HeroSection = () => {
  return (
    <section className="text-center p-5 position-relative" style={{ backgroundColor: '#FDF2F8' }}>

      <div className="container py-5">
        <h1 className="display-4 fw-bold">
          <span style={{ color: '#F472B6' }}>Crece a tu propio ritmo</span>
        </h1>
        <h2 className="h4 fw-normal mb-4" style={{ color: '#831843' }}>con tu propia red</h2>
        
        <p className="lead mx-auto mb-4 fw-bold" style={{ maxWidth: '600px', color: '#BE185D' }}>
          Tu talento, nuestras herramientas. Encuentra la formación, el mercado y el respaldo financiero que necesitas para llevar tu negocio al siguiente nivel. Un ecosistema creado por y para mujeres que no se detienen.
        </p>
        
        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-lg rounded-pill px-4 text-white" style={{ backgroundColor: '#F472B6', border: 'none' }}>
            Comenzar
          </button>
          <button className="btn btn-light btn-lg rounded-pill px-4" style={{ color: '#F472B6' }}>
            Conoce más
          </button>
        </div>
      </div>
    </section>
  );
};

const FeaturesGrid = () => {
  return (
    <section className="container py-5 text-center">
      <h3 className="fw-bold mb-4">Todo lo que necesitas, <br/> <span style={{ color: '#F472B6' }}>JUNTO</span></h3>
      
      <div className="row g-4 mt-2">

        <div className="col-md-6">
          <div className="card h-100 p-4 border-0 shadow-sm rounded-4" style={{ backgroundColor: '#FBCFE8' }}>
            <div className="card-body text-start">
              <h4 className="card-title fw-bold">Cursos</h4>
              <p className="card-text">Capacítate cuando quieras</p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100 p-4 border-0 shadow-sm rounded-4" style={{ backgroundColor: '#FEF08A' }}>
            <div className="card-body text-start">
              <h4 className="card-title fw-bold">Finanzas</h4>
              <p className="card-text">Lleva tus números fácil</p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100 p-4 border-0 shadow-sm rounded-4" style={{ backgroundColor: '#E9D5FF' }}>
            <div className="card-body text-start">
              <h4 className="card-title fw-bold">Marketplace</h4>
              <p className="card-text">Vende lo que haces</p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100 p-4 border-0 shadow-sm rounded-4" style={{ backgroundColor: '#A7F3D0' }}>
            <div className="card-body text-start">
              <h4 className="card-title fw-bold">Comunidad</h4>
              <p className="card-text">Conoce otras mujeres</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const OpportunitiesBanner = () => {
  return (
    <section className="container py-5 mb-5">
      <div className="p-5 rounded-4 text-center shadow-sm" style={{ backgroundColor: '#bbf7d0' }}>
        <h3 className="fw-bold mb-3">Oportunidades para ti</h3>
        <p className="mx-auto mb-4" style={{ maxWidth: '700px' }}>
          Descubre empleos, becas, convocatorias de programas de gobierno, financiamiento y mentorías todo específicamente para mujeres emprendedoras
        </p>
        <button className="btn bg-white rounded-pill px-4 py-2 fw-bold" style={{ color: '#000', border: 'none' }}>
          Explorar oportunidades &rarr;
        </button>
      </div>
    </section>
  );
};

const App = () => {
  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesGrid />
        <OpportunitiesBanner />
      </main>
    </div>
  );
};

export default App;