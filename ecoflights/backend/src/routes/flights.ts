import express, { Request, Response, Router } from 'express';
import { fetchFlightsFromSerpApi } from '../services/serpApiService';
import { mapSerpResponse } from '../services/flightMapper';
import type { Flight } from '../types/flights';

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

// Type definition for flight response
interface FlightResponse {
  best_flights: Flight[];
  other_flights: Flight[];
  success: boolean;
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
          flightNumber: 'EF123',
          airline: 'EcoFly',
          departure: {
            airport: req.body.departure_id || 'SFO',
            time: '08:30'
          },
          arrival: {
            airport: req.body.arrival_id || 'JFK',
            time: '16:45'
          },
          duration: '5h 15m',
          price: 350,
          emissions: {
            co2Grams: 150000,
            comparisonPercent: -18
          },
          bookingLink: '#'
        }
      ];

      return res.json({ 
        success: true,
        best_flights: mockFlights, 
        other_flights: [] 
      });
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
    console.log('Raw data from SerpAPI:', JSON.stringify(rawData, null, 2));

    const mapped = mapSerpResponse(rawData);
    console.log('Mapped flight data:', JSON.stringify(mapped, null, 2));

    // Send only one response
    res.json({
      success: true,
      ...mapped
    });
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
