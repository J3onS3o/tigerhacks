import { useAuth0 } from '@auth0/auth0-react';
import React, { useState } from 'react';
import type { View } from '../../App';
import { LeafIcon } from '../icons/Icons';
import './Auth.css';

interface LoginPageProps {
  onNavigate: (view: View) => void;
  // We removed 'onLogin' prop, Auth0 handles this automatically
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  
  // Get the login function from the hook
  const { loginWithRedirect } = useAuth0();

  // This function will be called by the form's button
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Tell Auth0 to show the login page
    await loginWithRedirect();
  };
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <LeafIcon className="auth-logo-icon" />
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Log in to manage your sustainable journeys.</p>
        </div>
        <form onSubmit={handleLogin} className="auth-form">
          <p className="auth-subtitle" style={{textAlign: 'center'}}>
            You will be redirected to our secure login page.
          </p>
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