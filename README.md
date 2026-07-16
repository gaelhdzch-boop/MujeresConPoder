# Documentación de la plataforma

## 1. Qué es este sitio y cómo funciona

Esta plataforma está pensada para mujeres emprendedoras y ofrece una experiencia de acceso a contenido, autenticación de usuarios, perfil personal, marketplace, cursos, finanzas, comunidad y oportunidades.

### Funcionalidades principales

- Registro e inicio de sesión de usuarios.
- Recuperación de contraseña mediante pregunta de seguridad.
- Gestión de perfil con foto, datos básicos y cambio de contraseña.
- Catálogo de cursos con seguimiento de progreso.
- Marketplace para publicar y visualizar productos o servicios.
- Secciones de finanzas, comunidad y oportunidades.
- Panel de administración para gestionar usuarios y roles.

### Flujo general del sitio

1. El usuario entra al frontend en React + Vite.
2. El frontend decide si mostrar la vista pública o la vista autenticada.
3. Cuando el usuario inicia sesión, el backend genera un token JWT y lo devuelve al cliente.
4. El token se guarda en localStorage y se usa para acceder a rutas protegidas.
5. El backend valida el token y permite consultar o actualizar datos del usuario, cursos y marketplace.

---

## 2. Arquitectura del proyecto

El proyecto está dividido en dos partes principales:

- Frontend: React + Vite
- Backend: Node.js + Express
- Base de datos: MySQL

### Estructura principal

```text
plataforma/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── database/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── .env.example
│   ├── db.js
│   ├── index.js
│   ├── package.json
│   ├── server.js
│   └── README.md
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── data/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
└── README.md
```

---

## 3. Cómo está configurado

### Backend

El backend se ejecuta con Express y expone una API bajo la ruta /api.

#### Archivo principal

- backend/server.js: inicia el servidor, habilita CORS, parsea JSON y monta las rutas de autenticación.

#### Rutas principales

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/forgot-password
- POST /api/auth/reset-password
- GET /api/auth/profile
- PUT /api/auth/profile
- PUT /api/auth/change-password
- GET /api/auth/courses
- POST /api/auth/courses/register
- PUT /api/auth/courses/progress
- GET /api/auth/marketplace
- POST /api/auth/marketplace
- PUT /api/auth/marketplace/:id/stock
- DELETE /api/auth/marketplace/:id
- GET /api/auth/users (solo admin)
- PUT /api/auth/users/role (solo admin)

#### Autenticación

- Se usa JWT para proteger rutas.
- El middleware de autenticación valida el token enviado en el header Authorization.
- Existe un middleware adicional para restringir acceso a usuarios administradores.

### Frontend

El frontend está montado con React y Vite.

#### Archivo principal

- frontend/src/App.jsx: controla la navegación entre home, autenticación, perfil, cursos, marketplace, comunidad, finanzas y oportunidades.

#### Componente clave

- Navbar: navegación principal.
- AuthPage: vista de registro/inicio de sesión/recuperación de contraseña.
- Profile: perfil autenticado.
- Marketplace: listado y publicación de productos.
- Cursos: catálogo de cursos y progreso.
- Finanzas, Comunidad y Oportunidades: secciones de contenido.

---

## 4. Base de datos

La base de datos se configura con MySQL y el esquema se encuentra en backend/database/schema.sql.

### Tablas principales

- usuarios: información de usuarios, contraseña cifrada, pregunta de seguridad, rol y estado.
- tokens_recuperacion: almacenamiento temporal de tokens para recuperación de contraseña.
- sesiones: registro de sesiones JWT (opcional para auditoría).
- cursos_usuario: progreso de los cursos inscritos por usuario.
- marketplace_productos: productos publicados en el marketplace.

### Variables de entorno

El backend usa un archivo .env con las siguientes variables esenciales:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=plataforma_db
JWT_SECRET=tu_secreto
PORT=5000
```

---

## 5. Cómo ejecutar el proyecto

### 1. Preparar la base de datos

1. Crear una base de datos MySQL llamada plataforma_db.
2. Ejecutar el contenido de backend/database/schema.sql.

### 2. Configurar variables de entorno

Crear el archivo backend/.env con los valores correspondientes.

### 3. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 4. Iniciar el backend

```bash
npm run dev
```

### 5. Instalar dependencias del frontend

```bash
cd ../frontend
npm install
```

### 6. Iniciar el frontend

```bash
npm run dev
```

El backend normalmente se ejecuta en http://localhost:5000 y el frontend en http://localhost:5173.

---

## 6. Notas de seguridad y funcionamiento

- Las contraseñas se almacenan cifradas con bcrypt.
- Las respuestas de seguridad también se guardan de forma cifrada.
- Los tokens JWT se usan para autenticar solicitudes sensibles.
- El frontend guarda el token en localStorage para mantener la sesión.
- Las rutas administrativas requieren rol admin.

---

## 7. Puntos esenciales para mantener

- Mantener actualizado el archivo .env con credenciales correctas.
- Asegurar que la base de datos MySQL esté activa antes de iniciar el backend.
- Si se modifican rutas o estructura de la API, actualizar la lógica del frontend en frontend/src/services/api.js.
- Si se agregan nuevas secciones, se recomienda integrarlas en App.jsx y en el frontend para mantener la navegación consistente.
