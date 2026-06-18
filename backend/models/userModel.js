import pool from '../config/database.js';

export const getUserByEmail = async (correo) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM usuarios WHERE correo = ?',
      [correo]
    );
    connection.release();
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Error al buscar usuario: ${error.message}`);
  }
};

export const getUserById = async (id) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT id, nombre, correo, foto_perfil, rol, estado, fecha_registro FROM usuarios WHERE id = ?',
      [id]
    );
    connection.release();
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Error al buscar usuario: ${error.message}`);
  }
};

export const getUserWithPasswordById = async (id) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT id, nombre, correo, contraseña, foto_perfil, rol, estado, fecha_registro FROM usuarios WHERE id = ?',
      [id]
    );
    connection.release();
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Error al buscar usuario con contraseña: ${error.message}`);
  }
};

export const createUser = async (nombre, correo, contraseñaHasheada) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO usuarios (nombre, correo, contraseña) VALUES (?, ?, ?)',
      [nombre, correo, contraseñaHasheada]
    );
    connection.release();
    return result.insertId;
  } catch (error) {
    throw new Error(`Error al crear usuario: ${error.message}`);
  }
};

export const updateUserPassword = async (id, nuevaContraseñaHasheada) => {
  try {
    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE usuarios SET contraseña = ? WHERE id = ?',
      [nuevaContraseñaHasheada, id]
    );
    connection.release();
  } catch (error) {
    throw new Error(`Error al actualizar contraseña: ${error.message}`);
  }
};

export const createPasswordResetToken = async (usuarioId, token, expiresAt) => {
  try {
    const connection = await pool.getConnection();
    await connection.query(
      'INSERT INTO tokens_recuperacion (usuario_id, token, fecha_expiracion, usado) VALUES (?, ?, ?, ?)',
      [usuarioId, token, expiresAt, false]
    );
    connection.release();
  } catch (error) {
    throw new Error(`Error al crear token de recuperación: ${error.message}`);
  }
};

export const getPasswordResetByToken = async (token) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM tokens_recuperacion WHERE token = ?',
      [token]
    );
    connection.release();
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Error al buscar token de recuperación: ${error.message}`);
  }
};

export const markPasswordResetTokenUsed = async (id) => {
  try {
    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE tokens_recuperacion SET usado = TRUE WHERE id = ?',
      [id]
    );
    connection.release();
  } catch (error) {
    throw new Error(`Error al marcar token como usado: ${error.message}`);
  }
};

export const updateUserProfile = async (id, nombre, fotoPerfil) => {
  try {
    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE usuarios SET nombre = ?, foto_perfil = ? WHERE id = ?',
      [nombre, fotoPerfil, id]
    );
    connection.release();
  } catch (error) {
    throw new Error(`Error al actualizar perfil: ${error.message}`);
  }
};

export const getAllUsers = async () => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT id, nombre, correo, rol, estado, fecha_registro FROM usuarios'
    );
    connection.release();
    return rows;
  } catch (error) {
    throw new Error(`Error al obtener usuarios: ${error.message}`);
  }
};

export const updateUserRole = async (id, rol) => {
  try {
    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE usuarios SET rol = ? WHERE id = ?',
      [rol, id]
    );
    connection.release();
  } catch (error) {
    throw new Error(`Error al actualizar rol: ${error.message}`);
  }
};
