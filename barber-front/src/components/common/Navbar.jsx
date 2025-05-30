import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../assets/styles/components/NavbarUpdated.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      // No es necesario redirigir, ya que useAuth actualizará isAuthenticated
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Barber Shop</Link>
      </div>
      
      <div className="menu-toggle" onClick={toggleMenu}>
        <div className={`hamburger ${menuOpen ? 'active' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      
      <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <li>
          <Link to="/appointment" onClick={() => setMenuOpen(false)}>Agendar Cita</Link>
        </li>
        
        {isAuthenticated ? (
          <>
            <li>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>Mi Perfil</Link>
            </li>
            {user?.role === 'admin' && (
              <li>
                <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)}>Administración</Link>
              </li>
            )}
            {user?.role === 'barber' && (
              <li>
                <Link to="/barber-profile" onClick={() => setMenuOpen(false)}>Panel Barbero</Link>
              </li>
            )}
            <li>
              <button className="logout-button" onClick={() => { handleLogout(); setMenuOpen(false); }}>
                Cerrar Sesión
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/auth/login" onClick={() => setMenuOpen(false)}>Iniciar Sesión</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;