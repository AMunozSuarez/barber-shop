import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../assets/styles/pages/Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home">
      <header className="home-header">
        <h1>Bienvenido al Sistema de Gestión de Barbería</h1>
        <p>Tu solución integral para gestionar citas y barberos.</p>
      </header>
      <main className="home-main">
        <section className="home-appointment">
          <h2>Reserva una Cita</h2>
          <Link to="/appointment" className="home-button">Agendar Ahora</Link>
        </section>
        <section className="home-profile">
          <h2>Gestiona tu Perfil</h2>
          {isAuthenticated ? (
            <Link to="/profile" className="home-button">Mi Perfil</Link>
          ) : (
            <Link to="/auth/login" className="home-button">Iniciar Sesión</Link>
          )}
        </section>
        {isAuthenticated && user?.role === 'admin' && (
          <section className="home-admin">
            <h2>Administración</h2>
            <Link to="/admin/dashboard" className="home-button">Panel de Administración</Link>
          </section>
        )}
      </main>
      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} Barber Shop. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Home;