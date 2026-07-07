import pool from '../config/database.js';

const ensureSecurityColumns = async () => {
  try {
    const connection = await pool.getConnection();
    const [columns] = await connection.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'usuarios' AND COLUMN_NAME IN ('pregunta_seguridad', 'respuesta_seguridad')"
    );
    const existingColumns = new Set(columns.map((column) => column.COLUMN_NAME));

    if (!existingColumns.has('pregunta_seguridad')) {
      await connection.query("ALTER TABLE usuarios ADD COLUMN pregunta_seguridad VARCHAR(255) NULL");
    }

    if (!existingColumns.has('respuesta_seguridad')) {
      await connection.query("ALTER TABLE usuarios ADD COLUMN respuesta_seguridad VARCHAR(255) NULL");
    }

    connection.release();
  } catch (error) {
    throw new Error(`Error al asegurar columnas de seguridad: ${error.message}`);
  }
};

const ensureCourseTrackingTables = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cursos_usuario (
        id INT PRIMARY KEY AUTO_INCREMENT,
        usuario_id INT NOT NULL,
        curso_id VARCHAR(100) NOT NULL,
        progreso INT NOT NULL DEFAULT 0,
        estado ENUM('inscrito', 'completado') DEFAULT 'inscrito',
        fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_usuario_curso (usuario_id, curso_id),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        INDEX idx_curso_id (curso_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    connection.release();
  } catch (error) {
    throw new Error(`Error al asegurar tablas de cursos: ${error.message}`);
  }
};

export const getUserByEmail = async (correo) => {
  try {
    await ensureSecurityColumns();
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT id, nombre, correo, contraseña, foto_perfil, rol, estado, fecha_registro, pregunta_seguridad, respuesta_seguridad FROM usuarios WHERE correo = ?',
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
      'SELECT id, nombre, correo, foto_perfil, rol, estado, fecha_registro, pregunta_seguridad FROM usuarios WHERE id = ?',
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

export const createUser = async (nombre, correo, contraseñaHasheada, preguntaSeguridad = null, respuestaSeguridadHasheada = null) => {
  try {
    await ensureSecurityColumns();
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO usuarios (nombre, correo, contraseña, pregunta_seguridad, respuesta_seguridad) VALUES (?, ?, ?, ?, ?)',
      [nombre, correo, contraseñaHasheada, preguntaSeguridad, respuestaSeguridadHasheada]
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
    if (fotoPerfil !== undefined) {
      await connection.query(
        'UPDATE usuarios SET nombre = ?, foto_perfil = ? WHERE id = ?',
        [nombre, fotoPerfil, id]
      );
    } else {
      await connection.query(
        'UPDATE usuarios SET nombre = ? WHERE id = ?',
        [nombre, id]
      );
    }
    connection.release();
  } catch (error) {
    throw new Error(`Error al actualizar perfil: ${error.message}`);
  }
};

export const updateUserSecurityQuestion = async (id, preguntaSeguridad, respuestaSeguridadHasheada) => {
  try {
    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE usuarios SET pregunta_seguridad = ?, respuesta_seguridad = ? WHERE id = ?',
      [preguntaSeguridad, respuestaSeguridadHasheada, id]
    );
    connection.release();
  } catch (error) {
    throw new Error(`Error al actualizar la pregunta de seguridad: ${error.message}`);
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

export const getUserCourseProgress = async (usuarioId) => {
  try {
    await ensureCourseTrackingTables();
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT id, usuario_id, curso_id, progreso, estado, fecha_inscripcion, fecha_actualizacion FROM cursos_usuario WHERE usuario_id = ? ORDER BY fecha_actualizacion DESC',
      [usuarioId]
    );
    connection.release();
    return rows;
  } catch (error) {
    throw new Error(`Error al obtener progreso de cursos: ${error.message}`);
  }
};

export const registerUserCourse = async (usuarioId, cursoId, progreso = 10) => {
  try {
    await ensureCourseTrackingTables();
    const connection = await pool.getConnection();
    const estado = Number(progreso) >= 100 ? 'completado' : 'inscrito';
    const [existing] = await connection.query(
      'SELECT id FROM cursos_usuario WHERE usuario_id = ? AND curso_id = ?',
      [usuarioId, cursoId]
    );

    if (existing.length) {
      await connection.query(
        'UPDATE cursos_usuario SET progreso = ?, estado = ? WHERE usuario_id = ? AND curso_id = ?',
        [Number(progreso), estado, usuarioId, cursoId]
      );
    } else {
      await connection.query(
        'INSERT INTO cursos_usuario (usuario_id, curso_id, progreso, estado) VALUES (?, ?, ?, ?)',
        [usuarioId, cursoId, Number(progreso), estado]
      );
    }

    const [rows] = await connection.query(
      'SELECT id, usuario_id, curso_id, progreso, estado, fecha_inscripcion, fecha_actualizacion FROM cursos_usuario WHERE usuario_id = ? AND curso_id = ?',
      [usuarioId, cursoId]
    );
    connection.release();
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Error al registrar curso: ${error.message}`);
  }
};

export const updateUserCourseProgress = async (usuarioId, cursoId, progreso) => {
  try {
    await ensureCourseTrackingTables();
    const connection = await pool.getConnection();
    const estado = Number(progreso) >= 100 ? 'completado' : 'inscrito';
    await connection.query(
      'INSERT INTO cursos_usuario (usuario_id, curso_id, progreso, estado) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE progreso = VALUES(progreso), estado = VALUES(estado)',
      [usuarioId, cursoId, Number(progreso), estado]
    );

    const [rows] = await connection.query(
      'SELECT id, usuario_id, curso_id, progreso, estado, fecha_inscripcion, fecha_actualizacion FROM cursos_usuario WHERE usuario_id = ? AND curso_id = ?',
      [usuarioId, cursoId]
    );
    connection.release();
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Error al actualizar progreso de curso: ${error.message}`);
  }
};
