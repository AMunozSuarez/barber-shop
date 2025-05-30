import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/pages/NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="not-found-link">Go back to Home</Link>
    </div>
  );
};

export default NotFound;