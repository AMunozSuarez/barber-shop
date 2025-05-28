import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" exact>
          <AuthLayout>
            <Login />
          </AuthLayout>
        </Route>
        <Route path="/register" exact>
          <AuthLayout>
            <Register />
          </AuthLayout>
        </Route>
        <Route path="/appointment" exact>
          <MainLayout>
            <Appointment />
          </MainLayout>
        </Route>
        <Route path="/confirmation" exact>
          <MainLayout>
            <Confirmation />
          </MainLayout>
        </Route>
        <Route path="/admin/barbers" exact>
          <AdminLayout>
            <BarberManagement />
          </AdminLayout>
        </Route>
        <Route path="/admin/dashboard" exact>
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        </Route>
        <Route path="/admin/settings" exact>
          <AdminLayout>
            <Settings />
          </AdminLayout>
        </Route>
        <Route path="/profile/barber" exact>
          <MainLayout>
            <BarberProfile />
          </MainLayout>
        </Route>
        <Route path="/profile/user" exact>
          <MainLayout>
            <UserProfile />
          </MainLayout>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
};

export default Routes;