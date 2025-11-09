import type { Flight } from '../types/flights';

// Helper function to format duration from minutes to "Xh Ym" format
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

// Map a SerpApi flight result to our Flight interface
export function mapSerpFlightToFlight(serpFlight: any): Flight {
  // Handle both single-flight and multi-leg formats
  const flightData = serpFlight.flights ? serpFlight.flights[0] : serpFlight;

  console.log('Mapping SerpAPI flight data:', JSON.stringify(flightData, null, 2));

  // Extract departure and arrival times from SerpAPI format
  const departureDateTime = flightData.departure_airport?.time?.split(' ') || ['', ''];
  const arrivalDateTime = flightData.arrival_airport?.time?.split(' ') || ['', ''];

  // Use total_duration if available, otherwise calculate from individual flight duration
  let totalDuration = serpFlight.total_duration;
  if (!totalDuration && flightData.duration) {
    // Convert duration string (e.g., "6h 51m") to minutes if needed
    const durationMatch = flightData.duration.match(/(\d+)h\s*(?:(\d+)m)?/);
    if (durationMatch) {
      const hours = parseInt(durationMatch[1], 10);
      const minutes = parseInt(durationMatch[2] || '0', 10);
      totalDuration = hours * 60 + minutes;
    }
  }
  totalDuration = totalDuration || 0;

  // Extract carbon emissions data
  let emissions;
  if (serpFlight.carbon_emissions) {
    emissions = {
      co2Grams: Math.round(serpFlight.carbon_emissions.this_flight * 1000), // Convert kg to g
      comparisonPercent: serpFlight.carbon_emissions.difference_percent || -20,
    };
  } else {
    // Fallback calculation based on flight duration
    const estimatedEmissionsPerHour = 8300; // kg CO2 per hour
    const durationHours = totalDuration / 60;
    emissions = {
      co2Grams: Math.round(estimatedEmissionsPerHour * durationHours * 1000), // Convert to grams
      comparisonPercent: -20, // default value
    };
  }

  const mappedFlight: Flight = {
    flightNumber: flightData.flight_number || 'Unknown',
    airline: flightData.airline || 'Unknown Airline',
    departure: {
      airport: flightData.departure_airport?.name || flightData.departure_airport?.id || 'Unknown',
      time: departureDateTime[1] || flightData.departure_airport?.time || '',
    },
    arrival: {
      airport: flightData.arrival_airport?.name || flightData.arrival_airport?.id || 'Unknown',
      time: arrivalDateTime[1] || flightData.arrival_airport?.time || '',
    },
    duration: formatDuration(totalDuration),
    price: serpFlight.price || 0,
    emissions,
    bookingLink: serpFlight.booking_link || '#',
  };

  console.log('Mapped flight:', JSON.stringify(mappedFlight, null, 2));
  return mappedFlight;
}

// Normalize SerpApi response into { best_flights: Flight[], other_flights: Flight[] }
export function mapSerpResponse(data: any) {
  console.log('Mapping SerpAPI response structure:', {
    hasBestFlights: !!data.best_flights,
    hasOtherFlights: !!data.other_flights,
    bestFlightsCount: data.best_flights?.length,
    otherFlightsCount: data.other_flights?.length
  });

  const best = Array.isArray(data.best_flights) ? 
    data.best_flights.filter((f: any) => f.flights?.length > 0).map(mapSerpFlightToFlight) : [];
  
  const other = Array.isArray(data.other_flights) ? 
    data.other_flights.filter((f: any) => f.flights?.length > 0).map(mapSerpFlightToFlight) : [];
  
  return { best_flights: best, other_flights: other };
}