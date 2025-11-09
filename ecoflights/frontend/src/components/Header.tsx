import React from 'react';
import { LeafIcon, UserCircleIcon } from './icons/Icons';
import './Header.css';
import AboutUs from './AboutUs';

interface HeaderProps {
  isLoggedIn: boolean;
  onAccountClick: () => void;
  onLogoClick: () => void;
  onAboutClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onAccountClick, onLogoClick, onAboutClick }) => {
  return (
    <header className="header">
      <div className="container header-container">
        <button onClick={onLogoClick} className="logo-button">
          <LeafIcon className="logo-icon" />
          <span>EcoFlights</span>
        </button>
        
        <div className="nav-buttons">
          <button onClick={onAboutClick} className="nav-link-button">
            <AboutUs className="button-icon" />
            About Us
          </button>
          <button onClick={onAccountClick} className="account-button">
            <UserCircleIcon className="button-icon" />
            <span className="button-text">
              {isLoggedIn ? 'My Account' : 'Log In / Sign Up'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;