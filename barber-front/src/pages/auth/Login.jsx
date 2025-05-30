import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../assets/styles/pages/auth/Auth.css';
import '../../assets/styles/components/auth/AuthForm.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      navigate('/'); // Redirigir a home después del inicio de sesión exitoso
    } catch (err) {
      setError('Credenciales inválidas. Por favor, verifica tu email y contraseña.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-image">
          <h2>Bienvenido de Nuevo</h2>
          <p>Nos alegra verte otra vez. Accede a tu cuenta para gestionar tus citas y más.</p>
        </div>
        <div className="auth-form-container">
          <div className="auth-header">
            <div className="auth-logo">
              <span className="auth-title">Barber Link</span>
            </div>
            <h2 className="auth-title">Iniciar Sesión</h2>
            <p className="auth-subtitle">Ingresa tus credenciales para acceder a tu cuenta</p>
          </div>
          
          <div className="auth-form">
            {error && <div className="form-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
                <input
                  className="form-input"
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <input
                  className="form-input"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button 
                className="form-submit" 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>
            
            <div className="form-footer">
              <p>¿No tienes una cuenta? <Link to="/auth/register">Regístrate</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;