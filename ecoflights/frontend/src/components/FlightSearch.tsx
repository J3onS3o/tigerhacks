import React, { useState } from 'react';
import type { Flight } from '../types';
import FlightCard from './FlightCard';
import EcoWalletTab from './EcoWalletTab';
import './FlightSearch.css';

interface SerpAPIParams {
  departure_id: string;
  arrival_id: string;
  outbound_date: string;
  return_date?: string;
  type: '1' | '2';
  travel_class: '1' | '2' | '3' | '4';
  adults: number;
  children: number;
  infants_in_seat: number;
  infants_on_lap: number;
  currency: string;
  hl: string;
  gl: string;
  stops?: '0' | '1' | '2';
  emissions?: '1';
}

const FlightSearch: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'flights' | 'wallet' | 'impact'>('flights');
  const [tripType, setTripType] = useState<'1' | '2'>('1');
  
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [travelClass, setTravelClass] = useState<'1' | '2' | '3' | '4'>('1');
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [stops, setStops] = useState<'0' | '1' | '2' | ''>('');
  const [lowEmissionsOnly] = useState(true); 
  const [bestFlights, setBestFlights] = useState<Flight[]>([]);
  const [otherFlights, setOtherFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [impactLoading, setImpactLoading] = useState(false);
  const [impactMessage, setImpactMessage] = useState<string | null>(null);
  
  const handleSwapLocations = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };
  
  const handleSearch = async () => {
  if (!from || !to || !departDate) {
    setError('Please fill in all required fields');
    return;
  }

  if (tripType === '1' && !returnDate) {
    setError('Please select a return date for round trip');
    return;
  }

  setLoading(true);
  setError(null);
  setBestFlights([]);
  setOtherFlights([]);

  const params: SerpAPIParams = {
    departure_id: from.toUpperCase(),
    arrival_id: to.toUpperCase(),
    outbound_date: departDate,
    type: tripType,
    travel_class: travelClass,
    adults: travelers,
    children: 0,
    infants_in_seat: 0,
    infants_on_lap: 0,
    currency: 'USD',
    hl: 'en',
    gl: 'us',
  };

  if (tripType === '1' && returnDate) {
    params.return_date = returnDate;
  }

  if (stops) params.stops = stops;
  if (lowEmissionsOnly) params.emissions = '1';

  try {
    const response = await fetch('/api/flights/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      let errBody: any = null;
      try {
        errBody = await response.json();
      } catch {
        try {
          errBody = await response.text();
        } catch {
          errBody = 'Unknown error';
        }
      }
      throw new Error(typeof errBody === 'string' ? errBody : JSON.stringify(errBody));
    }

    const data = await response.json();
    
    // Sort flights by emissions and price
    const sortFlights = (flights: Flight[]): Flight[] => {
      return [...flights].sort((a, b) => {
        // First, prioritize eco-friendly flights (lower emissions)
        const aEmissions = a.emissions?.comparisonPercent ?? 0;
        const bEmissions = b.emissions?.comparisonPercent ?? 0;
        
        if (aEmissions !== bEmissions) {
          return aEmissions - bEmissions; // Lower emissions first
        }
        
        // If emissions are the same, sort by price
        return a.price - b.price;
      });
    };

    // Backend already returns Flight[] format, so use directly (no conversion needed)
    const best = sortFlights(data.best_flights || []);
    const other = sortFlights(data.other_flights || []);

    setBestFlights(best);
    setOtherFlights(other);

    if (best.length === 0 && other.length === 0) {
      setError('No flights found. Try adjusting your search criteria.');
    }
  } catch (err) {
    console.error('Search error:', err);
    setError('Failed to search flights. Please check your backend is running and try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      <div className="search-box">
        <div className="search-tabs">
          <button
            className={`tab-button ${activeTab === 'flights' ? 'active' : ''}`}
            onClick={() => setActiveTab('flights')}
          >
            ✈️ Flights
          </button>
          <button
            className={`tab-button ${activeTab === 'wallet' ? 'active' : ''}`}
            onClick={() => setActiveTab('wallet')}
          >
            🪙 Wallet
          </button>
          <button
            className={`tab-button ${activeTab === 'impact' ? 'active' : ''}`}
            onClick={async () => {
              setActiveTab('impact');
              setImpactLoading(true);
              setImpactMessage(null);

              try {
                // Example stats; replace with actual wallet stats
                const stats = {
                  totalCO2Saved: 123.4,
                  reductionPercent: 12.5,
                  flightsOffset: 3
                };

                const prompt = `
                  A user has saved ${stats.totalCO2Saved.toFixed(1)} kg of CO₂e,
                  a ${stats.reductionPercent.toFixed(1)}% reduction across flights,
                  roughly equal to ${stats.flightsOffset} flights offset.
                  Write an encouraging, informative 2-3 sentence summary comparing their impact to everyday examples 
                  (trees planted, miles driven avoided, etc.) in a friendly tone.
                `;

                const response = await fetch("/api/gemini", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ prompt })
                });

                const data = await response.json();
                setImpactMessage(data.response);
              } catch (err) {
                console.error(err);
                setImpactMessage("Could not load your impact right now.");
              } finally {
                setImpactLoading(false);
              }
            }}
          >
            🌱 Impact
          </button>
        </div>

        {activeTab === "wallet" && (
          <EcoWalletTab />
        )}

        {activeTab === "impact" && (
          <div className="tab-content">
            {impactLoading && <p>Loading your impact...</p>}
            {!impactLoading && impactMessage && (
              <div className="impact-message">
                <p>{impactMessage}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'flights' && (
          <div className="tab-content">
            <div className="trip-type-selector">
              <label>
                <input
                  type="radio"
                  name="tripType"
                  value="1"
                  checked={tripType === '1'}
                  onChange={(e) => setTripType(e.target.value as '1')}
                />
                Round trip
              </label>
              <label>
                <input
                  type="radio"
                  name="tripType"
                  value="2"
                  checked={tripType === '2'}
                  onChange={(e) => setTripType(e.target.value as '2')}
                />
                One-way
              </label>
            </div>

            <div className="form-grid">
              <div className="location-inputs">
                <div className="input-group">
                  <label className="label">From</label>
                  <div className="input-wrapper">
                    <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input
                      type="text"
                      className="input"
                      placeholder="Airport code (e.g., JFK)"
                      value={from}
                      onChange={(e) => setFrom(e.target.value.toUpperCase())}
                      maxLength={3}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="swap-button"
                  onClick={handleSwapLocations}
                  aria-label="Swap locations"
                >
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </button>

                <div className="input-group">
                  <label className="label">To</label>
                  <div className="input-wrapper">
                    <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input
                      type="text"
                      className="input"
                      placeholder="Airport code (e.g., LAX)"
                      value={to}
                      onChange={(e) => setTo(e.target.value.toUpperCase())}
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>

              <div className="date-traveler-inputs">
                <div className="input-group">
                  <label className="label">
                    {tripType === '1' ? 'Depart - Return' : 'Departure Date'}
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="date"
                      className="input date-input"
                      value={departDate}
                      onChange={(e) => setDepartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {tripType === '1' && (
                      <input
                        type="date"
                        className="input date-input"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        min={departDate || new Date().toISOString().split('T')[0]}
                      />
                    )}
                  </div>
                </div>

                <div className="input-group">
                  <label className="label">Travelers</label>
                  <div className="input-wrapper">
                    <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <input
                      type="number"
                      className="input"
                      value={travelers}
                      onChange={(e) => setTravelers(parseInt(e.target.value) || 1)}
                      min="1"
                      max="9"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}
              >
                {showAdvanced ? '▼' : '►'} Advanced Options
              </button>
            </div>

            {showAdvanced && (
              <div style={{ 
                marginBottom: '1.5rem', 
                paddingLeft: '1rem', 
                borderLeft: '2px solid #10b981',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div className="input-group">
                  <label className="label">Stops</label>
                  <select
                    className="input select"
                    value={stops}
                    onChange={(e) => setStops(e.target.value as any)}
                  >
                    <option value="">Any number of stops</option>
                    <option value="0">Nonstop only</option>
                    <option value="1">1 stop or fewer</option>
                    <option value="2">2 stops or fewer</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="label">Class</label>
                  <select
                    className="input select"
                    value={travelClass}
                    onChange={(e) => setTravelClass(e.target.value as any)}
                  >
                    <option value="1">Economy</option>
                    <option value="2">Premium Economy</option>
                    <option value="3">Business</option>
                    <option value="4">First Class</option>
                  </select>
                </div>

                <div className="eco-badge">
                  🌱 EcoFlights - Finding the most environmentally conscious travel options
                </div>
              </div>
            )}

            <div className="bottom-row">

              <button
                className="submit-button"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="spinner" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  <>
                    <svg style={{ height: '1.25rem', width: '1.25rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search Flights
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {(loading || error || bestFlights.length > 0 || otherFlights.length > 0) && (
        <div className="results-section">
          <div className="eco-info-banner">
            <div className="eco-icon">🌍</div>
            <div className="eco-message">
              <h3>Eco-Friendly Flight Search</h3>
              <p>We exclusively show flights with lower carbon emissions to help you make environmentally conscious travel choices.</p>
            </div>
          </div>

          {loading && (
            <div className="loading-state">
              <svg className="loading-icon pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <p>Finding your eco-conscious travel options...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && (bestFlights.length > 0 || otherFlights.length > 0) && (
            <>
              <div className="results-grid eco-friendly-section">
                {bestFlights.map((flight, index) => (
                  <FlightCard key={`best-${flight.id}-${index}`} flight={flight} />
                ))}
                {otherFlights.map((flight, index) => (
                  <FlightCard key={`other-${flight.id}-${index}`} flight={flight} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FlightSearch;