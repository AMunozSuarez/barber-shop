// Servicio mock para operaciones relacionadas con barberos
import { getCurrentUser } from './authMock.service';

// Datos mock de barberos con información detallada
const mockBarbers = [
  { 
    id: 1, 
    userId: 2, // Relacionado con usuario barber1 en authMock
    name: 'Carlos Rodríguez',
    email: 'barber1@example.com',
    phone: '987654321',
    specialty: 'Cortes clásicos', 
    image: '/images/barber1.jpg',
    experience: 5,
    rating: 4.8,
    reviews: 120,
    bio: 'Especialista en cortes clásicos con 5 años de experiencia.',
    availability: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    services: [
      { id: 1, name: 'Corte de cabello', duration: 30, price: 15 },
      { id: 2, name: 'Afeitado', duration: 20, price: 10 },
      { id: 3, name: 'Corte y barba', duration: 45, price: 22 }
    ]
  },
  { 
    id: 2, 
    userId: null, // Sin usuario asociado aún
    name: 'Miguel Sánchez', 
    specialty: 'Degradados y diseños', 
    email: 'miguel@example.com',
    phone: '123789456',
    image: '/images/barber2.jpg',
    experience: 3,
    rating: 4.9,
    reviews: 95,
    bio: 'Experto en degradados y diseños personalizados.',
    availability: ['monday', 'wednesday', 'friday', 'saturday'],
    services: [
      { id: 1, name: 'Corte de cabello', duration: 30, price: 15 },
      { id: 2, name: 'Degradado', duration: 35, price: 18 },
      { id: 4, name: 'Diseño personalizado', duration: 60, price: 30 }
    ]
  },
  { 
    id: 3, 
    userId: null, // Sin usuario asociado aún
    name: 'Juan Martínez', 
    specialty: 'Barbas y bigotes', 
    email: 'juan@example.com',
    phone: '456123789',
    image: '/images/barber3.jpg',
    experience: 7,
    rating: 4.7,
    reviews: 87,
    bio: 'Especialista en barbas y bigotes con 7 años de experiencia.',
    availability: ['tuesday', 'thursday', 'saturday', 'sunday'],
    services: [
      { id: 2, name: 'Afeitado', duration: 20, price: 10 },
      { id: 3, name: 'Arreglo de barba', duration: 25, price: 12 },
      { id: 5, name: 'Tratamiento facial', duration: 40, price: 25 }
    ]
  }
];

// Datos mock de citas para barberos
const mockBarberAppointments = [
  {
    id: 1,
    barberId: 1,
    userId: 1,
    userName: 'Juan Pérez',
    userPhone: '123456789',
    service: 'Corte de cabello',
    date: '2025-05-30',
    time: '10:00',
    duration: 30,
    status: 'confirmed',
    price: 15,
    notes: ''
  },
  {
    id: 2,
    barberId: 1,
    userId: null,
    userName: 'Pedro González',
    userPhone: '456789123',
    service: 'Afeitado',
    date: '2025-05-30',
    time: '11:00',
    duration: 20,
    status: 'confirmed',
    price: 10,
    notes: 'Cliente nuevo'
  },
  {
    id: 3,
    barberId: 1,
    userId: 1,
    userName: 'Juan Pérez',
    userPhone: '123456789',
    service: 'Corte y barba',
    date: '2025-06-01',
    time: '14:00',
    duration: 45,
    status: 'confirmed',
    price: 22,
    notes: ''
  },
  {
    id: 4,
    barberId: 2,
    userId: null,
    userName: 'Luis Morales',
    userPhone: '789123456',
    service: 'Degradado',
    date: '2025-05-29',
    time: '16:00',
    duration: 35,
    status: 'confirmed',
    price: 18,
    notes: ''
  },
  {
    id: 5,
    barberId: 1,
    userId: 1,
    userName: 'Juan Pérez',
    userPhone: '123456789',
    service: 'Corte de cabello',
    date: '2025-05-25',
    time: '10:00',
    duration: 30,
    status: 'completed',
    price: 15,
    notes: ''
  }
];

