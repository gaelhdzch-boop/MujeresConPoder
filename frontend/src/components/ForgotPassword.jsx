import { useState } from 'react';
import { COLORS } from '../constants/colors';
import { authService } from '../services/api';
import '../styles/Auth.css';

export const ForgotPassword = ({ onSwitchToLogin, onCancel }) => {
  const [email, setEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('email');

  const validateEmail = () => {
    if (!email.trim()) {
      setError('El correo es requerido');
      return false;
    }
    if (!email.includes('@') || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('El formato del correo no es válido');
      return false;
    }
    setError('');
    return true;
  };

  const validateResetForm = () => {
    if (!securityAnswer.trim()) {
      setError('La respuesta de seguridad es requerida');
      return false;
    }
    if (!password) {
      setError('La contraseña es requerida');
      return false;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener mínimo 8 caracteres');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 'email') {
      if (!validateEmail()) return;

      setLoading(true);
      setMessage('');
      setError('');

      try {
        const response = await authService.forgotPassword(email);
        setSecurityQuestion(response.preguntaSeguridad || '');
        setStep('reset');
        setMessage('Responde tu pregunta de seguridad para continuar.');
      } catch (err) {
        setError(err.message || 'No se pudo verificar la información de recuperación.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!validateResetForm()) return;

    setLoading(true);
    setMessage('');
    setError('');

    try {
      await authService.forgotPassword(email, securityAnswer, password, confirmPassword);
      setMessage('Tu contraseña se restableció correctamente. Ya puedes iniciar sesión.');
      setEmail('');
      setSecurityQuestion('');
      setSecurityAnswer('');
      setPassword('');
      setConfirmPassword('');
      setStep('email');
    } catch (err) {
      setError(err.message || 'No se pudo restablecer la contraseña. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {onCancel && (
          <button
            type="button"
            className="auth-back-btn"
            onClick={onCancel}
            aria-label="Volver atrás"
          >
            ← Volver
          </button>
        )}
        <div className="auth-header">
          <h2 style={{ color: COLORS.primary }}>Recuperar contraseña</h2>
          <p className="text-muted">{step === 'email' ? 'Ingresa tu correo para verificar tu pregunta de seguridad.' : 'Responde tu pregunta de seguridad para crear una nueva contraseña.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group mb-3">
            <label htmlFor="recoverEmail" className="form-label fw-bold">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="recoverEmail"
              name="email"
              className={`form-control ${error ? 'is-invalid' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              disabled={loading || step === 'reset'}
            />
          </div>

          {step === 'reset' && (
            <>
              <div className="form-group mb-3">
                <label htmlFor="securityQuestion" className="form-label fw-bold">
                  Pregunta de seguridad
                </label>
                <div className="form-control-plaintext border rounded p-2" style={{ backgroundColor: '#f8f9fa' }}>
                  {securityQuestion}
                </div>
              </div>

              <div className="form-group mb-3">
                <label htmlFor="securityAnswer" className="form-label fw-bold">
                  Respuesta de seguridad
                </label>
                <input
                  type="text"
                  id="securityAnswer"
                  name="securityAnswer"
                  className={`form-control ${error ? 'is-invalid' : ''}`}
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  placeholder="Tu respuesta"
                  disabled={loading}
                />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="newPassword" className="form-label fw-bold">
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="password"
                  className={`form-control ${error ? 'is-invalid' : ''}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  disabled={loading}
                />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="confirmPassword" className="form-label fw-bold">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`form-control ${error ? 'is-invalid' : ''}`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirma tu nueva contraseña"
                  disabled={loading}
                />
              </div>
            </>
          )}

          {error && <div className="invalid-feedback d-block mb-3">{error}</div>}

          {message && (
            <div className="alert alert-success" role="alert">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-lg w-100 text-white fw-bold rounded-pill mb-3"
            style={{ backgroundColor: COLORS.primary, border: 'none' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Enviando...
              </>
            ) : (
              step === 'email' ? 'Continuar' : 'Restablecer contraseña'
            )}
          </button>

          <div className="text-center">
            <p className="text-muted mb-0">
              ¿Ya recuerdas tu contraseña?{' '}
              <button
                type="button"
                className="btn btn-link text-decoration-none fw-bold"
                style={{ color: COLORS.primary }}
                onClick={onSwitchToLogin}
              >
                Inicia sesión
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
