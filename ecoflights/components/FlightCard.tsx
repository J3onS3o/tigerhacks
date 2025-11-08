import React from 'react';
import type { Flight } from '../types';
import { PlaneIcon, ClockIcon, CloudIcon } from './icons/Icons';
import './FlightCard.css';

const FlightCard: React.FC<{ flight: Flight }> = ({ flight }) => {
  const emissionsStatus = flight.emissions 
    ? flight.emissions.comparisonPercent < 0
      ? `${Math.abs(flight.emissions.comparisonPercent)}% lower emissions`
      : `${flight.emissions.comparisonPercent}% higher emissions`
    : 'Emissions data not available';

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
            {flight.emissions && (
                <div className={`detail-item emissions-detail ${flight.emissions.comparisonPercent < 0 ? 'lower-emissions' : ''}`}>
                    <CloudIcon className="detail-icon"/>
                    <span>{emissionsStatus}</span>
                </div>
            )}
        </div>
      </div>
      <div className="footer">
         <a 
            href={flight.bookingLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="book-button"
          >
            Book Now
        </a>
      </div>
    </div>
  );
};

export default FlightCard;
