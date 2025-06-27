# 🌐 Configuración MongoDB Atlas (Base de Datos en la Nube)

## 📋 Pasos para Obtener tu Cadena de Conexión

### 1. Crear Cuenta en MongoDB Atlas
1. Ve a: https://www.mongodb.com/atlas
2. Haz clic en "Try Free"
3. Crea tu cuenta gratuita

### 2. Crear un Cluster (Base de Datos)
1. Una vez logueado, haz clic en "Build a Database"
2. Selecciona "M0 Sandbox" (GRATIS)
3. Elige la región más cercana a ti
4. Dale un nombre a tu cluster (ej: "BarberShop")
5. Haz clic en "Create"

### 3. Configurar Seguridad

#### A) Crear Usuario de Base de Datos:
1. Ve a "Database Access" en el menú lateral
2. Haz clic en "Add New Database User"
3. Elige "Password" como método de autenticación
4. Crea un usuario y contraseña:
   - Usuario: `barber_admin`
   - Contraseña: `[genera una contraseña segura]`
5. En "Database User Privileges" selecciona "Read and write to any database"
6. Haz clic en "Add User"

#### B) Configurar IP Access:
1. Ve a "Network Access" en el menú lateral
2. Haz clic en "Add IP Address"
3. Selecciona "Allow Access from Anywhere" (0.0.0.0/0)
   - Esto es para desarrollo. En producción usa IPs específicas
4. Haz clic en "Confirm"

### 4. Obtener Cadena de Conexión
1. Ve a "Database" en el menú lateral
2. Haz clic en "Connect" en tu cluster
3. Selecciona "Connect your application"
4. Elige "Node.js" como driver
5. Copia la cadena de conexión que aparece

**La cadena se verá así:**
```
mongodb+srv://barber_admin:<password>@barbershop.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 5. Personalizar la Cadena
Reemplaza `<password>` con tu contraseña real y agrega el nombre de la base de datos:

**Formato final:**
```
mongodb+srv://barber_admin:tu_contraseña_real@barbershop.xxxxx.mongodb.net/barber_shop_db?retryWrites=true&w=majority
```

## 🔐 IMPORTANTE - Seguridad
- ❌ NUNCA compartas tu cadena de conexión
- ❌ NUNCA la subas a GitHub sin encriptar
- ✅ Úsala solo en archivos .env
- ✅ Agrega .env a tu .gitignore

## 📝 Ejemplo de Configuración Final
Tu archivo `.env.development` debería quedar así:

```
MONGODB_URI=mongodb+srv://barber_admin:tu_contraseña@barbershop.xxxxx.mongodb.net/barber_shop_db?retryWrites=true&w=majority
JWT_SECRET=barber_shop_jwt_secret_key_super_secure_2024
JWT_EXPIRE=30d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
``` 