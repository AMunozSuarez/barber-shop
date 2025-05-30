import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Puedes mostrar un componente de carga aquí si lo deseas
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    // Redirigir al login si no está autenticado, guardando la ubicación actual
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
