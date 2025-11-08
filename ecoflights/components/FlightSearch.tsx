import React, { useState, useMemo } from 'react';
import type { Flight } from '../types';
import { searchFlights } from '../services/serpApiService';
import FlightCard from './FlightCard';
import Calendar from './Calendar';
import PlaceholderPage from './PlaceholderPage';
import { 
  PlaneTakeoffIcon, 
  PlaneLandingIcon, 
  ArrowPathIcon, 
  LeafIcon, 
  CalendarDaysIcon, 
  ChevronDownIcon,
  ArrowsRightLeftIcon,
  UsersIcon
} from './icons/Icons';
import './FlightSearch.css';

const airports = [
  { name: 'San Francisco (SFO)', iata: 'SFO' },
  { name: 'New York (JFK)', iata: 'JFK' },
  { name: 'Los Angeles (LAX)', iata: 'LAX' },
  { name: 'London (LHR)', iata: 'LHR' },
  { name: 'Tokyo (HND)', iata: 'HND' },
  { name: 'Paris (CDG)', iata: 'CDG' },
  { name: 'Sydney (SYD)', iata: 'SYD' },
  { name: 'Dubai (DXB)', iata: 'DXB' },
];

const formatDate = (date: Date | null) => {
  if (!date) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const FlightSearch: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Book' | 'Flight status' | 'Check-in' | 'My trips'>('Book');
  const [origin, setOrigin] = useState<string>('SFO');
  const [destination, setDestination] = useState<string>('JFK');
  const [tripType, setTripType] = useState<'roundtrip' | 'oneway'>('roundtrip');
  const [departureDate, setDepartureDate] = useState<Date>(new Date());
  
  const initialReturnDate = useMemo(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek;
  }, []);
  const [returnDate, setReturnDate] = useState<Date | null>(initialReturnDate);

  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleDateSelect = (date: Date) => {
    if (!departureDate || (returnDate && departureDate)) {
      setDepartureDate(date);
      setReturnDate(null);
    } else if (date < departureDate) {
      setDepartureDate(date);
    } else {
      setReturnDate(date);
      if(tripType === 'roundtrip') {
          setIsCalendarOpen(false);
      }
    }
  };

  const handleTripTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTripType = e.target.value as 'roundtrip' | 'oneway';
    setTripType(newTripType);
    if (newTripType === 'oneway') {
      setReturnDate(null);
    } else {
      setReturnDate(initialReturnDate);
    }
  };
  
  const handleSwapAirports = () => {
    setOrigin(destination);
    setDestination(origin);
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || !departureDate || (tripType === 'roundtrip' && !returnDate)) {
      setError('Please fill in all required fields.');
      return;
    }
    if (origin === destination) {
      setError('Origin and destination cannot be the same.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setFlights([]);
    setHasSearched(true);
    try {
      const results = await searchFlights(origin, destination, departureDate, returnDate);
      setFlights(results);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const dateDisplayValue = useMemo(() => {
    let text = formatDate(departureDate);
    if (tripType === 'roundtrip' && returnDate) {
      text += ` - ${formatDate(returnDate)}`;
    }
    return text;
  }, [departureDate, returnDate, tripType]);
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Book':
        return (
          <>
            <form onSubmit={handleSearch} className="form">
                <div className="trip-type-selector">
                    <label>
                        <input 
                            type="radio" 
                            name="trip-type" 
                            value="roundtrip" 
                            checked={tripType === 'roundtrip'} 
                            onChange={handleTripTypeChange}
                        />
                        <span>Roundtrip</span>
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="trip-type" 
                            value="oneway" 
                            checked={tripType === 'oneway'} 
                            onChange={handleTripTypeChange}
                        />
                        <span>One-way</span>
                    </label>
                </div>
              
                <div className="form-grid">
                    <div className="location-inputs">
                        <div className="input-group">
                            <label htmlFor="origin" className="label">From</label>
                            <div className="input-wrapper">
                                <PlaneTakeoffIcon className="icon"/>
                                <select id="origin" value={origin} onChange={(e) => setOrigin(e.target.value)} className="input select">
                                    {airports.map(airport => <option key={airport.iata} value={airport.iata}>{airport.name}</option>)}
                                </select>
                                <ChevronDownIcon className="chevron-icon"/>
                            </div>
                        </div>
                        
                        <button type="button" className="swap-button" onClick={handleSwapAirports} aria-label="Swap origin and destination">
                            <ArrowsRightLeftIcon />
                        </button>

                        <div className="input-group">
                            <label htmlFor="destination" className="label">To</label>
                            <div className="input-wrapper">
                                <PlaneLandingIcon className="icon"/>
                                <select id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} className="input select">
                                    {airports.map(airport => <option key={airport.iata} value={airport.iata}>{airport.name}</option>)}
                                </select>
                                <ChevronDownIcon className="chevron-icon"/>
                            </div>
                        </div>
                    </div>

                    <div className="date-traveler-inputs">
                        <div className="input-group">
                            <label htmlFor="dates" className="label">Dates</label>
                            <div className="input-wrapper">
                                <CalendarDaysIcon className="icon"/>
                                <input
                                    id="dates"
                                    type="text"
                                    value={dateDisplayValue}
                                    onFocus={() => setIsCalendarOpen(true)}
                                    readOnly
                                    className="input date-input"
                                    placeholder="Select your dates"
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label htmlFor="travelers" className="label">Travelers</label>
                            <div className="input-wrapper">
                                <UsersIcon className="icon"/>
                                <select id="travelers" className="input select" defaultValue="1">
                                    <option value="1">1 Adult</option>
                                    <option value="2">2 Adults</option>
                                    <option value="3">3 Adults</option>
                                </select>
                                <ChevronDownIcon className="chevron-icon"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bottom-row">
                     <div className="input-group economy-group">
                        <select className="economy-select">
                            <option>Economy</option>
                            <option>Business</option>
                            <option>First</option>
                        </select>
                    </div>
                    <button type="submit" disabled={isLoading} className="submit-button">
                        {isLoading ? <ArrowPathIcon className="spinner" /> : null}
                        <span>{isLoading ? 'Searching...' : 'Find flights'}</span>
                    </button>
                </div>
            </form>
            {isCalendarOpen && (
                <Calendar 
                    departureDate={departureDate}
                    returnDate={returnDate}
                    onDateSelect={handleDateSelect}
                    onClose={() => setIsCalendarOpen(false)}
                    tripType={tripType}
                />
            )}
          </>
        );
      case 'Flight status':
        return <PlaceholderPage title="Flight Status" message="Check the real-time status of your flight. This feature is coming soon!" />;
      case 'Check-in':
        return <PlaceholderPage title="Check-in" message="Check in for your flight and get your boarding pass. This feature is coming soon!" />;
      case 'My trips':
        return <PlaceholderPage title="My Trips" message="View and manage your upcoming and past trips. This feature is coming soon!" />;
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <div className="search-box">
        <div className="search-tabs">
            <button className={`tab-button ${activeTab === 'Book' ? 'active' : ''}`} onClick={() => setActiveTab('Book')}>Book</button>
            <button className={`tab-button ${activeTab === 'Flight status' ? 'active' : ''}`} onClick={() => setActiveTab('Flight status')}>Flight status</button>
            <button className={`tab-button ${activeTab === 'Check-in' ? 'active' : ''}`} onClick={() => setActiveTab('Check-in')}>Check-in</button>
            <button className={`tab-button ${activeTab === 'My trips' ? 'active' : ''}`} onClick={() => setActiveTab('My trips')}>My trips</button>
        </div>
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>

      {activeTab === 'Book' && (
        <div className="results-section">
          {isLoading && (
            <div className="loading-state">
              <div className="pulse"><LeafIcon className="loading-icon" /></div>
              <p>Searching for low-emission flights...</p>
            </div>
          )}
          {error && <div className="error-state">{error}</div>}
          {!isLoading && hasSearched && flights.length > 0 && (
            <div>
              <h2 className="results-title">
                {`Low-Emission Flights: ${origin} to ${destination}`}
              </h2>
              <div className="results-grid">
                {flights.map((flight, index) => <FlightCard key={`${flight.flightNumber}-${index}`} flight={flight} />)}
              </div>
            </div>
          )}
           {!isLoading && hasSearched && flights.length === 0 && !error && (
               <div className="placeholder">
                  <p>No low-emission flights found for this route. Please try different dates or airports.</p>
              </div>
           )}
           {!isLoading && !hasSearched && !error && (
              <div className="placeholder">
                  <p>Enter your travel details above to find low-emission flights.</p>
              </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlightSearch;