import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import '../assets/styles/layouts/AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Navbar />
      <main className="admin-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AdminLayout;