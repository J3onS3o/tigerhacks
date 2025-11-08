import React, { useState } from 'react';
import Header from './components/Header';
import FlightSearch from './components/FlightSearch';
import Footer from './components/Footer';
import AboutEmissions from './components/AboutEmissions';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import AccountPage from './components/auth/AccountPage';
import '../ecoflights/App.css';
import { supabase } from './components/auth/supabaseClient';

export type View = 'home' | 'login' | 'signup' | 'account';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');

  const navigate = (view: View) => {
    setCurrentView(view);
  };

  const handleLogin = (name: string) => {
    setIsLoggedIn(true);
    setUserName(name);
    navigate('home');
  };

  const handleLogout = async () => {
    try {
      // Tell Supabase to log the user out
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Keep all of your team's original logic
      setIsLoggedIn(false);
      setUserName('');
      navigate('home');

    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };
  
  const handleAccountClick = () => {
    navigate(isLoggedIn ? 'account' : 'login');
  };

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return <div className="page-container"><LoginPage onNavigate={navigate} onLogin={handleLogin} /></div>;
      case 'signup':
        return <div className="page-container"><SignupPage onNavigate={navigate} onLogin={handleLogin} /></div>;
      case 'account':
        // Ensure user is logged in to see account, otherwise redirect to login
        if (!isLoggedIn) {
          return <div className="page-container"><LoginPage onNavigate={navigate} onLogin={handleLogin} /></div>;
        }
        return <div className="page-container"><AccountPage userName={userName} onLogout={handleLogout} /></div>;
      case 'home':
      default:
        return (
          <>
            <div className="hero">
              <div className="hero-background" style={{backgroundImage: "url('https://picsum.photos/1920/1080?grayscale&blur=2')"}}></div>
              <div className="hero-overlay"></div>
              <div className="container hero-content">
                  <h1 className="hero-title">Fly Greener, Fly Smarter</h1>
                  <p className="hero-subtitle">
                    Discover flights with lower-than-average emissions and reduce your carbon footprint. Your journey to a sustainable future starts here.
                  </p>
              </div>
            </div>
            
            <div className="search-section">
              <FlightSearch />
            </div>

            <AboutEmissions />
          </>
        );
    }
  }

  return (
    <div className="app-container">
      <Header 
        isLoggedIn={isLoggedIn} 
        onAccountClick={handleAccountClick} 
        onLogoClick={() => navigate('home')}
      />
      <main className="main-content">
        {renderView()}
      </main>
      <Footer />
    </div>
  );
}

export default App;