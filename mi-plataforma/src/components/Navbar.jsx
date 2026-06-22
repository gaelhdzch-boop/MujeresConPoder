import { COLORS } from '../constants/colors';

export const Navbar = ({ onCreateAccountClick, onLoginClick, onLogoClick, onProfileClick, isAuthenticated }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
          <button className="navbar-brand fw-bold btn btn-link p-0" type="button" onClick={onLogoClick}>
            Logo
          </button>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item"><a className="nav-link" href="#cursos">Cursos</a></li>
            <li className="nav-item"><a className="nav-link" href="#marketplace">Marketplace</a></li>
            <li className="nav-item"><a className="nav-link" href="#comunidad">Comunidad</a></li>
            <li className="nav-item"><a className="nav-link" href="#oportunidades">Oportunidades</a></li>
            <li className="nav-item"><a className="nav-link" href="#finanzas">Finanzas</a></li>
          </ul>
          
          <div className="d-flex gap-2">
            {isAuthenticated ? (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={onProfileClick}
              >
                Perfil
              </button>
            ) : (
              <>
                <button 
                  className="btn btn-link text-dark text-decoration-none"
                  onClick={onLoginClick}
                >
                  Entrar
                </button>
                <button 
                  className="btn rounded-pill text-white"
                  style={{ backgroundColor: COLORS.primary, border: 'none' }}
                  onClick={onCreateAccountClick}
                >
                  Crear cuenta
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
