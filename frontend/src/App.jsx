import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturesGrid } from './components/FeaturesGrid';
import Finanzas from './components/Finanzas';
import Marketplace from './components/Marketplace';
import Cursos from './components/Cursos';
import Comunidad from './components/Comunidad';
import Oportunidades from './components/Oportunidades';
import { AuthPage } from './components/AuthPage';
import { Profile } from './components/Profile';
import SessionClosed from './components/SessionClosed';
import './App.css';

function App() {
  const [resetToken] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('reset_token');
  });
  const [authView, setAuthView] = useState(() => (resetToken ? 'reset' : 'login'));
  const [currentPage, setCurrentPage] = useState(() => {
    if (resetToken) return 'auth';
    if (localStorage.getItem('token')) return 'profile';
    return 'home';
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const navigateToAuth = (view = 'signup') => {
    if (isAuthenticated) {
      setCurrentPage('profile');
      return;
    }

    setAuthView(view);
    setCurrentPage('auth');
  };
  const navigateToLogin = () => navigateToAuth('login');
  const navigateToSignup = () => navigateToAuth('signup');
  const navigateToProfile = () => setCurrentPage('profile');
  const navigateHome = () => setCurrentPage('home');
  const handleLogoClick = () => {
    setCurrentPage('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setCurrentPage('closed');
  };

  const navigateToCursos = () => setCurrentPage('cursos');
  const navigateToMarketplace = () => setCurrentPage('marketplace');
  const navigateToComunidad = () => setCurrentPage('comunidad');
  const navigateToOportunidades = () => setCurrentPage('oportunidades');
  const navigateToFinanzas = () => setCurrentPage('finanzas');

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage('profile');
  };

  if (currentPage === 'auth') {
    return (
      <div>
        <Navbar onLogoClick={handleLogoClick} />
        <AuthPage
          key={`${authView}-${resetToken || ''}`}
          initialView={authView}
          resetToken={resetToken}
          onLoginSuccess={handleLoginSuccess}
          onResetSuccess={() => {
            setAuthView('login');
            window.history.replaceState({}, '', window.location.pathname);
          }}
          onCancel={navigateHome}
        />
      </div>
    );
  }

  if (currentPage === 'profile') {
    return (
      <div>
        <Navbar onLogoClick={handleLogoClick} />
        <Profile onLogout={handleLogout} />
      </div>
    );
  }

  if (currentPage === 'closed') {
    return (
      <div>
        <Navbar onLogoClick={handleLogoClick} />
        <SessionClosed onReturnHome={navigateHome} />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <Navbar onLogoClick={handleLogoClick} />

      <main>
        {currentPage === 'home' && (
          <>
            <HeroSection onCreateAccountClick={navigateToSignup} onLoginClick={navigateToLogin} />
            <FeaturesGrid />
          </>
        )}

        {currentPage === 'cursos' && <Cursos />}
        {currentPage === 'marketplace' && <Marketplace />}
        {currentPage === 'comunidad' && <Comunidad />}
        {currentPage === 'oportunidades' && <Oportunidades isAuthenticated={isAuthenticated} />}
        {currentPage === 'finanzas' && <Finanzas />}
      </main>
    </div>
  );
}

export default App;