import React from 'react';
import '../../assets/styles/components/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-container">
          <div className="footer-column">
            <h3>About Us</h3>
            <p>We are a premium barber shop dedicated to providing the best grooming experience for men.</p>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
          
          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/booking">Book Now</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Services</h3>
            <ul className="footer-links">
              <li><a href="/services">Haircut</a></li>
              <li><a href="/services">Beard Trim</a></li>
              <li><a href="/services">Hot Towel Shave</a></li>
              <li><a href="/services">Hair Styling</a></li>
              <li><a href="/services">Kids Haircut</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Contact Info</h3>
            <ul className="footer-links">
              <li>123 Barber Street, City</li>
              <li>Phone: (123) 456-7890</li>
              <li>Email: info@barbershop.com</li>
              <li>Mon-Fri: 9am - 9pm</li>
              <li>Sat-Sun: 10am - 6pm</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Barber Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;