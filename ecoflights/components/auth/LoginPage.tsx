import React, { useState } from 'react';
import type { View } from '../../App';
import { LeafIcon } from '../icons/Icons';
import './Auth.css';

interface LoginPageProps {
  onNavigate: (view: View) => void;
  onLogin: (name: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login by extracting a name from the email
    const name = email.split('@')[0];
    onLogin(name);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <LeafIcon className="auth-logo-icon" />
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Log in to manage your sustainable journeys.</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="auth-button">Log In</button>
        </form>
        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <button onClick={() => onNavigate('signup')} className="link-button">
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;