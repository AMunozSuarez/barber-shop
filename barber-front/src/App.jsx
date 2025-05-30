import { Route, Routes, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import BarberManagement from './pages/admin/BarberManagement';
import Dashboard from './pages/admin/Dashboard';
import Appointment from './pages/booking/Appointment';
import Confirmation from './pages/booking/Confirmation';
import NotFound from './pages/NotFound';
import UserProfile from './pages/profile/UserProfile';
import BarberProfile from './pages/profile/BarberProfile';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <Routes>      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/appointment" replace />} />
        <Route path="appointment" element={<Appointment />} />
        <Route path="confirmation" element={<Confirmation />} />
        <Route path="profile" element={
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        } />
        <Route path="barber-profile" element={
          <PrivateRoute>
            <BarberProfile />
          </PrivateRoute>
        } />
      </Route>
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
      <Route path="/admin" element={
        <PrivateRoute>
          <AdminLayout />
        </PrivateRoute>
      }>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="barber-management" element={<BarberManagement />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;