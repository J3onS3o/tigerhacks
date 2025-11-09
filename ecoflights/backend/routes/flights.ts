import express, { Request, Response, Router } from 'express';
import { fetchFlightsFromSerpApi } from '../src/services/serpApiService';

const router: Router = express.Router();

// Helper function to format duration from minutes to "Xh Ym" format
function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

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

// GET /api/flights/test
router.get('/test', (req: Request, res: Response) => {
  res.json({ message: 'Flight search API is working!' });
});

// POST /api/flights/search
router.post('/search', async (req: Request<{}, {}, FlightSearchRequest>, res: Response) => {
  try {
    console.log('Searching flights with params:', {
      from: req.body.departure_id,
      to: req.body.arrival_id,
      date: req.body.outbound_date,
      type: req.body.type === '1' ? 'Round trip' : 'One way',
    });

    const data: SerpApiFlightResponse = await fetchFlightsFromSerpApi(req.body);

    const bestFlights = data.best_flights?.length || 0;
    const otherFlights = data.other_flights?.length || 0;
    console.log(`Found ${bestFlights} best flights and ${otherFlights} other flights`);

    res.json(data);
  } catch (error: any) {
    console.error('SerpAPI Error:', error.response?.data || error.message);

    if (error.response?.status === 401) {
      return res.status(401).json({
        error: 'Invalid API key. Please check your SERPAPI_KEY in .env file',
      });
    }

    if (error.response?.status === 429) {
      return res.status(429).json({
        error: 'API rate limit exceeded. Please try again later.',
      });
    }

    res.status(500).json({
      error: 'Failed to fetch flight data',
      details: error.response?.data?.error || error.message,
    });
  }
});

// GET /api/flights/test - Test endpoint
router.get('/test', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Flights API is working',
    hasApiKey: !!process.env.SERPAPI_KEY,
  });
});

export default router;
