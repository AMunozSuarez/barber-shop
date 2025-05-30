// Servicio para simular autenticación con almacenamiento local
// Utiliza localStorage para persistir la sesión del usuario

// Datos de usuario de ejemplo
const mockUsers = [
  {
    id: 1,
    username: 'usuario1',
    email: 'usuario1@example.com',
    password: 'password123',
    name: 'Juan Pérez',
    phone: '123456789',
    role: 'user',
    createdAt: '2023-01-15T12:00:00Z'
  },
  {
    id: 2,
    username: 'barber1',
    email: 'barber1@example.com',
    password: 'barber123',
    name: 'Carlos Rodríguez',
    phone: '987654321',
    role: 'barber',
    createdAt: '2023-01-10T10:00:00Z'
  },
  // {
  //   id: 3,
  //   username: 'admin',
  //   email: 'admin@example.com',
  //   password: 'admin123',
  //   name: 'Admin',
  //   phone: '555555555',
  //   role: 'admin',
  //   createdAt: '2023-01-01T09:00:00Z'
  // }
];

// Inicializar usuarios en localStorage si no existen
const initUsers = () => {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(mockUsers));
  }
  return JSON.parse(localStorage.getItem('users'));
};

// Obtener usuarios del localStorage
const getUsers = () => {
  return JSON.parse(localStorage.getItem('users') || '[]');
};

// Registrar un nuevo usuario
export const register = async (userData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Inicializar usuarios si es necesario
        initUsers();
        
        const users = getUsers();
        
        // Comprobar si el email o username ya existe
        if (users.find(user => user.email === userData.email)) {
          return reject({ message: 'Email ya registrado' });
        }
        
        if (users.find(user => user.username === userData.username)) {
          return reject({ message: 'Nombre de usuario ya registrado' });
        }

        // Crear nuevo usuario
        const newUser = {
          id: Date.now(),
          ...userData,
          role: 'user',
          createdAt: new Date().toISOString()
        };
        
        // Guardar el nuevo usuario
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Devolver respuesta exitosa (sin contraseña)
        const { password, ...userWithoutPassword } = newUser;
        resolve(userWithoutPassword);
      } catch (error) {
        reject({ message: 'Error al registrar usuario' });
      }
    }, 500); // Simular latencia de red
  });
};

// Alias para mantener compatibilidad
export const registerUser = register;

// Iniciar sesión
export const login = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Inicializar usuarios si es necesario
        initUsers();
        
        const users = getUsers();
        
        // Buscar usuario por email y verificar contraseña
        const user = users.find(user => user.email === email && user.password === password);
        
        if (user) {
          // Usuario encontrado
          const { password, ...userWithoutPassword } = user;
          
          // Guardar usuario en localStorage para mantener la sesión
          localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
          
          resolve(userWithoutPassword);
        } else {
          // Usuario no encontrado o contraseña incorrecta
          reject({ message: 'Credenciales inválidas' });
        }
      } catch (error) {
        reject({ message: 'Error al iniciar sesión' });
      }
    }, 500); // Simular latencia de red
  });
};

// Cerrar sesión
export const logout = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Eliminar usuario actual del localStorage
      localStorage.removeItem('currentUser');
      resolve(true);
    }, 300);
  });
};

// Obtener el usuario actual (desde localStorage)
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
};

// Obtener perfil de usuario
export const getUserProfile = async (userId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const users = getUsers();
        const user = users.find(u => u.id === userId);
        
        if (user) {
          // Usuario encontrado
          const { password, ...userWithoutPassword } = user;
          resolve(userWithoutPassword);
        } else {
          reject({ message: 'Usuario no encontrado' });
        }
      } catch (error) {
        reject({ message: 'Error al obtener perfil de usuario' });
      }
    }, 500);
  });
};

// Actualizar perfil de usuario
export const updateUserProfile = async (userId, userData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const users = getUsers();
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
          // Preservar datos que no se deben cambiar
          const updatedUser = {
            ...users[userIndex],
            ...userData,
            id: users[userIndex].id, // Asegurarse que ID no cambie
            role: users[userIndex].role // Asegurarse que rol no cambie
          };
          
          users[userIndex] = updatedUser;
          localStorage.setItem('users', JSON.stringify(users));
          
          // Actualizar usuario en sesión si es el usuario actual
          const currentUser = getCurrentUser();
          if (currentUser && currentUser.id === userId) {
            const { password, ...userWithoutPassword } = updatedUser;
            localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
          }
          
          const { password, ...userWithoutPassword } = updatedUser;
          resolve(userWithoutPassword);
        } else {
          reject({ message: 'Usuario no encontrado' });
        }
      } catch (error) {
        reject({ message: 'Error al actualizar perfil' });
      }
    }, 500);
  });
};

const AuthMockService = {
  register,
  login,
  logout,
  getCurrentUser,
  getUserProfile,
  updateUserProfile
};

export default AuthMockService;
