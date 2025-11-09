import axios from 'axios';
import { mapSerpResponse } from './flightMapper';

interface FlightSearchParams {
  departure_id: string;
  arrival_id: string;
  outbound_date: string;
  inbound_date?: string;
  type?: '1' | '2'; // '1' = one way, '2' = round trip - we'll convert to '0'/'1' for SerpAPI
  [key: string]: any; // for any additional parameters
}

export const fetchFlightsFromSerpApi = async (params: FlightSearchParams) => {
  if (!process.env.SERPAPI_KEY) {
    throw new Error('SERPAPI_KEY is not configured');
  }

  const searchParams = new URLSearchParams({
    api_key: process.env.SERPAPI_KEY,
    engine: 'google_flights',
    hl: 'en',
    gl: 'us',
    currency: 'USD',
    departure_id: params.departure_id,
    arrival_id: params.arrival_id,
    outbound_date: params.outbound_date,
    ...(params.inbound_date && { inbound_date: params.inbound_date }),
    type: params.type === '2' ? '1' : '0', // Convert '2' to '1' for round trip
  });

  const url = `https://serpapi.com/search.json?${searchParams.toString()}`;
  console.log('Fetching flights from SerpApi:', url);

  try {
    const response = await axios.get(url);
    console.log('SerpAPI raw response:', JSON.stringify(response.data, null, 2));
    return mapSerpResponse(response.data);
  } catch (error: any) {
    console.error('SerpAPI error:', error.response?.data || error.message);
    throw error;
  }
};