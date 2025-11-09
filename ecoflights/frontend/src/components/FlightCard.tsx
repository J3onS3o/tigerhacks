import React, { useState } from 'react';
import type { Flight } from '../types';
import { PlaneIcon, ClockIcon, CloudIcon } from './icons/Icons';
import { useEcoWallet } from './EcoWalletContext';
import './FlightCard.css';

const FlightCard: React.FC<{ flight: Flight }> = ({ flight }) => {
  const { bookFlight } = useEcoWallet();
  const [isBooked, setIsBooked] = useState(false);
  const [pnrCode, setPnrCode] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Format emissions data with better context
  const formatEmissions = (emissions: Flight['emissions']) => {
    if (!emissions) return { text: 'Emissions data not available', className: '' };
    
    const percent = emissions.comparisonPercent;
    const gramsPerPassenger = emissions.co2Grams;
    
    if (percent < -20) {
      return {
        text: `Eco-friendly choice! ${Math.abs(percent)}% lower emissions (${(gramsPerPassenger / 1000).toFixed(1)} kg CO₂)`,
        className: 'eco-friendly'
      };
    } else if (percent < 0) {
      return {
        text: `${Math.abs(percent)}% lower emissions (${(gramsPerPassenger / 1000).toFixed(1)} kg CO₂)`,
        className: 'lower-emissions'
      };
    } else {
      return {
        text: `${percent}% higher emissions (${(gramsPerPassenger / 1000).toFixed(1)} kg CO₂)`,
        className: 'higher-emissions'
      };
    }
  };

  const emissionsInfo = formatEmissions(flight.emissions);

  // Calculate potential ECO tokens
  const calculatePotentialTokens = () => {
    if (!flight.emissions || flight.emissions.comparisonPercent >= 0) return 0;
    
    const co2SavedGrams = Math.abs(flight.emissions.co2Grams * (flight.emissions.comparisonPercent / 100));
    const co2SavedKg = co2SavedGrams / 1000;
    return Math.round(co2SavedKg * 43);
  };

  const potentialTokens = calculatePotentialTokens();

  const handleBookClick = () => {
    if (flight.emissions && flight.emissions.comparisonPercent < 0) {
      // Book through our system to earn tokens
      setShowBookingModal(true);
    } else {
      // No emissions savings, just redirect to external booking
      if (flight.bookingLink) {
        window.open(flight.bookingLink, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const handleConfirmBooking = () => {
    if (!flight.emissions) return;

    const generatedPNR = bookFlight({
      id: flight.id,
      flightNumber: flight.flightNumber,
      airline: flight.airline,
      co2Grams: flight.emissions.co2Grams,
      comparisonPercent: flight.emissions.comparisonPercent,
      price: flight.price
    });

    setPnrCode(generatedPNR);
    setIsBooked(true);
  };

  const handleCopyPNR = () => {
    if (pnrCode) {
      navigator.clipboard.writeText(pnrCode);
    }
  };

  return (
    <>
      <div className="card">
        <div className="content">
          <div className="header">
            <div>
              <p className="airline">{flight.airline}</p>
              <p className="flight-number">{flight.flightNumber}</p>
            </div>
            <div className="price-container">
              <p className="price">${flight.price}</p>
              <p className="price-label">per passenger</p>
            </div>
          </div>

          <div className="route">
            <div className="airport">
              <p className="time">{flight.departure.time}</p>
              <p className="airport-code">{flight.departure.airport}</p>
            </div>
            <div className="route-line">
              <div className="dashed-line"></div>
              <PlaneIcon className="plane-icon" />
              <div className="dashed-line"></div>
            </div>
            <div className="airport arrival-airport">
              <p className="time">{flight.arrival.time}</p>
              <p className="airport-code">{flight.arrival.airport}</p>
            </div>
          </div>
          
          <div className="details">
            <div className="detail-item">
              <ClockIcon className="detail-icon"/>
              <span>{flight.duration}</span>
            </div>
            <div className={`detail-item emissions-detail ${emissionsInfo.className}`}>
              <CloudIcon className="detail-icon"/>
              <span>{emissionsInfo.text}</span>
            </div>
          </div>

          {potentialTokens > 0 && !isBooked && (
            <div className="token-preview">
              <span className="token-icon">🪙</span>
              <span className="token-text">Earn {potentialTokens.toLocaleString()} ECO Tokens!</span>
            </div>
          )}
        </div>

        <div className="footer">
          {isBooked && pnrCode ? (
            <div className="booked-status">
              <div className="pnr-display">
                <span className="pnr-label">Your PNR Code:</span>
                <span className="pnr-code">{pnrCode}</span>
                <button onClick={handleCopyPNR} className="copy-button" title="Copy PNR">
                  📋
                </button>
              </div>
              <p className="claim-instruction">Go to Wallet tab to claim your ECO Tokens!</p>
            </div>
          ) : (
            <button
              onClick={handleBookClick}
              className={`book-button ${emissionsInfo.className}`}
            >
              {emissionsInfo.className === 'eco-friendly' ? 'Book Eco-Friendly Flight' : 'Book Flight'}
            </button>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && !isBooked && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🌱 Book Eco-Friendly Flight</h3>
              <button className="modal-close" onClick={() => setShowBookingModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="booking-summary">
                <h4>{flight.airline} {flight.flightNumber}</h4>
                <p className="route-summary">
                  {flight.departure.airport} → {flight.arrival.airport}
                </p>
                <p className="price-summary">${flight.price} per passenger</p>
              </div>

              <div className="eco-benefits">
                <h4>Your Environmental Impact:</h4>
                <div className="benefit-item">
                  <span className="benefit-icon">🌍</span>
                  <span>{emissionsInfo.text}</span>
                </div>
                <div className="benefit-item highlight">
                  <span className="benefit-icon">🪙</span>
                  <span>Earn {potentialTokens.toLocaleString()} ECO Tokens</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">🏆</span>
                  <span>Progress toward NFT badges</span>
                </div>
              </div>

              <div className="booking-options">
                <button 
                  className="option-button primary"
                  onClick={handleConfirmBooking}
                >
                  Book & Earn Tokens
                </button>
                <a
                  href={flight.bookingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="option-button secondary"
                  onClick={() => setShowBookingModal(false)}
                >
                  Book Externally
                </a>
              </div>

              <p className="booking-note">
                💡 Booking through our system generates a PNR code that you can redeem in the Wallet tab to claim your ECO Tokens!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FlightCard;