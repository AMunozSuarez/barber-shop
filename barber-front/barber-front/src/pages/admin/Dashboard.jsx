import React from 'react';
import BarbersList from '../../components/admin/BarbersList';
import StatsCard from '../../components/admin/StatsCard';

const Dashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <StatsCard />
      <BarbersList />
    </div>
  );
};

export default Dashboard;