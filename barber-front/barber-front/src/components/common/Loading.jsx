import React from 'react';
import './Loading.css'; // Assuming you will create a CSS file for loading styles

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default Loading;