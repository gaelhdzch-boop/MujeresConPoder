import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserByEmail, createUser, getUserById, getUserWithPasswordById, updateUserPassword, updateUserProfile, updateUserSecurityQuestion, getAllUsers, updateUserRole, createPasswordResetToken, getPasswordResetByToken, markPasswordResetTokenUsed, getUserCourseProgress, registerUserCourse, updateUserCourseProgress } from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET;

// RF-1.1: Registro
export const register = async (req, res) => {
  try {
    const { nombre, preguntaSeguridad, respuestaSeguridad } = req.body;
    let { correo, contraseña, confirmarContraseña } = req.body;
    if (typeof correo === 'string') correo = correo.trim();
    if (typeof contraseña === 'string') contraseña = contraseña.normalize('NFC').trim();
    if (typeof confirmarContraseña === 'string') confirmarContraseña = confirmarContraseña.normalize('NFC').trim();
    const preguntaSegura = typeof preguntaSeguridad === 'string' ? preguntaSeguridad.trim() : '';
    const respuestaSegura = typeof respuestaSeguridad === 'string' ? respuestaSeguridad.trim() : '';

    // Validaciones
    if (!nombre || !correo || !contraseña || !confirmarContraseña || !preguntaSegura || !respuestaSegura) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    if (contraseña.length < 8) {
      return res.status(400).json({ message: 'La contraseña debe tener mínimo 8 caracteres' });
    }

    if (contraseña !== confirmarContraseña) {
      return res.status(400).json({ message: 'Las contraseñas no coinciden' });
    }

    if (!correo.includes('@')) {
      return res.status(400).json({ message: 'El correo debe contener "@"' });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await getUserByEmail(correo);
    if (usuarioExistente) {
      return res.status(409).json({ message: 'El correo ya está registrado' });
    }

    // Encriptar contraseña con bcrypt (RNF-1)
    const salt = await bcrypt.genSalt(10);
    const contraseñaHasheada = await bcrypt.hash(contraseña, salt);

    const respuestaSeguridadHasheada = await bcrypt.hash(respuestaSegura, salt);

    // Crear usuario
    const usuarioId = await createUser(nombre, correo, contraseñaHasheada, preguntaSegura, respuestaSeguridadHasheada);

    // Generar JWT (RNF-2)
    const token = jwt.sign(
      { id: usuarioId, correo, nombre, rol: 'usuario' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Cuenta creada exitosamente',
      user: {
        id: usuarioId,
        nombre,
        correo,
        rol: 'usuario',
      },
      token,
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error al crear la cuenta' });
  }
};

// RF-1.2: Inicio de Sesión
export const login = async (req, res) => {
  try {
    let { correo, contraseña } = req.body;
    if (typeof correo === 'string') correo = correo.trim();
    if (typeof contraseña === 'string') contraseña = contraseña.normalize('NFC').trim();

    // Validaciones
    if (!correo || !contraseña) {
      return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
    }

    if (!correo.includes('@')) {
      return res.status(400).json({ message: 'El correo debe contener "@"' });
    }

    if (contraseña.length < 8) {
      return res.status(400).json({ message: 'La contraseña debe tener mínimo 8 caracteres' });
    }

    // Buscar usuario
    const usuario = await getUserByEmail(correo);
    if (!usuario) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    // Verificar contraseña
    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contraseñaValida) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    // Generar JWT (RNF-2)
    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo, nombre: usuario.nombre, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Sesión iniciada exitosamente',
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
      token,
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

// RF-1.3: Recuperación de Contraseña
export const forgotPassword = async (req, res) => {
  try {
    let { correo, respuestaSeguridad, contraseña, confirmarContraseña } = req.body;
    if (typeof correo === 'string') correo = correo.trim();
    if (typeof respuestaSeguridad === 'string') respuestaSeguridad = respuestaSeguridad.trim().normalize('NFC');
    if (typeof contraseña === 'string') contraseña = contraseña.normalize('NFC');
    if (typeof confirmarContraseña === 'string') confirmarContraseña = confirmarContraseña.normalize('NFC');

    if (!correo) {
      return res.status(400).json({ message: 'El correo es requerido' });
    }

    const usuario = await getUserByEmail(correo);
    if (!usuario || !usuario.pregunta_seguridad || !usuario.respuesta_seguridad) {
      return res.status(400).json({ message: 'No se pudo verificar la información de recuperación' });
    }

    if (!respuestaSeguridad && !contraseña && !confirmarContraseña) {
      return res.status(200).json({
        message: 'Pregunta de seguridad disponible',
        preguntaSeguridad: usuario.pregunta_seguridad,
      });
    }

    if (!respuestaSeguridad || !contraseña || !confirmarContraseña) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    if (contraseña.length < 8) {
      return res.status(400).json({ message: 'La contraseña debe tener mínimo 8 caracteres' });
    }

    if (contraseña !== confirmarContraseña) {
      return res.status(400).json({ message: 'Las contraseñas no coinciden' });
    }

    const respuestaValida = await bcrypt.compare(respuestaSeguridad, usuario.respuesta_seguridad);
    if (!respuestaValida) {
      return res.status(401).json({ message: 'La respuesta de seguridad es incorrecta' });
    }

    const salt = await bcrypt.genSalt(10);
    const contraseñaHasheada = await bcrypt.hash(contraseña, salt);
    await updateUserPassword(usuario.id, contraseñaHasheada);

    res.status(200).json({
      message: 'Contraseña restablecida correctamente. Ya puedes iniciar sesión.',
    });
  } catch (error) {
    console.error('Error en recuperación:', error);
    res.status(500).json({ message: 'Error al recuperar contraseña' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.body;
    let { contraseña, confirmarContraseña } = req.body;
    if (typeof contraseña === 'string') contraseña = contraseña.normalize('NFC');
    if (typeof confirmarContraseña === 'string') confirmarContraseña = confirmarContraseña.normalize('NFC');

    if (!token || !contraseña || !confirmarContraseña) {
      return res.status(400).json({ message: 'Token y contraseñas son requeridos' });
    }

    if (contraseña.length < 8) {
      return res.status(400).json({ message: 'La contraseña debe tener mínimo 8 caracteres' });
    }

    if (contraseña !== confirmarContraseña) {
      return res.status(400).json({ message: 'Las contraseñas no coinciden' });
    }

    const resetRecord = await getPasswordResetByToken(token);
    if (!resetRecord || resetRecord.usado) {
      return res.status(400).json({ message: 'Token inválido o ya utilizado' });
    }

    const expirationDate = new Date(resetRecord.fecha_expiracion);
    if (expirationDate < new Date()) {
      return res.status(400).json({ message: 'El token ha expirado' });
    }

    await updateUserPassword(resetRecord.usuario_id, await bcrypt.hash(contraseña, 10));
    await markPasswordResetTokenUsed(resetRecord.id);

    res.status(200).json({ message: 'Contraseña restablecida correctamente' });
  } catch (error) {
    console.error('Error en restablecer contraseña:', error);
    res.status(500).json({ message: 'Error al restablecer contraseña' });
  }
};

// RF-1.4: Obtener Perfil
export const getProfile = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const usuario = await getUserById(usuarioId);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({
      user: usuario,
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
};

// RF-1.4: Actualizar Perfil
export const updateProfile = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { nombre, fotoPerfil, preguntaSeguridad, respuestaSeguridad } = req.body;

    // Validaciones básicas
    const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4 MB
    if (fotoPerfil && typeof fotoPerfil === 'string' && fotoPerfil.startsWith('data:')) {
      const base64Part = fotoPerfil.split(',')[1] || '';
      const imageBytes = Buffer.byteLength(base64Part, 'base64');
      if (imageBytes > MAX_IMAGE_BYTES) {
        return res.status(413).json({ message: 'La imagen es más pesada de lo debido. Usa una imagen menor a 4 MB.' });
      }
    }

    let fotoPerfilToSave = fotoPerfil;
    if (fotoPerfil === undefined) {
      const usuarioActual = await getUserById(usuarioId);
      fotoPerfilToSave = usuarioActual?.foto_perfil || null;
    }

    await updateUserProfile(usuarioId, nombre, fotoPerfilToSave);

    if (preguntaSeguridad || respuestaSeguridad) {
      if (!preguntaSeguridad || !respuestaSeguridad) {
        return res.status(400).json({ message: 'Pregunta y respuesta de seguridad son requeridas.' });
      }

      const salt = await bcrypt.genSalt(10);
      const respuestaSeguridadHasheada = await bcrypt.hash(respuestaSeguridad, salt);
      await updateUserSecurityQuestion(usuarioId, preguntaSeguridad, respuestaSeguridadHasheada);
    }

    res.status(200).json({
      message: 'Perfil actualizado exitosamente',
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    if (error.message && error.message.includes('max_allowed_packet')) {
      return res.status(413).json({ message: 'La imagen es demasiado pesada para la base de datos. Usa una imagen más liviana.' });
    }
    res.status(500).json({ message: 'Error al actualizar perfil' });
  }
};

// RF-1.4: Cambiar Contraseña
export const changePassword = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    let { contraseñaActual, contraseñaNueva, confirmarContraseña } = req.body;
    if (typeof contraseñaActual === 'string') contraseñaActual = contraseñaActual.normalize('NFC');
    if (typeof contraseñaNueva === 'string') contraseñaNueva = contraseñaNueva.normalize('NFC');
    if (typeof confirmarContraseña === 'string') confirmarContraseña = confirmarContraseña.normalize('NFC');

    if (!contraseñaActual || !contraseñaNueva || !confirmarContraseña) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    if (contraseñaNueva.length < 8) {
      return res.status(400).json({ message: 'La nueva contraseña debe tener mínimo 8 caracteres' });
    }

    if (contraseñaNueva !== confirmarContraseña) {
      return res.status(400).json({ message: 'Las contraseñas no coinciden' });
    }

    // Obtener usuario actual con contraseña para verificar el cambio
    const usuario = await getUserWithPasswordById(usuarioId);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar contraseña actual
    const contraseñaValida = await bcrypt.compare(contraseñaActual, usuario.contraseña);
    if (!contraseñaValida) {
      return res.status(401).json({ message: 'La contraseña actual es incorrecta' });
    }

    // Encriptar nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const contraseñaHasheada = await bcrypt.hash(contraseñaNueva, salt);

    // Actualizar contraseña
    await updateUserPassword(usuarioId, contraseñaHasheada);

    res.status(200).json({
      message: 'Contraseña actualizada exitosamente',
    });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ message: 'Error al cambiar contraseña' });
  }
};

export const getUserCourses = async (req, res) => {
  try {
    const registros = await getUserCourseProgress(req.user.id);
    res.status(200).json({ courses: registros });
  } catch (error) {
    console.error('Error al obtener cursos del usuario:', error);
    res.status(500).json({ message: 'Error al obtener tus cursos' });
  }
};

export const registerUserCourseController = async (req, res) => {
  try {
    const { courseId, progreso = 10 } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: 'El curso es requerido' });
    }

    const registro = await registerUserCourse(req.user.id, courseId, Number(progreso));
    res.status(200).json({ message: 'Curso inscrito correctamente', course: registro });
  } catch (error) {
    console.error('Error al inscribir curso:', error);
    res.status(500).json({ message: 'No se pudo guardar la inscripción' });
  }
};