// Inicializar en localStorage
const initBarberData = () => {
  if (!localStorage.getItem('barbers')) {
    localStorage.setItem('barbers', JSON.stringify(mockBarbers));
  }
  if (!localStorage.getItem('barberAppointments')) {
    localStorage.setItem('barberAppointments', JSON.stringify(mockBarberAppointments));
  }
  return {
    barbers: JSON.parse(localStorage.getItem('barbers') || '[]'),
    appointments: JSON.parse(localStorage.getItem('barberAppointments') || '[]')
  };
};

// Obtener el perfil del barbero actualmente autenticado
export const getBarberProfile = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const { barbers } = initBarberData();
        const currentUser = getCurrentUser();
        
        if (!currentUser || currentUser.role !== 'barber') {
          reject({ message: 'Usuario no autorizado o no es un barbero' });
          return;
        }
        
        const barberProfile = barbers.find(barber => barber.userId === currentUser.id);
        
        if (barberProfile) {
          resolve(barberProfile);
        } else {
          reject({ message: 'Perfil de barbero no encontrado' });
        }
      } catch (error) {
        reject({ message: 'Error al obtener perfil de barbero' });
      }
    }, 500);
  });
};

// Actualizar perfil de barbero
export const updateBarberProfile = async (barberData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const { barbers } = initBarberData();
        const currentUser = getCurrentUser();
        
        if (!currentUser || currentUser.role !== 'barber') {
          reject({ message: 'Usuario no autorizado o no es un barbero' });
          return;
        }
        
        const barberIndex = barbers.findIndex(barber => barber.userId === currentUser.id);
        
        if (barberIndex !== -1) {
          // Actualizar solo los campos permitidos
          const updatedBarber = {
            ...barbers[barberIndex],
            name: barberData.name || barbers[barberIndex].name,
            phone: barberData.phone || barbers[barberIndex].phone,
            specialty: barberData.specialty || barbers[barberIndex].specialty,
            bio: barberData.bio || barbers[barberIndex].bio,
            availability: barberData.availability || barbers[barberIndex].availability,
            services: barberData.services || barbers[barberIndex].services
          };
          
          barbers[barberIndex] = updatedBarber;
          localStorage.setItem('barbers', JSON.stringify(barbers));
          
          resolve(updatedBarber);
        } else {
          reject({ message: 'Perfil de barbero no encontrado' });
        }
      } catch (error) {
        reject({ message: 'Error al actualizar perfil de barbero' });
      }
    }, 500);
  });
};

