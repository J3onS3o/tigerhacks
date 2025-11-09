import React from 'react';
import { ArrowLeftOnRectangleIcon } from '../icons/Icons';
import './AccountPage.css';

interface AccountPageProps {
  userName: string;
  onLogout: () => void;
}

const AccountPage: React.FC<AccountPageProps> = ({ userName, onLogout }) => {
  return (
    <div className="account-container container">
      <header className="account-header">
        <div>
          <h1 className="account-title">My Account</h1>
          <p className="account-welcome">Welcome back, {userName}!</p>
        </div>
        <button onClick={onLogout} className="logout-button">
          <ArrowLeftOnRectangleIcon />
          <span>Log Out</span>
        </button>
      </header>

      <div className="account-content">
        <div className="account-card">
          <h2 className="card-title">Profile Information</h2>
          <p className="card-message">This is where you can edit your personal details. Feature coming soon.</p>
        </div>
        <div className="account-card">
          <h2 className="card-title">Travel Preferences</h2>
          <p className="card-message">Manage your preferred airlines, seating, and more. Feature coming soon.</p>
        </div>
        <div className="account-card">
          <h2 className="card-title">Billing & Payments</h2>
          <p className="card-message">View your payment methods and billing history. Feature coming soon.</p>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;