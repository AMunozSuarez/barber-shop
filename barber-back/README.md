# Barber Shop Backend API

API REST para sistema de gestión de barbería desarrollado con Node.js, Express y MongoDB.

## 🚀 Características

- **Autenticación JWT**: Sistema seguro de autenticación y autorización
- **Gestión de Usuarios**: Clientes, barberos y administradores
- **Sistema de Citas**: Programación y gestión de citas
- **Gestión de Servicios**: CRUD completo de servicios de barbería
- **Dashboard**: Estadísticas y métricas en tiempo real
- **Validaciones**: Middleware de validación para todos los endpoints
- **Manejo de Errores**: Sistema robusto de manejo de errores

## 📋 Prerrequisitos

- Node.js 18+ 
- MongoDB 4.4+
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd barber-back
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crear archivo `.env.development`:
   ```env
   # Base de datos
   MONGODB_URI=mongodb://localhost:27017/barber_shop_db
   
   # JWT
   JWT_SECRET=tu_jwt_secret_super_secreto_y_largo
   JWT_EXPIRE=30d
   
   # Servidor
   PORT=5000
   NODE_ENV=development
   
   # CORS
   FRONTEND_URL=http://localhost:3000
   ```

4. **Verificar configuración**
   ```bash
   node src/scripts/init-server.js
   ```

5. **Cargar datos de prueba (opcional)**
   ```bash
   npm run seed
   ```

## 🎯 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm start` | Ejecutar en producción |
| `npm run dev` | Ejecutar en modo desarrollo con nodemon |
| `npm run seed` | Cargar datos de prueba |
| `npm test` | Ejecutar tests (pendiente) |

## 📚 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener perfil actual
- `PUT /api/auth/updateprofile` - Actualizar perfil

### Usuarios (Admin)
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Barberos
- `GET /api/barbers` - Listar barberos (público)
- `GET /api/barbers/:id` - Obtener barbero (público)
- `GET /api/barbers/:id/availability` - Disponibilidad del barbero
- `POST /api/barbers` - Crear barbero (admin)
- `PUT /api/barbers/:id` - Actualizar barbero
- `DELETE /api/barbers/:id` - Eliminar barbero (admin)
- `POST /api/barbers/:id/reviews` - Agregar reseña

### Servicios
- `GET /api/services` - Listar servicios (público)
- `GET /api/services/:id` - Obtener servicio (público)
- `POST /api/services` - Crear servicio (admin)
- `PUT /api/services/:id` - Actualizar servicio (admin)
- `DELETE /api/services/:id` - Eliminar servicio (admin)

### Citas
- `GET /api/appointments` - Listar todas las citas (admin)
- `GET /api/appointments/me` - Mis citas (cliente)
- `GET /api/appointments/barber/me` - Citas del barbero
- `GET /api/appointments/:id` - Obtener cita específica
- `POST /api/appointments` - Crear cita
- `PUT /api/appointments/:id/status` - Actualizar estado
- `PUT /api/appointments/:id/notes` - Agregar notas

### Dashboard
- `GET /api/dashboard/stats` - Estadísticas generales (admin)
- `GET /api/dashboard/barber/stats` - Estadísticas del barbero
- `GET /api/dashboard/recent-appointments` - Citas recientes (admin)
- `GET /api/dashboard/barber/:barberId/available-slots` - Horarios disponibles

## 🔐 Autenticación

La API usa JWT para autenticación. Incluir el token en el header:

```
Authorization: Bearer <token>
```

### Roles de Usuario

- **client**: Clientes que pueden agendar citas
- **barber**: Barberos que gestionan sus citas y horarios
- **admin**: Administradores con acceso completo

## 📊 Modelos de Datos

### Usuario
```javascript
{
  name: String,
  email: String (único),
  password: String (encriptado),
  phone: String,
  role: ['client', 'barber', 'admin']
}
```

### Barbero
```javascript
{
  user: ObjectId (ref: User),
  specialty: String,
  experience: Number,
  bio: String,
  availability: [{
    day: String,
    startTime: String,
    endTime: String,
    isAvailable: Boolean
  }],
  services: [ObjectId] (ref: Service),
  rating: Number,
  reviews: [{
    user: ObjectId,
    rating: Number,
    comment: String
  }]
}
```

### Servicio
```javascript
{
  name: String,
  description: String,
  price: Number,
  duration: Number (minutos),
  category: ['haircut', 'beard', 'combo', 'special', 'other'],
  isActive: Boolean
}
```

### Cita
```javascript
{
  client: ObjectId (ref: User),
  barber: ObjectId (ref: Barber),
  service: ObjectId (ref: Service),
  date: Date,
  startTime: String,
  endTime: String,
  status: ['pending', 'confirmed', 'completed', 'cancelled'],
  notes: String,
  price: Number,
  paymentStatus: ['pending', 'paid', 'refunded']
}
```

## 🛡️ Validaciones

El sistema incluye validaciones para:

- Registro de usuarios (email, contraseña, teléfono)
- Creación de citas (fechas, horarios, disponibilidad)
- Gestión de servicios (precios, duración, categorías)
- Perfiles de barberos (especialidades, horarios)
- Estados de citas y reseñas

## 🐛 Manejo de Errores

Responses de error estándar:

```javascript
{
  success: false,
  error: "Mensaje de error",
  details: ["Detalles específicos"] // Para errores de validación
}
```

## 🔧 Desarrollo

### Estructura del Proyecto
```
src/
├── config/          # Configuraciones
├── controllers/     # Lógica de negocio
├── middleware/      # Middleware personalizado
├── models/          # Modelos de MongoDB
├── routes/          # Definición de rutas
├── scripts/         # Scripts de utilidad
└── utils/           # Funciones auxiliares
```

### Agregar Nuevas Funcionalidades

1. Crear modelo en `/models`
2. Implementar controlador en `/controllers`
3. Definir rutas en `/routes`
4. Agregar validaciones en `/middleware`
5. Actualizar documentación

## 🚀 Despliegue

### Variables de Entorno para Producción
```env
NODE_ENV=production
MONGODB_URI=mongodb://usuario:contraseña@host:puerto/base_datos
JWT_SECRET=clave_super_secreta_production
FRONTEND_URL=https://tu-dominio.com
PORT=5000
```

### Docker (Opcional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📞 Soporte

Para reportar bugs o solicitar nuevas características, crear un issue en el repositorio.

## 📄 Licencia

Este proyecto está bajo la licencia MIT. 