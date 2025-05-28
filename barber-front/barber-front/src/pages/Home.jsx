import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Assuming you will create a Home.css for styling

const Home = () => {
  return (
    <div className="home">
      <header className="home-header">
        <h1>Welcome to the Barber Shop Management System</h1>
        <p>Your one-stop solution for managing appointments and barbers.</p>
      </header>
      <main className="home-main">
        <section className="home-appointment">
          <h2>Book an Appointment</h2>
          <Link to="/booking/Appointment" className="home-button">Schedule Now</Link>
        </section>
        <section className="home-profile">
          <h2>Manage Your Profile</h2>
          <Link to="/auth/Login" className="home-button">Login</Link>
        </section>
      </main>
      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} Barber Shop. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;