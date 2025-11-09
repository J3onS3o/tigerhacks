import express, { Request, Response, Router } from 'express';
import { fetchFlightsFromSerpApi } from '../../services/serpApiService';
import { formatDuration, mapSerpResponse } from '../../services/flightMapper';

const router: Router = express.Router();

// Define TypeScript types for the flight search request body
interface FlightSearchRequest {
  departure_id: string;
  arrival_id: string;
  outbound_date: string;
  inbound_date?: string;
  type?: '1' | '2'; // '1' = one way, '2' = round trip
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

    const rawData = await fetchFlightsFromSerpApi(req.body);
    const mappedData = mapSerpResponse(rawData);

    console.log('Mapped flight data:', {
      bestFlights: mappedData.best_flights.length,
      otherFlights: mappedData.other_flights.length,
    });

    // Return the normalized and mapped response
    res.json({
      success: true,
      ...mappedData,
    });

  } catch (error: any) {
    console.error('SerpAPI Error:', error.response?.data || error.message);

    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        error: 'Invalid API key. Please check your SERPAPI_KEY in .env file',
      });
    }

    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        error: 'API rate limit exceeded. Please try again later.',
      });
    }

    res.status(500).json({
      success: false,
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
