import { useState } from 'react';
import { COLORS } from '../constants/colors';
import { authService } from '../services/api';
import '../styles/Auth.css';

export const ResetPassword = ({ token, onResetSuccess, onSwitchToLogin, onCancel }) => {
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener mínimo 8 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'La confirmación es requerida';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage('');
    setErrors({});

    try {
      await authService.resetPassword(token, formData.password, formData.confirmPassword);
      setMessage('Contraseña restablecida correctamente. Ya puedes iniciar sesión.');
      setFormData({ password: '', confirmPassword: '' });
      if (typeof onResetSuccess === 'function') {
        onResetSuccess();
      }
    } catch (err) {
      setErrors({ submit: err.message || 'Error al restablecer la contraseña.' });
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
          <h2 style={{ color: COLORS.primary }}>Restablecer contraseña</h2>
          <p className="text-muted">Ingresa tu nueva contraseña.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group mb-3">
            <label htmlFor="newPassword" className="form-label fw-bold">
              Nueva contraseña
            </label>
            <input
              type="password"
              id="newPassword"
              name="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              value={formData.password}
              onChange={handleChange}
              placeholder="Nueva contraseña"
              disabled={loading}
            />
            {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="confirmPassword" className="form-label fw-bold">
              Confirmar contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirmar contraseña"
              disabled={loading}
            />
            {errors.confirmPassword && (
              <div className="invalid-feedback d-block">{errors.confirmPassword}</div>
            )}
          </div>

          {errors.submit && (
            <div className="alert alert-danger" role="alert">
              {errors.submit}
            </div>
          )}

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
                Guardando...
              </>
            ) : (
              'Restablecer contraseña'
            )}
          </button>

          <div className="text-center">
            <p className="text-muted mb-0">
              ¿Ya tienes tu contraseña?{' '}
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
