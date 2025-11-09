import type { Flight } from '../frontend/src/types';

// Helper function to format duration from minutes to "Xh Ym" format
function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

// Map a SerpApi flight result to our Flight interface
export function mapSerpFlightToFlight(serpFlight: any): Flight {
  // Handle both single-flight and multi-leg formats
  const flightData = serpFlight.flights ? serpFlight.flights[0] : serpFlight;

  console.log('Mapping SerpAPI flight:', JSON.stringify(flightData, null, 2));

  // Calculate duration (either from total_duration or individual flight duration)
  const totalDuration = serpFlight.total_duration || flightData.duration || 0;

  // Get carbon emissions if available from the API
  let emissions;
  if (serpFlight.carbon_emissions) {
    emissions = {
      co2Grams: Math.round(serpFlight.carbon_emissions.this_flight),
      comparisonPercent: serpFlight.carbon_emissions.difference_percent || -20,
    };
  } else {
    // Fallback calculation
    const estimatedEmissionsPerHour = 8300; // kg CO2 per hour
    const durationHours = totalDuration / 60;
    emissions = {
      co2Grams: Math.round(estimatedEmissionsPerHour * durationHours * 1000),
      comparisonPercent: -20, // default value
    };
  }

  return {
    flightNumber: flightData.flight_number || 'Unknown',
    airline: flightData.airline || 'Unknown Airline',
    departure: {
      airport: flightData.departure_airport?.name || flightData.departure_airport?.id || 'Unknown',
      time: flightData.departure_airport?.time || '',
    },
    arrival: {
      airport: flightData.arrival_airport?.name || flightData.arrival_airport?.id || 'Unknown',
      time: flightData.arrival_airport?.time || '',
    },
    duration: formatDuration(totalDuration),

    price: serpFlight.price || 0,
    emissions,
    bookingLink: serpFlight.booking_link || '#',
  };
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