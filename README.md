# Plataforma para Mujeres Emprendedoras

## Resumen del proyecto
Esta plataforma incluye:
- Backend en Node.js + Express para autenticación, recuperación de contraseña y administración de usuarios.
- Frontend en React + Vite para registro, inicio de sesión, perfil y recuperación de contraseña.
- Base de datos MySQL con tablas de usuarios, tokens de recuperación y sesiones.

## Estructura principal

```
plataforma/
├── backend/            # API y lógica del servidor
├── mi-plataforma/      # Frontend React + Vite
└── GUIA_CONFIGURACION.md
```

## Backend

### Tecnologías
- Node.js
- Express
- MySQL (`mysql2`)
- JWT (`jsonwebtoken`)
- bcrypt (`bcryptjs`)
- Nodemailer para envío de correos de recuperación
- Dotenv para variables de entorno
- CORS habilitado

### Archivos clave
- `backend/server.js` - servidor Express y configuración global
- `backend/routes/authRoutes.js` - rutas de autenticación y perfil
- `backend/controllers/authController.js` - controladores de registro, login, recuperación y administración
- `backend/models/userModel.js` - consultas SQL y acceso a datos
- `backend/middleware/auth.js` - validación de JWT y verificación de administrador
- `backend/database/schema.sql` - esquema de base de datos

### Funcionalidad implementada
- Registro de usuario con validación y hash de contraseña
- Inicio de sesión con JWT
- Validaciones de correo y contraseña en backend
- Recuperación de contraseña mediante token único de 30 minutos
- Restablecimiento seguro de contraseña
- Consulta y actualización de perfil autenticado
- Cambio de contraseña autenticado
- Rutas administradoras protegidas por rol `admin`

### Endpoints principales
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`
- `PUT /api/auth/change-password`
- `GET /api/auth/users` (admin)
- `PUT /api/auth/users/role` (admin)

## Frontend

### Tecnologías
- React
- Vite
- CSS modular en `src/styles`

### Archivos clave
- `mi-plataforma/src/App.jsx` - navegación entre home, auth, profile y sesión cerrada
- `mi-plataforma/src/services/api.js` - llamadas a la API y manejo de tokens
- `mi-plataforma/src/components/AuthPage.jsx` - página principal de autenticación
- `mi-plataforma/src/components/Login.jsx` - formulario de inicio de sesión
- `mi-plataforma/src/components/SignUp.jsx` - formulario de registro
- `mi-plataforma/src/components/ForgotPassword.jsx` - solicitud de restablecimiento
- `mi-plataforma/src/components/ResetPassword.jsx` - formulario de nueva contraseña
- `mi-plataforma/src/components/Profile.jsx` - vista de perfil del usuario
- `mi-plataforma/src/components/Navbar.jsx` - navegación del sitio
- `mi-plataforma/src/components/SessionClosed.jsx` - pantalla de cierre de sesión
- `mi-plataforma/src/components/HeroSection.jsx`, `FeaturesGrid.jsx`, `OpportunitiesBanner.jsx` - contenido de la página de inicio

### Funcionalidad implementada
- Registro y login con persistencia de token en `localStorage`
- Acceso a vista de perfil cuando el usuario está autenticado
- Navegación condicional entre home, auth y profile
- Flujo de recuperación de contraseña con token en URL
- Manejo de sesión cerrada
- Integración con API backend usando `fetch`

## Configuración recomendada
1. Configurar MySQL y crear la base de datos usando `backend/database/schema.sql`
2. Copiar y editar el archivo de entorno en `backend/` con variables como `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` y `JWT_SECRET`
3. Instalar dependencias del backend:
   ```bash
   cd backend
   npm install
   ```
4. Iniciar backend:
   ```bash
   npm run dev
   ```
5. Instalar dependencias del frontend:
   ```bash
   cd mi-plataforma
   npm install
   ```
6. Iniciar frontend:
   ```bash
   npm run dev
   ```

## Notas finales
- El backend protege rutas con JWT y distingue administración por rol.
- La recuperación de contraseña envía un token temporal y permite restablecer contraseña desde el frontend.
- La plataforma ya cuenta con los componentes principales para autenticación y perfil de usuaria.

> Para detalles de instalación y configuración paso a paso, consulta `GUIA_CONFIGURACION.md`.