export const updateUserCourseProgressController = async (req, res) => {
  try {
    const { courseId, progreso } = req.body;

    if (!courseId || progreso === undefined || progreso === null) {
      return res.status(400).json({ message: 'El curso y el progreso son requeridos' });
    }

    const registro = await updateUserCourseProgress(req.user.id, courseId, Number(progreso));
    res.status(200).json({ message: 'Progreso actualizado correctamente', course: registro });
  } catch (error) {
    console.error('Error al actualizar progreso:', error);
    res.status(500).json({ message: 'No se pudo actualizar el progreso' });
  }
};

// RF-1.5: Listar Usuarios (solo admin)
export const listUsers = async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado. Solo administradores' });
    }

    const usuarios = await getAllUsers();

    res.status(200).json({
      users: usuarios,
      total: usuarios.length,
    });
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    res.status(500).json({ message: 'Error al listar usuarios' });
  }
};

// RF-1.5: Actualizar Rol de Usuario (solo admin)
export const updateUserRoleController = async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado. Solo administradores' });
    }

    const { usuarioId, rol } = req.body;

    if (!usuarioId || !rol) {
      return res.status(400).json({ message: 'ID de usuario y rol son requeridos' });
    }

    if (!['usuario', 'admin'].includes(rol)) {
      return res.status(400).json({ message: 'Rol inválido' });
    }

    await updateUserRole(usuarioId, rol);

    res.status(200).json({
      message: 'Rol actualizado exitosamente',
    });
  } catch (error) {
    console.error('Error al actualizar rol:', error);
    res.status(500).json({ message: 'Error al actualizar rol' });
  }
};
