// Este archivo está obsoleto y ya no se utiliza en la aplicación.
// Las rutas ahora se configuran directamente en App.jsx.
// Conservamos este archivo como referencia, pero no lo importamos en ninguna parte.

import { Route } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Appointment from './pages/booking/Appointment';
import Confirmation from './pages/booking/Confirmation';
import BarberManagement from './pages/admin/BarberManagement';
import Dashboard from './pages/admin/Dashboard';
import Settings from './pages/admin/Settings';
import BarberProfile from './pages/profile/BarberProfile';
import UserProfile from './pages/profile/UserProfile';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Ejemplo de estructura de rutas (NO SE USA ACTUALMENTE)
const RoutesExample = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "appointment", element: <Appointment /> },
      { path: "confirmation", element: <Confirmation /> }
    ]
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> }
    ]
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "barber-management", element: <BarberManagement /> },
      { path: "settings", element: <Settings /> }
    ]
  },
  {
    path: "/profile",
    element: <MainLayout />,
    children: [
      { path: "user", element: <UserProfile /> },
      { path: "barber/:id", element: <BarberProfile /> }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
];

export default RoutesExample;