// Obtener citas del barbero actualmente autenticado
export const getBarberAppointments = async (filters = {}) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const { appointments } = initBarberData();
        const currentUser = getCurrentUser();
        
        if (!currentUser || currentUser.role !== 'barber') {
          reject({ message: 'Usuario no autorizado o no es un barbero' });
          return;
        }
        
        // Obtener el barberId asociado al usuario
        const { barbers } = initBarberData();
        const barberProfile = barbers.find(barber => barber.userId === currentUser.id);
        
        if (!barberProfile) {
          reject({ message: 'Perfil de barbero no encontrado' });
          return;
        }
        
        let filteredAppointments = appointments.filter(
          appointment => appointment.barberId === barberProfile.id
        );
        
        // Aplicar filtros si existen
        if (filters.date) {
          filteredAppointments = filteredAppointments.filter(
            appointment => appointment.date === filters.date
          );
        }
        
        if (filters.status) {
          filteredAppointments = filteredAppointments.filter(
            appointment => appointment.status === filters.status
          );
        }
        
        // Ordenar por fecha y hora
        filteredAppointments.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`);
          const dateB = new Date(`${b.date}T${b.time}`);
          return dateA - dateB;
        });
        
        resolve(filteredAppointments);
      } catch (error) {
        reject({ message: 'Error al obtener citas de barbero' });
      }
    }, 500);
  });
};

// Actualizar estado de una cita
export const updateAppointmentStatus = async (appointmentId, status) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const { appointments } = initBarberData();
        const currentUser = getCurrentUser();
        
        if (!currentUser || currentUser.role !== 'barber') {
          reject({ message: 'Usuario no autorizado o no es un barbero' });
          return;
        }
        
        // Obtener el barberId asociado al usuario
        const { barbers } = initBarberData();
        const barberProfile = barbers.find(barber => barber.userId === currentUser.id);
        
        if (!barberProfile) {
          reject({ message: 'Perfil de barbero no encontrado' });
          return;
        }
        
        const appointmentIndex = appointments.findIndex(
          appointment => appointment.id === appointmentId && appointment.barberId === barberProfile.id
        );
        
        if (appointmentIndex !== -1) {
          appointments[appointmentIndex].status = status;
          localStorage.setItem('barberAppointments', JSON.stringify(appointments));
          resolve(appointments[appointmentIndex]);
        } else {
          reject({ message: 'Cita no encontrada o no pertenece a este barbero' });
        }
      } catch (error) {
        reject({ message: 'Error al actualizar estado de cita' });
      }
    }, 500);
  });
};

// Agregar nota a una cita
export const addAppointmentNote = async (appointmentId, note) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const { appointments } = initBarberData();
        const currentUser = getCurrentUser();
        
        if (!currentUser || currentUser.role !== 'barber') {
          reject({ message: 'Usuario no autorizado o no es un barbero' });
          return;
        }
        
        // Obtener el barberId asociado al usuario
        const { barbers } = initBarberData();
        const barberProfile = barbers.find(barber => barber.userId === currentUser.id);
        
        if (!barberProfile) {
          reject({ message: 'Perfil de barbero no encontrado' });
          return;
        }
        
        const appointmentIndex = appointments.findIndex(
          appointment => appointment.id === appointmentId && appointment.barberId === barberProfile.id
        );
        
        if (appointmentIndex !== -1) {
          appointments[appointmentIndex].notes = note;
          localStorage.setItem('barberAppointments', JSON.stringify(appointments));
          resolve(appointments[appointmentIndex]);
        } else {
          reject({ message: 'Cita no encontrada o no pertenece a este barbero' });
        }
      } catch (error) {
        reject({ message: 'Error al agregar nota a cita' });
      }
    }, 500);
  });
};

// Obtener estadísticas de barbero
export const getBarberStats = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const { appointments } = initBarberData();
        const currentUser = getCurrentUser();
        
        if (!currentUser || currentUser.role !== 'barber') {
          reject({ message: 'Usuario no autorizado o no es un barbero' });
          return;
        }
        
        // Obtener el barberId asociado al usuario
        const { barbers } = initBarberData();
        const barberProfile = barbers.find(barber => barber.userId === currentUser.id);
        
        if (!barberProfile) {
          reject({ message: 'Perfil de barbero no encontrado' });
          return;
        }
        
        const barberAppointments = appointments.filter(
          appointment => appointment.barberId === barberProfile.id
        );
        
        // Calcular estadísticas
        const totalAppointments = barberAppointments.length;
        const completedAppointments = barberAppointments.filter(a => a.status === 'completed').length;
        const upcomingAppointments = barberAppointments.filter(a => a.status === 'confirmed').length;
        const cancelledAppointments = barberAppointments.filter(a => a.status === 'cancelled').length;
        
        // Calcular ingresos
        const totalRevenue = barberAppointments
          .filter(a => a.status === 'completed')
          .reduce((sum, a) => sum + a.price, 0);
        
        // Calcular citas por día de la semana
        const appointmentsByDay = {
          monday: 0,
          tuesday: 0,
          wednesday: 0,
          thursday: 0,
          friday: 0,
          saturday: 0,
          sunday: 0
        };
        
        barberAppointments.forEach(appointment => {
          const date = new Date(appointment.date);
          const day = date.getDay(); // 0 = domingo, 1 = lunes, etc.
          
          const dayMap = {
            0: 'sunday',
            1: 'monday',
            2: 'tuesday',
            3: 'wednesday',
            4: 'thursday',
            5: 'friday',
            6: 'saturday'
          };
          
          appointmentsByDay[dayMap[day]]++;
        });
        
        resolve({
          totalAppointments,
          completedAppointments,
          upcomingAppointments,
          cancelledAppointments,
          totalRevenue,
          appointmentsByDay
        });
      } catch (error) {
        reject({ message: 'Error al obtener estadísticas de barbero' });
      }
    }, 500);
  });
};

// Exportar todas las funciones
const BarberMockService = {
  getBarberProfile,
  updateBarberProfile,
  getBarberAppointments,
  updateAppointmentStatus,
  addAppointmentNote,
  getBarberStats
};

export default BarberMockService;
