const API_URL = 'http://localhost:5000/api';

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
  register: (nombre, correo, contraseña, confirmarContraseña) =>
    apiCall('/auth/register', 'POST', {
      nombre,
      correo,
      contraseña,
      confirmarContraseña,
    }),

  login: (correo, contraseña) =>
    apiCall('/auth/login', 'POST', { correo, contraseña }),

  forgotPassword: (correo) =>
    apiCall('/auth/forgot-password', 'POST', { correo }),

  resetPassword: (token, contraseña, confirmarContraseña) =>
    apiCall('/auth/reset-password', 'POST', {
      token,
      contraseña,
      confirmarContraseña,
    }),

  getProfile: () => apiCall('/auth/profile', 'GET'),

  updateProfile: (nombre, fotoPerfil) =>
    apiCall('/auth/profile', 'PUT', { nombre, fotoPerfil }),

  changePassword: (contraseñaActual, contraseñaNueva, confirmarContraseña) =>
    apiCall('/auth/change-password', 'PUT', {
      contraseñaActual,
      contraseñaNueva,
      confirmarContraseña,
    }),

  listUsers: () => apiCall('/auth/users', 'GET'),

  updateUserRole: (usuarioId, rol) =>
    apiCall('/auth/users/role', 'PUT', { usuarioId, rol }),
};
