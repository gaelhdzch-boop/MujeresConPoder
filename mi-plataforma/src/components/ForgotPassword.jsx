import { useState } from 'react';
import { COLORS } from '../constants/colors';
import { authService } from '../services/api';
import '../styles/Auth.css';

export const ForgotPassword = ({ onSwitchToLogin, onCancel }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await authService.forgotPassword(email);
      setMessage('Si el correo existe, recibirás un enlace para restablecer tu contraseña.');
      setPreviewUrl(response.preview || '');
      setEmail('');
    } catch (err) {
      setError(err.message || 'Error al enviar el enlace. Intenta nuevamente.');
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
          <p className="text-muted">Te enviaremos un enlace para restablecer tu contraseña.</p>
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
              disabled={loading}
            />
            {error && <div className="invalid-feedback d-block">{error}</div>}
          </div>

          {message && (
            <div className="alert alert-success" role="alert">
              {message}
            </div>
          )}

          {previewUrl && (
            <div className="alert alert-info" role="alert">
              <p className="mb-1"><strong>Enlace de prueba generado:</strong></p>
              <a href={previewUrl} target="_blank" rel="noreferrer">
                Abrir vista previa del correo
              </a>
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
              'Enviar enlace'
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
