import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturesGrid } from './components/FeaturesGrid';
import MarketplaceCursos from './components/MarketplaceCursos';
import Finanzas from './components/Finanzas';
import Comunidad from './components/Comunidad';
import { OpportunitiesBanner } from './components/OpportunitiesBanner';
import { AuthPage } from './components/AuthPage';
import { Profile } from './components/Profile';
import SessionClosed from './components/SessionClosed';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'auth' o 'profile'
  const [authView, setAuthView] = useState('login'); // 'login', 'signup', 'forgot' o 'reset'
  const [resetToken, setResetToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('reset_token');
    if (token) {
      setAuthView('reset');
      setResetToken(token);
      setCurrentPage('auth');
      return;
    }

    if (isAuthenticated) {
      setCurrentPage('profile');
    }
  }, [isAuthenticated]);

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

  const navigateToClosed = () => setCurrentPage('closed');

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage('profile');
  };

  if (currentPage === 'auth') {
    return (
      <AuthPage
        initialView={authView}
        resetToken={resetToken}
        onLoginSuccess={handleLoginSuccess}
        onResetSuccess={() => {
          setAuthView('login');
          setResetToken(null);
          window.history.replaceState({}, '', window.location.pathname);
        }}
        onCancel={navigateHome}
      />
    );
  }

  if (currentPage === 'profile') {
    return (
      <div>
        <Navbar onCreateAccountClick={navigateToSignup} onLoginClick={navigateToLogin} onLogoClick={handleLogoClick} onProfileClick={navigateToProfile} isAuthenticated={isAuthenticated} />
        <Profile onLogout={handleLogout} />
      </div>
    );
  }

  if (currentPage === 'closed') {
    return (
      <div>
        <Navbar onCreateAccountClick={navigateToSignup} onLoginClick={navigateToLogin} onLogoClick={handleLogoClick} onProfileClick={navigateToProfile} isAuthenticated={isAuthenticated} />
        <SessionClosed onReturnHome={navigateHome} />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <Navbar onCreateAccountClick={navigateToSignup} onLoginClick={navigateToLogin} onLogoClick={handleLogoClick} onProfileClick={navigateToProfile} isAuthenticated={isAuthenticated} />
      <main>
        <HeroSection onCreateAccountClick={navigateToSignup} />
        <FeaturesGrid />
        <MarketplaceCursos />
        <Finanzas />
        <Comunidad />
        <OpportunitiesBanner />
      </main>
    </div>
  );
}

export default App;