import { useState } from 'react';
import { COLORS } from '../constants/colors';
import { authService } from '../services/api';
import '../styles/Auth.css';

export const SignUp = ({ onSwitchToLogin, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    securityQuestion: '',
    securityAnswer: '',
  });

  const securityQuestions = [
    '¿Cuál es el nombre de tu primera mascota?',
    '¿En qué ciudad nació tu madre?',
    '¿Cuál fue tu colegio de primaria?',
    '¿Cuál es tu color favorito?',
    '¿Cuál fue el primer apellido de tu mejor amiga?',
  ];

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

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

    // Validar confirmación de contraseña
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Validar pregunta de seguridad
    if (!formData.securityQuestion.trim()) {
      newErrors.securityQuestion = 'La pregunta de seguridad es requerida';
    }

    if (!formData.securityAnswer.trim()) {
      newErrors.securityAnswer = 'La respuesta de seguridad es requerida';
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
      const name = formData.name.trim();
      const email = formData.email.trim();
      const pass = typeof formData.password === 'string'
        ? formData.password.normalize('NFC').trim()
        : formData.password;
      const confirm = typeof formData.confirmPassword === 'string'
        ? formData.confirmPassword.normalize('NFC').trim()
        : formData.confirmPassword;
      const response = await authService.register(
        name,
        email,
        pass,
        confirm,
        formData.securityQuestion.trim(),
        formData.securityAnswer.trim()
      );

      // Guardar token
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      setSuccess(true);
      setFormData({ name: '', email: '', password: '', confirmPassword: '', securityQuestion: '', securityAnswer: '' });
      
      // Redirigir a login después de 2 segundos
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } catch (error) {
      setErrors({ submit: error.message || 'Error al crear la cuenta. Intenta de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="success-message text-center">
            <div className="success-icon">✓</div>
            <h3 style={{ color: COLORS.primary }}>¡Cuenta creada exitosamente!</h3>
            <p>Redirigiendo a inicio de sesión...</p>
          </div>
        </div>
      </div>
    );
  }

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
          <h2 style={{ color: COLORS.primary }}>Crear Cuenta</h2>
          <p className="text-muted">Únete a nuestra comunidad de mujeres emprendedoras</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Campo Nombre */}
          <div className="form-group mb-3">
            <label htmlFor="name" className="form-label fw-bold">
              Nombre Completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              value={formData.name}
              onChange={handleChange}
              placeholder="Tu nombre completo"
              disabled={loading}
            />
            {errors.name && <div className="invalid-feedback d-block">{errors.name}</div>}
          </div>

          {/* Campo Email */}
          <div className="form-group mb-3">
            <label htmlFor="email" className="form-label fw-bold">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@correo.com"
              disabled={loading}
            />
            {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
          </div>

          {/* Campo Contraseña */}
          <div className="form-group mb-3">
            <label htmlFor="password" className="form-label fw-bold">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 8 caracteres"
              disabled={loading}
            />
            {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
            <small className="text-muted d-block mt-1">
              Usa letras, números y símbolos para mayor seguridad
            </small>
          </div>

          {/* Campo Confirmar Contraseña */}
          <div className="form-group mb-3">
            <label htmlFor="confirmPassword" className="form-label fw-bold">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirma tu contraseña"
              disabled={loading}
            />
            {errors.confirmPassword && (
              <div className="invalid-feedback d-block">{errors.confirmPassword}</div>
            )}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="securityQuestion" className="form-label fw-bold">
              Pregunta de seguridad
            </label>
            <select
              id="securityQuestion"
              name="securityQuestion"
              className={`form-select ${errors.securityQuestion ? 'is-invalid' : ''}`}
              value={formData.securityQuestion}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Selecciona una pregunta</option>
              {securityQuestions.map((question) => (
                <option key={question} value={question}>
                  {question}
                </option>
              ))}
            </select>
            {errors.securityQuestion && <div className="invalid-feedback d-block">{errors.securityQuestion}</div>}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="securityAnswer" className="form-label fw-bold">
              Respuesta de seguridad
            </label>
            <input
              type="text"
              id="securityAnswer"
              name="securityAnswer"
              className={`form-control ${errors.securityAnswer ? 'is-invalid' : ''}`}
              value={formData.securityAnswer}
              onChange={handleChange}
              placeholder="Tu respuesta"
              disabled={loading}
            />
            {errors.securityAnswer && <div className="invalid-feedback d-block">{errors.securityAnswer}</div>}
          </div>

          {/* Error general */}
          {errors.submit && (
            <div className="alert alert-danger" role="alert">
              {errors.submit}
            </div>
          )}

          {/* Botón Crear Cuenta */}
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
              'Crear Cuenta'
            )}
          </button>

          {/* Link a Login */}
          <div className="text-center">
            <p className="text-muted mb-0">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="btn btn-link text-decoration-none fw-bold"
                style={{ color: COLORS.primary }}
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
