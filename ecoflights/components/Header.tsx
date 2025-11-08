import React from 'react';
import { LeafIcon, UserCircleIcon } from './icons/Icons';
import './Header.css';

interface HeaderProps {
  isLoggedIn: boolean;
  onAccountClick: () => void;
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onAccountClick, onLogoClick }) => {
  return (
    <header className="header">
      <div className="container header-container">
        <button onClick={onLogoClick} className="logo-button">
          <LeafIcon className="logo-icon" />
          <span>EcoFlights</span>
        </button>
        <button onClick={onAccountClick} className="account-button">
          <UserCircleIcon className="button-icon" />
          <span className="button-text">{isLoggedIn ? 'My Account' : 'Log In / Sign Up'}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;