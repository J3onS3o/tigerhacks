import React from 'react';
import { LeafIcon } from './icons/Icons';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="logo">
          <LeafIcon className="logo-icon" />
          <span>EcoFlights</span>
        </div>
        <p className="copyright">&copy; {new Date().getFullYear()} EcoFlights. All rights reserved.</p>
        <nav className="nav">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;