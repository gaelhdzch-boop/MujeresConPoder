const API_URL = (
  (import.meta.env?.VITE_API_URL || (import.meta.env?.PROD ? '/api' : 'http://localhost:5000/api')) || 'http://localhost:5000/api'
).replace(/\/$/, '');

export const apiCall = async (endpoint, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem('token') && {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en la solicitud');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Autenticación
export const authService = {
  register: (nombre, correo, contraseña, confirmarContraseña, preguntaSeguridad, respuestaSeguridad) =>
    apiCall('/auth/register', 'POST', {
      nombre,
      correo,
      contraseña,
      confirmarContraseña,
      preguntaSeguridad,
      respuestaSeguridad,
    }),

  login: (correo, contraseña) =>
    apiCall('/auth/login', 'POST', { correo, contraseña }),

  forgotPassword: (correo, respuestaSeguridad, contraseña, confirmarContraseña) =>
    apiCall('/auth/forgot-password', 'POST', {
      correo,
      respuestaSeguridad,
      contraseña,
      confirmarContraseña,
    }),

  resetPassword: (token, contraseña, confirmarContraseña) =>
    apiCall('/auth/reset-password', 'POST', {
      token,
      contraseña,
      confirmarContraseña,
    }),

  getProfile: () => apiCall('/auth/profile', 'GET'),

  updateProfile: (nombre, fotoPerfil, preguntaSeguridad, respuestaSeguridad) => {
    const body = { nombre };
    if (fotoPerfil !== undefined) body.fotoPerfil = fotoPerfil;
    if (preguntaSeguridad !== undefined) body.preguntaSeguridad = preguntaSeguridad;
    if (respuestaSeguridad !== undefined) body.respuestaSeguridad = respuestaSeguridad;
    return apiCall('/auth/profile', 'PUT', body);
  },

  changePassword: (contraseñaActual, contraseñaNueva, confirmarContraseña) =>
    apiCall('/auth/change-password', 'PUT', {
      contraseñaActual,
      contraseñaNueva,
      confirmarContraseña,
    }),

  listUsers: () => apiCall('/auth/users', 'GET'),

  updateUserRole: (usuarioId, rol) =>
    apiCall('/auth/users/role', 'PUT', { usuarioId, rol }),

  getUserCourses: () => apiCall('/auth/courses', 'GET'),

  registerCourse: (courseId, progreso = 10) =>
    apiCall('/auth/courses/register', 'POST', { courseId, progreso }),

  updateCourseProgress: (courseId, progreso) =>
    apiCall('/auth/courses/progress', 'PUT', { courseId, progreso }),
};
