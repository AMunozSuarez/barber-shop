import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../assets/styles/pages/auth/Auth.css';
import '../../assets/styles/components/auth/AuthForm.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      await register(formData);
      navigate('/auth/login', { 
        state: { message: 'Cuenta creada exitosamente. Por favor, inicia sesión.' } 
      });
    } catch (err) {
      setError(err.message || 'Error al registrar usuario. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-image">
          <h2>Únete a Nuestra Comunidad</h2>
          <p>Crea una cuenta para disfrutar de servicios premium de barbería y gestionar fácilmente tus citas.</p>
        </div>
        <div className="auth-form-container">
          <div className="auth-header">
            <div className="auth-logo">
              <img src="/assets/images/logo.png" alt="Barber Shop Logo" />
              <span className="auth-title">Barber Shop</span>
            </div>
            <h2 className="auth-title">Crear Cuenta</h2>
            <p className="auth-subtitle">Completa tus datos para comenzar</p>
          </div>
          
          <div className="auth-form">
            {error && <div className="form-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="username">Nombre de usuario</label>
                <input
                  className="form-input"
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Nombre completo</label>
                <input
                  className="form-input"
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
                <input
                  className="form-input"
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="password">Contraseña</label>
                <input
                  className="form-input"
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="phone">Teléfono</label>
                <input
                  className="form-input"
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <button 
                className="form-submit" 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Procesando...' : 'Crear Cuenta'}
              </button>
            </form>
            
            <div className="form-footer">
              <p>¿Ya tienes una cuenta? <Link to="/auth/login">Iniciar Sesión</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;