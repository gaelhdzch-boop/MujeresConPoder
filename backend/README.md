# Backend Plataforma

Backend de Node.js + Express para la plataforma de mujeres emprendedoras.

## Instalación

### 1. Instalar dependencias
```bash
cd backend
npm install
```

### 2. Configurar Base de Datos MySQL

#### Opción A: Usar XAMPP (Recomendado)
```
1. Asegúrate que XAMPP está corriendo (Apache + MySQL)
2. Accede a phpMyAdmin: http://localhost/phpmyadmin
3. Ejecuta el script SQL: backend/database/schema.sql
4. Confirma que se creó la BD "plataforma_db"
```

#### Opción B: Usar MySQL directamente
```bash
mysql -u root -p < backend/database/schema.sql
```

### 3. Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=(dejar vacío si no tienes contraseña)
# DB_NAME=plataforma_db
# JWT_SECRET=tu_clave_secreta_muy_segura_aqui_12345
```

### 4. Instalar nodemon (opcional, para desarrollo)
```bash
npm install -D nodemon
```

## Ejecución

### Desarrollo (con auto-reload)
```bash
npm run dev
```

### Producción
```bash
npm start
```

El servidor estará disponible en `http://localhost:5000`

## Endpoints Disponibles

### Autenticación (Público)
- `POST /api/auth/register` - Crear cuenta
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/forgot-password` - Recuperar contraseña

### Perfil (Protegido)
- `GET /api/auth/profile` - Obtener perfil del usuario
- `PUT /api/auth/profile` - Actualizar perfil
- `PUT /api/auth/change-password` - Cambiar contraseña

### Administración (Solo Admin)
- `GET /api/auth/users` - Listar todos los usuarios
- `PUT /api/auth/users/role` - Actualizar rol de usuario

## Seguridad

- ✅ Contraseñas encriptadas con bcrypt (RNF-1)
- ✅ Autenticación con JWT (RNF-2)
- ✅ CORS habilitado para frontend
- ✅ Validación de datos en servidor

## Base de Datos

La base de datos incluye las siguientes tablas:
- `usuarios` - Información de usuarias
- `tokens_recuperacion` - Tokens para recuperación de contraseña
- `sesiones` - Registro de sesiones (auditoría)
