import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { barberService } from '../../services/barber.service';
import './BarberProfile.css';

const BarberProfile = () => {
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await barberService.getBarberProfile(user.id);
        setProfileData(data);
      } catch (err) {
        setError('Error fetching profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user.id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="barber-profile">
      <h1>{profileData.name}'s Profile</h1>
      <img src={profileData.avatar} alt={`${profileData.name}'s avatar`} />
      <p>Email: {profileData.email}</p>
      <p>Phone: {profileData.phone}</p>
      <p>Experience: {profileData.experience} years</p>
      <button>Edit Profile</button>
    </div>
  );
};

export default BarberProfile;