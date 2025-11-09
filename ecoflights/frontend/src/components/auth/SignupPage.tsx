import { useAuth0 } from '@auth0/auth0-react';
import React, { useState } from 'react';
import type { View } from '../../frontend/App';
import { LeafIcon } from '../icons/Icons';
import './Auth.css';

interface SignupPageProps {
  onNavigate: (view: View) => void;
  // We removed 'onLogin', Auth0 handles this
}

const SignupPage: React.FC<SignupPageProps> = ({ onNavigate }) => {
  const { loginWithRedirect } = useAuth0();

  // This function tells Auth0 to show the 'signup' tab
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup', // This tells Auth0 to show the Sign Up form
      },
    });
  };

return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <LeafIcon className="auth-logo-icon" />
          <h1 className="auth-title">Create Your Account</h1>
          <p className="auth-subtitle">Join us in making travel more sustainable.</p>
        </div>
        
        {/* This form is much simpler. It just has the button that calls handleSignUp.
          All the input fields are removed.
        */}
        <form onSubmit={handleSignUp} className="auth-form">
          <p className="auth-subtitle" style={{textAlign: 'center'}}>
            You will be redirected to our secure sign-up page.
          </p>
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