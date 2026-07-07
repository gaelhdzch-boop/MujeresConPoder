import { useState, useEffect } from 'react';
import { SignUp } from './SignUp';
import { Login } from './Login';
import { ForgotPassword } from './ForgotPassword';
import { ResetPassword } from './ResetPassword';

export const AuthPage = ({ initialView = 'login', resetToken = null, onLoginSuccess, onResetSuccess, onCancel }) => {
  const [currentView, setCurrentView] = useState(initialView); // 'login', 'signup', 'forgot' o 'reset'

  useEffect(() => {
    if (resetToken) {
      setCurrentView('reset');
    } else {
      setCurrentView(initialView);
    }
  }, [initialView, resetToken]);

  return (
    <div className="auth-page">
      {currentView === 'signup' ? (
        <SignUp onSwitchToLogin={() => setCurrentView('login')} onCancel={onCancel} />
      ) : currentView === 'forgot' ? (
        <ForgotPassword onSwitchToLogin={() => setCurrentView('login')} onCancel={onCancel} />
      ) : currentView === 'reset' ? (
        <ResetPassword token={resetToken} onResetSuccess={onResetSuccess} onSwitchToLogin={() => setCurrentView('login')} onCancel={onCancel} />
      ) : (
        <Login
          onSwitchToSignUp={() => setCurrentView('signup')}
          onRecoverPassword={() => setCurrentView('forgot')}
          onLoginSuccess={onLoginSuccess}
          onCancel={onCancel}
        />
      )}
    </div>
  );
};
