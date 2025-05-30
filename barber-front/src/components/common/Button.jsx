import React from 'react';
import PropTypes from 'prop-types';
import '../../assets/styles/components/Button.css'; // Assuming you will create a CSS file for button styles

const Button = ({ onClick, children, type = 'button', className = '' }) => {
  return (
    <button type={type} onClick={onClick} className={`custom-button ${className}`}>
      {children}
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
};

export default Button;