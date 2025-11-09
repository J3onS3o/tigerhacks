import React from 'react';
import type { Flight } from '../frontend/src/types';
import { PlaneIcon, ClockIcon, CloudIcon } from './icons/Icons';
import './FlightCard.css';

const FlightCard: React.FC<{ flight: Flight }> = ({ flight }) => {
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

  return (
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
      </div>
      <div className="footer">
         <a 
            href={flight.bookingLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`book-button ${emissionsInfo.className}`}
          >
            {emissionsInfo.className === 'eco-friendly' ? 'Book Eco-Friendly Flight' : 'Book Flight'}
        </a>
      </div>
    </div>
  );
};

export default FlightCard;
