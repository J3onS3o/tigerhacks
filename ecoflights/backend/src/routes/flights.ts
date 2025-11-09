import express, { Request, Response, Router } from 'express';
import { fetchFlightsFromSerpApi } from '../services/serpApiService';

const router: Router = express.Router();

// Add debug logging middleware for all routes
router.use((req, res, next) => {
  console.log(`[Flights Router] ${req.method} ${req.url}`);
  next();
});

// Define TypeScript types for the flight search request body
interface FlightSearchRequest {
  departure_id: string;
  arrival_id: string;
  outbound_date: string;
  inbound_date?: string;
  type?: '0' | '1'; // '0' = one way, '1' = round trip
  [key: string]: any; // for any additional parameters
}

// Define TypeScript types for the SerpAPI response
interface SerpApiFlightResponse {
  best_flights?: any[];
  other_flights?: any[];
  [key: string]: any;
}

// Local Flight shape returned to frontend (matches frontend/src/types.ts)
interface Flight {
  id?: string;
  flightNumber: string;
  airline: string;
  departure: {
    airport: string;
    time: string;
    date?: string;
  };
  arrival: {
    airport: string;
    time: string;
    date?: string;
  };
  duration: string;
  price: number;
  emissions?: {
    co2Grams?: number;
    comparisonPercent?: number;
  } | undefined;
  bookingLink: string;
}

// Map a single SerpApi flight item to our Flight shape
function mapSerpFlightToFlight(serpFlight: any): Flight {
  console.log('Mapping SerpAPI flight:', JSON.stringify(serpFlight, null, 2));
  
  // Get the first flight segment
  const outbound = serpFlight.flights[0];
  
  // Extract departure/arrival times from the SerpAPI format (which includes date and time together)
  const departureDateTime = outbound.departure_airport?.time?.split(' ') || ['', ''];
  const arrivalDateTime = outbound.arrival_airport?.time?.split(' ') || ['', ''];

  return {
    id: serpFlight.departure_token || Math.random().toString(36).slice(2, 9),
    airline: outbound.airline || 'Unknown',
    flightNumber: outbound.flight_number || '',
    departure: {
      airport: outbound.departure_airport?.id || '',
      time: departureDateTime[1] || '',  // Just the time part
      date: departureDateTime[0] || ''   // Just the date part
    },
    arrival: {
      airport: outbound.arrival_airport?.id || '',
      time: arrivalDateTime[1] || '',    // Just the time part
      date: arrivalDateTime[0] || ''     // Just the date part
    },
    duration: formatDuration(outbound.duration || serpFlight.total_duration || 0),
    price: serpFlight.price || 0,
    emissions: serpFlight.carbon_emissions ? {
      co2Grams: serpFlight.carbon_emissions.this_flight || 0,
      comparisonPercent: serpFlight.carbon_emissions.difference_percent || 0
    } : undefined,
    bookingLink: '#'  // SerpAPI doesn't provide direct booking links
  };
}

// Normalize SerpApi response into { best_flights: Flight[], other_flights: Flight[] }
function mapSerpResponse(data: any) {
  const best = Array.isArray(data.best_flights) ? data.best_flights.map(mapSerpFlightToFlight) : [];
  const other = Array.isArray(data.other_flights) ? data.other_flights.map(mapSerpFlightToFlight) : [];
  return { best_flights: best, other_flights: other };
}

// POST /api/flights/search
router.post('/search', async (req: Request<{}, {}, FlightSearchRequest>, res: Response) => {
  try {
    // Normalize request aliases: allow `inbound_date` or `return_date` as the same value
    if (!req.body.return_date && req.body.inbound_date) {
      req.body.return_date = req.body.inbound_date;
    }

    // Basic validation
    if (!req.body.departure_id || !req.body.arrival_id || !req.body.outbound_date) {
      return res.status(400).json({ error: 'departure_id, arrival_id and outbound_date are required' });
    }

    // If no SERPAPI_KEY is provided, use the local mock service to return sample data
    if (!process.env.SERPAPI_KEY) {
      console.log('No SERPAPI_KEY found — returning mock flight data');

      const mockFlights = [
        {
          booking_token: 'mock1',
          flights: [
            {
              airline: 'EcoFly',
              flight_number: 'EF123',
              departure_airport: { id: req.body.departure_id || 'SFO', time: '08:30', name: req.body.outbound_date || '' },
              arrival_airport: { id: req.body.arrival_id || 'JFK', time: '16:45', name: req.body.outbound_date || '' }
            }
          ],
          total_duration: 315,
          price: 350,
          carbon_emissions: { this_flight: 150000, difference_percent: -18 },
          booking_link: '#'
        }
      ];

      return res.json({ best_flights: mockFlights, other_flights: [] });
    }

    const searchParams = {
      api_key: process.env.SERPAPI_KEY,
      engine: 'google_flights',
      ...req.body,
    };

    console.log('Searching flights with params:', {
      from: searchParams.departure_id,
      to: searchParams.arrival_id,
      date: searchParams.outbound_date,
      type: searchParams.type === '1' ? 'Round trip' : 'One way',
    });

  const rawData = await fetchFlightsFromSerpApi(req.body);

  const mapped = mapSerpResponse(rawData);
  const bestFlights = mapped.best_flights.length;
  const otherFlights = mapped.other_flights.length;
  console.log(`Found ${bestFlights} best flights and ${otherFlights} other flights`);

  res.json(mapped);
  } catch (error: any) {
    // Log full error for debugging
    console.error('SerpAPI Error Full:', error);

    const status = error.status || error.response?.status || 500;

    if (status === 401) {
      return res.status(401).json({ error: 'Invalid API key. Please check your SERPAPI_KEY in .env file' });
    }

    if (status === 429) {
      return res.status(429).json({ error: 'API rate limit exceeded. Please try again later.' });
    }

    res.status(status).json({ error: 'Failed to fetch flight data', details: error.message || String(error) });
  }
});

// GET /api/flights/test - Test endpoint
router.get('/test', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Flights API is working',
    hasApiKey: !!process.env.SERPAPI_KEY
  });
});

export default router;
