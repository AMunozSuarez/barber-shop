import React from 'react';
import StatsCard from './StatsCard';
import BarbersList from './BarbersList';
import '../../assets/styles/components/admin/AdminDashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      <div className="stats">
        <StatsCard title="Total Appointments" value={120} />
        <StatsCard title="Total Barbers" value={5} />
        <StatsCard title="Total Users" value={200} />
      </div>
      <h2>Barbers Management</h2>
      <BarbersList />
    </div>
  );
};

export default Dashboard;