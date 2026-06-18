import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { getUserByEmail, createUser, getUserById, getUserWithPasswordById, updateUserPassword, updateUserProfile, getAllUsers, updateUserRole, createPasswordResetToken, getPasswordResetByToken, markPasswordResetTokenUsed } from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const EMAIL_FROM = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'no-reply@plataforma.com';
const EMAIL_SERVICE = process.env.EMAIL_SERVICE || '';

// RF-1.1: Registro
export const register = async (req, res) => {
  try {
    const { nombre, correo, contraseña, confirmarContraseña } = req.body;

    // Validaciones
    if (!nombre || !correo || !contraseña || !confirmarContraseña) {
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

    // Crear usuario
    const usuarioId = await createUser(nombre, correo, contraseñaHasheada);

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
    const { correo, contraseña } = req.body;

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

const createTransporter = async () => {
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  if (EMAIL_SERVICE && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      service: EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

const sendResetEmail = async (correo, nombre, token) => {
  const transporter = await createTransporter();
  const resetLink = `${FRONTEND_URL}/?reset_token=${token}`;
  const info = await transporter.sendMail({
    from: EMAIL_FROM,
    to: correo,
    subject: 'Recuperación de contraseña - Plataforma',
    html: `
      <div style="font-family: Arial, sans-serif; color: #111;">
        <h2>Hola ${nombre},</h2>
        <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
        <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
        <p><a href="${resetLink}" style="background:#f472b6;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;">Restablecer contraseña</a></p>
        <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
        <p>El enlace expira en 30 minutos.</p>
      </div>
    `,
  });
  return info;
};

// RF-1.3: Recuperación de Contraseña
export const forgotPassword = async (req, res) => {
  try {
    const { correo } = req.body;

    if (!correo) {
      return res.status(400).json({ message: 'El correo es requerido' });
    }

    const usuario = await getUserByEmail(correo);
    if (!usuario) {
      return res.status(200).json({ message: 'Si el correo existe, recibirás un enlace de recuperación' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min
    await createPasswordResetToken(usuario.id, token, expiresAt);
    const info = await sendResetEmail(usuario.correo, usuario.nombre, token);

    console.log('Password reset email sent:', info.messageId);
    if (info.previewUrl) {
      console.log('Preview URL:', info.previewUrl);
    }

    res.status(200).json({
      message: 'Si el correo existe, recibirás un enlace de recuperación',
      preview: info.previewUrl || undefined,
    });
  } catch (error) {
    console.error('Error en recuperación:', error);
    res.status(500).json({ message: 'Error al recuperar contraseña' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, contraseña, confirmarContraseña } = req.body;

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
    const { nombre, fotoPerfil } = req.body;

    // Validaciones básicas
    const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4 MB
    if (fotoPerfil && typeof fotoPerfil === 'string' && fotoPerfil.startsWith('data:')) {
      const base64Part = fotoPerfil.split(',')[1] || '';
      const imageBytes = Buffer.byteLength(base64Part, 'base64');
      if (imageBytes > MAX_IMAGE_BYTES) {
        return res.status(413).json({ message: 'La imagen es más pesada de lo debido. Usa una imagen menor a 4 MB.' });
      }
    }

    await updateUserProfile(usuarioId, nombre, fotoPerfil);

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
    const { contraseñaActual, contraseñaNueva, confirmarContraseña } = req.body;

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
