# 🪒 Barber Shop Software

Sistema completo de gestión para barberías con backend en Node.js/MongoDB y frontend en React/Vite.

## 🚀 Características

- **Gestión de citas**: Reserva, cancelación y seguimiento de citas
- **Perfiles de barberos**: Gestión de disponibilidad y servicios
- **Panel de administración**: Estadísticas y gestión de usuarios
- **Autenticación segura**: JWT con roles de usuario y barbero
- **Interfaz moderna**: Diseño responsive y accesible

## 📋 Requisitos Previos

- Node.js 18+ 
- MongoDB Atlas (base de datos en la nube)
- Git

## 🔧 Configuración del Proyecto

### 1. Clonar el repositorio
```bash
git clone https://github.com/AMunozSuarez/barber-shop.git
cd barber-shop
```

### 2. Configurar Backend

```bash
cd barber-back
npm install
```

**Crear archivo de variables de entorno:**
```bash
cp .env.example .env.development
```

**Editar `.env.development` con tus valores:**
```env
PORT=5000
MONGODB_URI=mongodb+srv://tu_usuario:tu_password@tu_cluster.mongodb.net/barber_shop
JWT_SECRET=tu_clave_secreta_muy_larga_y_segura_aqui
CORS_ORIGIN=http://localhost:5173
```

### 3. Configurar Frontend

```bash
cd ../barber-front
npm install
```

### 4. Configurar MongoDB Atlas

1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crear un cluster gratuito
3. Crear usuario de base de datos
4. Obtener la URI de conexión
5. Reemplazar en `.env.development`

### 5. Ejecutar el proyecto

**Backend:**
```bash
cd barber-back
npm run dev
```

**Frontend (nueva terminal):**
```bash
cd barber-front
npm run dev
```

## 🔐 Seguridad

### Variables de Entorno Importantes

- **JWT_SECRET**: Debe ser la misma en todos los entornos para que los tokens funcionen
- **MONGODB_URI**: URI de conexión a MongoDB Atlas
- **CORS_ORIGIN**: URL del frontend para permitir conexiones

### Archivos Protegidos

El proyecto incluye un `.gitignore` completo que protege:
- Archivos `.env` y variables de entorno
- Claves y certificados
- Logs y archivos temporales
- Dependencias (`node_modules`)

## 🚨 Solución de Problemas

### Error de conexión a MongoDB
- Verificar que la URI de MongoDB Atlas sea correcta
- Asegurar que la IP esté en la whitelist de MongoDB Atlas
- Verificar credenciales de usuario

### Error de autenticación JWT
- **IMPORTANTE**: Usar el mismo `JWT_SECRET` en todos los entornos
- Si cambias el `JWT_SECRET`, todos los usuarios tendrán que volver a iniciar sesión

### Error 400 en registro de usuario
- Verificar que el formato del teléfono sea correcto
- Asegurar que todos los campos requeridos estén completos

## 📁 Estructura del Proyecto

```
barber-shop/
├── barber-back/          # Backend Node.js
│   ├── src/
│   │   ├── controllers/  # Controladores de la API
│   │   ├── models/       # Modelos de MongoDB
│   │   ├── routes/       # Rutas de la API
│   │   └── middleware/   # Middleware de autenticación
│   └── .env.development  # Variables de entorno
├── barber-front/         # Frontend React
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── pages/        # Páginas de la aplicación
│   │   └── services/     # Servicios de API
│   └── package.json
└── README.md
```

## 🔄 Configuración en Otro Ordenador

1. Clonar el repositorio
2. Instalar dependencias (`npm install` en ambos directorios)
3. **Crear `.env.development`** en `barber-back/` usando `.env.example` como plantilla
4. **Usar el mismo `JWT_SECRET`** que en el ordenador original
5. Configurar MongoDB Atlas con la misma URI
6. Ejecutar el proyecto

## 📝 Scripts Disponibles

### Backend
- `npm run dev`: Ejecutar en modo desarrollo
- `npm run start`: Ejecutar en modo producción
- `npm run seed`: Poblar base de datos con datos de prueba

### Frontend
- `npm run dev`: Ejecutar servidor de desarrollo
- `npm run build`: Construir para producción
- `npm run preview`: Previsualizar build de producción

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Si tienes problemas:
1. Verificar que todas las variables de entorno estén configuradas
2. Asegurar que MongoDB Atlas esté funcionando
3. Revisar los logs del servidor para errores específicos
4. Verificar que el `JWT_SECRET` sea el mismo en todos los entornos 