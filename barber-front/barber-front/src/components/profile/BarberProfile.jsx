import { useState, useEffect } from 'react';
import { getBarberProfile } from '../../services/barber.service';
import './BarberProfile.css';

function BarberProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getBarberProfile();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="barber-profile">
      <h1>{profile.name}'s Profile</h1>
      <img src={profile.avatar} alt={`${profile.name}'s avatar`} />
      <p>Email: {profile.email}</p>
      <p>Phone: {profile.phone}</p>
      <p>Experience: {profile.experience} years</p>
      <button>Edit Profile</button>
    </div>
  );
}

export default BarberProfile;