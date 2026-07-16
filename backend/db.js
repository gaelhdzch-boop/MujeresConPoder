// MongoDB removed — use MySQL pool from `config/database.js`.
// Keep `conectarDB` as a no-op for compatibility with `server.js`.
const conectarDB = async () => {
  console.log('MongoDB disabled — backend will use MySQL via config/database.js');
  return;
};

export default conectarDB;