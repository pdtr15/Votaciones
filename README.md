## 👥 Desarrolladores

| Nombre | Carné |
|--------|-------|
| **Pablo Daniel Tzul Razhon** | 9490-21-5193 |
| **Oscar Jose Cojulum Mendoza** | 9490-22-4974 |

# 🗳️ Sistema de Administración de Votaciones

Sistema web completo para la gestión de campañas electorales, permitiendo el registro, administración y visualización de resultados en tiempo real.

## 📋 Descripción

Aplicación full-stack diseñada para administrar procesos de votación de manera segura y eficiente. Cuenta con autenticación por roles, gestión de campañas y candidatos, registro de votos y visualización de resultados mediante gráficos interactivos.

## 📚 Documentación

- [Manual Técnico] https://drive.google.com/file/d/1kAWavl8TnQjBX00USTf0kPID9Xmh37J0/view?usp=sharing
- [Manual de Usuario]  https://drive.google.com/file/d/1MRRRVRAdptJ3B8gquisjVkuBjxakyBc2/view?usp=sharing
  
## 🚀 Demo en Vivo
- **Frontend**: [https://votacionespf.netlify.app](https://votacionespf.netlify.app/#/Campanias)
- **Backend API**: [https://votaciones-d3zz.onrender.com](https://votaciones-d3zz.onrender.com)
- Repositorio en Github: https://github.com/pdtr15/Votaciones.git 

## 🛠️ Tecnologías

### Frontend
- **React 18** - Librería para construir interfaces de usuario
- **TypeScript** - Tipado estático para JavaScript
- **React Router** - Navegación entre páginas
- **Chart.js / React-Chartjs-2** - Visualización de datos en gráficos
- **Bootstrap 5** - Framework CSS para diseño responsivo
- **Axios** - Cliente HTTP para peticiones al backend
- **Vite** - Herramienta de construcción rápida

### Backend
- **Node.js** - Entorno de ejecución de JavaScript
- **Express** - Framework web para APIs RESTful
- **TypeScript** - Tipado estático en el servidor
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación basada en tokens
- **Sequelize** - ORM para PostgreSQL
- **bcrypt** - Encriptación de contraseñas

### Infraestructura
- **Netlify** - Hosting del frontend
- **Render** - Hosting del backend
- **Neon Database** - Base de datos PostgreSQL en la nube

## ✨ Características Principales

- ✅ **Autenticación segura** con roles (Admin, Ingeniero, Votante)
- 📊 **Dashboard interactivo** con gráficos de resultados en tiempo real
- 🗳️ **Gestión de campañas** (crear, editar, eliminar)
- 👥 **Administración de candidatos** con fotos y perfiles
- 📈 **Registro y conteo de votos** en tiempo real
- 📱 **Diseño responsivo** compatible con móviles y tablets
- 🔒 **Seguridad** con tokens JWT y encriptación de datos

## 📁 Estructura del Proyecto

```
ProyectoFinal/
├── backend/           # API REST con Express y TypeScript
│   ├── controllers/   # Lógica de negocio
│   ├── models/        # Modelos de Sequelize
│   ├── routes/        # Definición de rutas
│   ├── middlewares/   # Validaciones y autenticación
│   └── db/            # Configuración de base de datos
│
├── fontend/           # Aplicación React con TypeScript
│   ├── src/
│   │   ├── pages/     # Páginas de la aplicación
│   │   ├── components/# Componentes reutilizables
│   │   ├── contexts/  # Context API de React
│   │   ├── api/       # Configuración de Axios
│   │   └── assets/    # Estilos y recursos estáticos
│   └── public/        # Archivos públicos
│
└── README.md
```

## 🔧 Instalación y Configuración

### Requisitos Previos

- Node.js v18 o superior
- npm o yarn
- PostgreSQL 14 o superior
- Git

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/proyecto-votaciones.git
cd proyecto-votaciones
```
### 2. Configurar Backend
```bash
cd backend
npm install
```
Crear archivo `.env`:
```env
PORT=8080
DB_NAME=votaciones
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=tu_clave_secreta_super_segura
```
Iniciar el servidor:
```bash
npm run dev
```
El backend estará corriendo en `http://localhost:8080`

### 3. Configurar Frontend
```bash
cd fontend
npm install
```
Crear archivo `.env`:
```env
VITE_URL_API=http://localhost:8080/api
```
Iniciar la aplicación:
```bash
npm run dev
```
El frontend estará corriendo en `http://localhost:5173`
## 🗄️ Base de Datos
### Esquema Principal
- **usuariosistema** - Usuarios del sistema
- **ingeniero** - Perfiles de ingenieros
- **campania** - Campañas electorales
- **candidato** - Candidatos por campaña
- **votos** - Registro de votos
### Crear Base de Datos
```sql
CREATE DATABASE votaciones;
```
Las tablas se crean automáticamente al iniciar el backend gracias a Sequelize.
## 🔐 Variables de Entorno
### Backend (.env)
```env
PORT=8080
DB_NAME=nombre_base_datos
DB_USER=usuario
DB_PASSWORD=contraseña
DB_HOST=host
DB_PORT=5432
JWT_SECRET=clave_secreta_jwt
NODE_ENV=development
```
### Frontend (.env)
```env
VITE_URL_API=http://localhost:8080/api
```
### Producción (Netlify)
En el dashboard de Netlify, configurar:
- `VITE_URL_API=https://votaciones-d3zz.onrender.com/api`
## 📦 Scripts Disponibles
### Backend
```bash
npm run dev      # Modo desarrollo con hot-reload
npm run build    # Compilar TypeScript a JavaScript
npm start        # Ejecutar versión compilada
```
### Frontend
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
```

## 🌐 Deployment

### Frontend (Netlify)
1. Conectar repositorio de GitHub
2. Configurar build:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Base directory: `fontend`
3. Agregar variable de entorno `VITE_URL_API`

### Backend (Render)
1. Conectar repositorio de GitHub
2. Configurar:
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
   - Root directory: `backend`
3. Agregar variables de entorno desde el dashboard
