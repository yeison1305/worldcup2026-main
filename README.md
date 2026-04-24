# World Cup 2026 Predictor - Guía de Instalación

## Requisitos Previos

Antes de comenzar, asegurate de tener instalado:

- **Node.js** (v18 o superior) - [Descargar](https://nodejs.org/)
- **npm** (v9 o superior) - viene con Node.js
- **Git** - [Descargar](https://git-scm.com/)

## Pasos de Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/MiguelAngelTorresCastrillon/worldcup2026.git
cd worldcup2026
```

### 2. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 3. Instalar dependencias del frontend

```bash
cd ../frontend
npm install
```

### 4. Configurar variables de entorno

Las credenciales de Supabase y email son LAS MISMAS que usa Miguel. Pedíaselas directamente.

#### Backend

En la carpeta `backend/`, copiá el archivo de ejemplo:

```bash
cp .env.example .env
```

Luego editá `.env` y completá los valores que te dé Miguel:

```env
# Puerto del servidor
PORT=3000

# Supabase - pedile a Miguel las credenciales
SUPABASE_URL=pedile_a_miguel
SUPABASE_KEY=pedile_a_miguel

# JWT - pedile a Miguel la clave
JWT_SECRET=pedile_a_miguel

# Email - pedile a Miguel los datos
EMAIL_USER=pedile_a_miguel
EMAIL_PASS=pedile_a_miguel
```

#### Frontend

En la carpeta `frontend/`:

```bash
cp .env.example .env
```

El archivo `.env.example` ya viene configurado para local, pero si usás el backend de Miguel en producción, consultá con él.

#### Frontend

En la carpeta `frontend/`, creá un archivo `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

### 5. Configurar la base de datos

Como la base de datos es la MISMA que la de Miguel, no necesitás ejecutar las migraciones. Pero si querés verificar que esté tudo bien:

1. Pedile a Miguel el link del proyecto Supabase
2. Ir a SQL Editor
3. Verificar que existan las tablas: `users`, `teams`, `matches`, `predictions`

### 6. Ejecutar el proyecto

#### Terminal 1 - Backend (en carpeta `backend/`):

```bash
npm run dev
```

Deberías ver:
```
Server running on port 3000
Database connected
```

#### Terminal 2 - Frontend (en carpeta `frontend/`):

```bash
npm run dev
```

Deberías ver algo como:
```
VITE v5.x.x  ready in 300 ms

  ➜  Local:   http://localhost:5173/
```

### 7. Acceder a la aplicación

Abrir en el navegador: **http://localhost:5173**

## Credenciales de Prueba

### Para crear un usuario administrador:

1. Registrate normalmente en la app
2. En Supabase, ir a la tabla `users`
3. Cambiar el campo `role` de tu usuario a `ADMIN`

### Para iniciar sesión como admin:

- Email: el que registraste
- Password: el que pusiste
- Serás redirigido automáticamente al panel de admin

## Estructura del Proyecto

```
worldcup2026/
├── backend/
│   ├── src/
│   │   ├── app.js          # Servidor Express
│   │   ├── config/         # Configuración BD
│   │   ├── controllers/   # Lógica de rutas
│   │   ├── repositories/  # Consultas a BD
│   │   ├── services/      # Lógica de negocio
│   │   ├── routes/        # Definición de rutas
│   │   ├── middlewares/   # Auth, rate limiting
│   │   ├── migrations/    # SQL de BD
│   │   └── utils/         # Utilidades
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas
│   │   ├── context/       # Auth context
│   │   ├── routes/        # Router
│   │   └── services/      # Llamadas API
│   ├── index.html
│   └── package.json
└── README.md
```

## Solución de Problemas

### "Cannot find module" al iniciar
```bash
# Reinstalar dependencias
cd backend && npm install
cd ../frontend && npm install
```

### Error de conexión a Supabase
- Verificar que las variables `SUPABASE_URL` y `SUPABASE_KEY` sean correctas
- Asegurarse de tener internet

### Error de JWT
- Verificar que `JWT_SECRET` tenga al menos 32 caracteres
- Regenerar el token si se cambia la clave

### El frontend no se conecta al backend
- Verificar que el backend esté corriendo en puerto 3000
- Revisar que `VITE_API_URL` en frontend/.env sea correcto

### Errores de CORS
El backend ya tiene CORS configurado para el frontend en puerto 5173. Si hay problemas, revisar `backend/src/app.js`.

## Comandos Útiles

```bash
# Backend
cd backend
npm start        # Producción
npm run dev      # Desarrollo (con nodemon)

# Frontend  
cd frontend
npm run dev      # Desarrollo
npm run build    # Producción
```

## Soporte

Si tenés problemas, revisá:
1. La consola del navegador (F12 → Console)
2. Los logs del backend en la terminal
3. Consultá con Miguel si las credenciales son correctas

## IMPORTANTE: Credenciales Compartidas

Para que funcione correctamente, necesitás las siguientes credenciales de Miguel:

| Variable | Descripción | Cómo obtenerla |
|----------|-------------|----------------|
| `SUPABASE_URL` | URL del proyecto Supabase | Pedir a Miguel |
| `SUPABASE_KEY` | Clave anon de Supabase | Pedir a Miguel |
| `JWT_SECRET` | Clave para JWT | Pedir a Miguel |
| `EMAIL_USER` | Email para enviar correos | Pedir a Miguel |
| `EMAIL_PASS` | Password de aplicación | Pedir a Miguel |

**Archivos de ejemplo listos para copiar:**
- `backend/.env.example` → `backend/.env`
- `frontend/.env.example` → `frontend/.env`