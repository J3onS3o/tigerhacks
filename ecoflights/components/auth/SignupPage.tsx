import React, { useState } from 'react';
import type { View } from '../../App';
import { LeafIcon } from '../icons/Icons';
import './Auth.css';

interface SignupPageProps {
  onNavigate: (view: View) => void;
  onLogin: (name: string) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onNavigate, onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate signup and login
    onLogin(name);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <LeafIcon className="auth-logo-icon" />
          <h1 className="auth-title">Create Your Account</h1>
          <p className="auth-subtitle">Join us in making travel more sustainable.</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input 
              id="name" 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>
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
          <button type="submit" className="auth-button">Create Account</button>
        </form>
        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <button onClick={() => onNavigate('login')} className="link-button">
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;