import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { EcoWalletProvider } from './components/EcoWalletContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AboutEmissions from './components/AboutEmissions';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import AccountPage from './components/auth/AccountPage';
import AboutUs from "./components/AboutUs";
import FlightSearch from './components/FlightSearch';
import './App.css';

export type View = 'home' | 'login' | 'signup' | 'about' | 'account';

function App() {
  const { 
    isLoading, 
    isAuthenticated, 
    user, 
    logout 
  } = useAuth0();

  const [currentView, setCurrentView] = React.useState<View>('home');

  const navigate = (view: View) => {
    setCurrentView(view);
  };

  const handleLogout = () => {
    logout({ 
      logoutParams: { 
        returnTo: window.location.origin
      } 
    });
  };

  const handleAccountClick = () => {
    navigate(isAuthenticated ? 'account' : 'login');
  };

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return (
          <div className="page-container">
            <LoginPage onNavigate={navigate} />
          </div>
        );
      
      case 'signup':
        return (
          <div className="page-container">
            <SignupPage onNavigate={navigate} />
          </div>
        );
      
      case 'account':
        if (!isAuthenticated) {
          return (
            <div className="page-container">
              <LoginPage onNavigate={navigate} />
            </div>
          );
        }
        return (
          <div className="page-container">
            <AccountPage 
              userName={user?.name || ''} 
              onLogout={handleLogout} 
            />
          </div>
        );
      
      case 'about':
        return (
          <div className="page-container">
            <AboutUs onNavigate={navigate} />
          </div>
        );
      
      case 'home':
      default:
        return (
          <>
            <div className="hero">
              <div 
                className="hero-background" 
                style={{
                  backgroundImage: "url('https://picsum.photos/1920/1080?grayscale&blur=2')"
                }}
              ></div>
              <div className="hero-overlay"></div>
              <div className="container hero-content">
                <h1 className="hero-title">Fly Greener, Fly Smarter</h1>
                <p className="hero-subtitle">
                  Discover flights with lower-than-average emissions and reduce your carbon footprint. 
                  Your journey to a sustainable future starts here.
                </p>
              </div>
            </div>
            
            {/* Flight Search Section - Now wrapped with EcoWalletProvider */}
            <div className="search-section">
              <div className="container">
                <FlightSearch />
              </div>
            </div>

            {/* About Emissions Section */}
            <AboutEmissions />
          </>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="app-container">
        <div 
          className="page-container" 
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh' 
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div className="loading-spinner"></div>
            <h2>Loading EcoFlights...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <EcoWalletProvider>
      <div className="app-container">
        <Header 
          isLoggedIn={isAuthenticated}
          onAccountClick={handleAccountClick} 
          onLogoClick={() => navigate('home')}
          onAboutClick={() => navigate('about')}
        />
        <main className="main-content">
          {renderView()}
        </main>
        <Footer />
      </div>
    </EcoWalletProvider>
  );
}

export default App;