import { supabase } from './supabaseClient' 
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

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use Supabase to sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error; // If Supabase sends an error, show it

      // Login was successful!
      // Now, we'll call the onLogin prop, just like their old code did.
      const name = email.split('@')[0];
      onLogin(name);

    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setLoading(false); // Make sure to stop loading
    }
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