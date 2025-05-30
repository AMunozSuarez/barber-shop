import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;