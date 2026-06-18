import { useState } from 'react';
import { COLORS } from '../constants/colors';
import { authService } from '../services/api';
import '../styles/Auth.css';

export const Login = ({ onSwitchToSignUp, onLoginSuccess, onRecoverPassword, onCancel }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'El correo debe contener "@"';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del correo no es válido';
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener mínimo 8 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await authService.login(formData.email, formData.password);

      // Guardar token y usuario
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Mostrar mensaje de éxito
      alert(`¡Bienvenida ${response.user.nombre}!`);
      setFormData({ email: '', password: '' });

      if (typeof onLoginSuccess === 'function') {
        onLoginSuccess();
      }
    } catch (error) {
      setErrors({ submit: error.message || 'Error al iniciar sesión. Intenta de nuevo.' });
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
          <h2 style={{ color: COLORS.primary }}>Inicia Sesión</h2>
          <p className="text-muted">Accede a tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Campo Email */}
          <div className="form-group mb-3">
            <label htmlFor="loginEmail" className="form-label fw-bold">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="loginEmail"
              name="email"
              autoComplete="username"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@correo.com"
              disabled={loading}
            />
            {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
          </div>

          {/* Campo Contraseña con botón de visibilidad */}
          <div className="form-group mb-3">
            <label htmlFor="loginPassword" className="form-label fw-bold">
              Contraseña
            </label>
            <div className="password-input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                id="loginPassword"
                name="password"
                autoComplete="current-password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                value={formData.password}
                onChange={handleChange}
                placeholder="Tu contraseña"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                disabled={loading}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
          </div>

          {/* Error general */}
          {errors.submit && (
            <div className="alert alert-danger" role="alert">
              {errors.submit}
            </div>
          )}

          {/* Botón Iniciar Sesión */}
          <button
            type="submit"
            className="btn btn-lg w-100 text-white fw-bold rounded-pill mb-3"
            style={{ backgroundColor: COLORS.primary, border: 'none' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Cargando...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>

          {/* Link a Sign Up */}
          <div className="text-center">
            <p className="text-muted mb-0">
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                onClick={onSwitchToSignUp}
                className="btn btn-link text-decoration-none fw-bold"
                style={{ color: COLORS.primary }}
              >
                Crear cuenta
              </button>
            </p>
          </div>

          {/* Link a recuperar contraseña */}
          <div className="text-center mt-3">
            <button
              type="button"
              className="btn btn-link text-decoration-none text-muted"
              style={{ fontSize: '0.9rem' }}
              onClick={onRecoverPassword}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
