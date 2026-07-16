import pool from '../config/database.js';

export const getUserByEmail = async (correo) => {
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ? LIMIT 1', [correo]);
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Error al buscar usuario: ${error.message}`);
  }
};

export const getUserById = async (id) => {
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Error al buscar usuario: ${error.message}`);
  }
};

export const getUserWithPasswordById = async (id) => {
  // Same as getUserById for MySQL schema (contraseña is stored by default)
  return getUserById(id);
};

export const createUser = async (nombre, correo, contraseñaHasheada, preguntaSeguridad = null, respuestaSeguridadHasheada = null) => {
  try {
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, correo, contraseña, pregunta_seguridad, respuesta_seguridad) VALUES (?, ?, ?, ?, ?)',
      [nombre, correo, contraseñaHasheada, preguntaSeguridad, respuestaSeguridadHasheada]
    );
    return result.insertId;
  } catch (error) {
    throw new Error(`Error al crear usuario: ${error.message}`);
  }
};

export const updateUserPassword = async (id, nuevaContraseñaHasheada) => {
  try {
    await pool.query('UPDATE usuarios SET contraseña = ? WHERE id = ?', [nuevaContraseñaHasheada, id]);
  } catch (error) {
    throw new Error(`Error al actualizar contraseña: ${error.message}`);
  }
};

export const createPasswordResetToken = async (usuarioId, token, expiresAt) => {
  try {
    await pool.query('INSERT INTO tokens_recuperacion (usuario_id, token, fecha_expiracion, usado) VALUES (?, ?, ?, ?)', [usuarioId, token, expiresAt, 0]);
  } catch (error) {
    throw new Error(`Error al crear token de recuperación: ${error.message}`);
  }
};

export const getPasswordResetByToken = async (token) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tokens_recuperacion WHERE token = ? LIMIT 1', [token]);
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Error al buscar token de recuperación: ${error.message}`);
  }
};

export const markPasswordResetTokenUsed = async (id) => {
  try {
    await pool.query('UPDATE tokens_recuperacion SET usado = 1 WHERE id = ?', [id]);
  } catch (error) {
    throw new Error(`Error al marcar token como usado: ${error.message}`);
  }
};

export const updateUserProfile = async (id, nombre, fotoPerfil) => {
  try {
    if (fotoPerfil !== undefined) {
      await pool.query('UPDATE usuarios SET nombre = ?, foto_perfil = ? WHERE id = ?', [nombre, fotoPerfil, id]);
    } else {
      await pool.query('UPDATE usuarios SET nombre = ? WHERE id = ?', [nombre, id]);
    }
  } catch (error) {
    throw new Error(`Error al actualizar perfil: ${error.message}`);
  }
};

export const updateUserSecurityQuestion = async (id, preguntaSeguridad, respuestaSeguridadHasheada) => {
  try {
    await pool.query('UPDATE usuarios SET pregunta_seguridad = ?, respuesta_seguridad = ? WHERE id = ?', [preguntaSeguridad, respuestaSeguridadHasheada, id]);
  } catch (error) {
    throw new Error(`Error al actualizar la pregunta de seguridad: ${error.message}`);
  }
};

export const getAllUsers = async () => {
  try {
    const [rows] = await pool.query('SELECT id, nombre, correo, rol, estado FROM usuarios');
    return rows;
  } catch (error) {
    throw new Error(`Error al obtener usuarios: ${error.message}`);
  }
};

export const updateUserRole = async (id, rol) => {
  try {
    await pool.query('UPDATE usuarios SET rol = ? WHERE id = ?', [rol, id]);
  } catch (error) {
    throw new Error(`Error al actualizar rol: ${error.message}`);
  }
};

export const getMarketplaceProducts = async () => {
  try {
    const [rows] = await pool.query(
      'SELECT mp.*, u.nombre AS vendedor_nombre, u.correo AS vendedor_correo, u.foto_perfil AS vendedor_foto_perfil FROM marketplace_productos mp JOIN usuarios u ON mp.usuario_id = u.id WHERE mp.estado = ? ORDER BY mp.fecha_publicacion DESC',
      ['publicado']
    );
    return rows;
  } catch (error) {
    throw new Error(`Error al obtener productos del marketplace: ${error.message}`);
  }
};

export const createMarketplaceProduct = async (usuarioId, nombreArticulo, emprendimiento, categoria, precio, ciudad, contacto, descripcion, stock, imagen = null) => {
  try {
    const [result] = await pool.query(
      `INSERT INTO marketplace_productos (usuario_id, nombre_articulo, emprendimiento, categoria, precio, ciudad, contacto, descripcion, stock, imagen)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [usuarioId, nombreArticulo, emprendimiento, categoria, precio, ciudad, contacto, descripcion, stock, imagen]
    );
    const [rows] = await pool.query('SELECT * FROM marketplace_productos WHERE id = ? LIMIT 1', [result.insertId]);
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Error al crear producto del marketplace: ${error.message}`);
  }
};

export const updateMarketplaceProductStock = async (usuarioId, productoId, stock) => {
  try {
    await pool.query(
      'UPDATE marketplace_productos SET stock = ? WHERE id = ? AND usuario_id = ? AND estado = ?',
      [stock, productoId, usuarioId, 'publicado']
    );
    const [rows] = await pool.query('SELECT * FROM marketplace_productos WHERE id = ? LIMIT 1', [productoId]);
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Error al actualizar el stock del producto: ${error.message}`);
  }
};

export const deleteMarketplaceProduct = async (usuarioId, productoId) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM marketplace_productos WHERE id = ? AND usuario_id = ? AND estado = ?',
      [productoId, usuarioId, 'publicado']
    );
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error(`Error al eliminar el producto del marketplace: ${error.message}`);
  }
};

export const getUserCourseProgress = async (usuarioId) => {
  try {
    const [rows] = await pool.query('SELECT * FROM cursos_usuario WHERE usuario_id = ? ORDER BY fecha_actualizacion DESC', [usuarioId]);
    return rows;
  } catch (error) {
    throw new Error(`Error al obtener progreso de cursos: ${error.message}`);
  }
};

export const registerUserCourse = async (usuarioId, cursoId, progreso = 10) => {
  try {
    const estado = Number(progreso) >= 100 ? 'completado' : 'inscrito';
    await pool.query(
      `INSERT INTO cursos_usuario (usuario_id, curso_id, progreso, estado) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE progreso = VALUES(progreso), estado = VALUES(estado), fecha_actualizacion = CURRENT_TIMESTAMP`,
      [usuarioId, cursoId, Number(progreso), estado]
    );
    const [rows] = await pool.query('SELECT * FROM cursos_usuario WHERE usuario_id = ? AND curso_id = ? LIMIT 1', [usuarioId, cursoId]);
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Error al registrar curso: ${error.message}`);
  }
};

export const updateUserCourseProgress = async (usuarioId, cursoId, progreso) => {
  try {
    const estado = Number(progreso) >= 100 ? 'completado' : 'inscrito';
    await pool.query(
      `INSERT INTO cursos_usuario (usuario_id, curso_id, progreso, estado) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE progreso = VALUES(progreso), estado = VALUES(estado), fecha_actualizacion = CURRENT_TIMESTAMP`,
      [usuarioId, cursoId, Number(progreso), estado]
    );
    const [rows] = await pool.query('SELECT * FROM cursos_usuario WHERE usuario_id = ? AND curso_id = ? LIMIT 1', [usuarioId, cursoId]);
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Error al actualizar progreso de curso: ${error.message}`);
  }
};
