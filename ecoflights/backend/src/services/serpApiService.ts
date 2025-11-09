import axios from 'axios';

/**
 * Call SerpApi Google Flights endpoint with provided search parameters.
 * The backend route will pass the same body the frontend sends.
 */
export async function fetchFlightsFromSerpApi(params: Record<string, any>) {
  const searchParams = {
    api_key: process.env.SERPAPI_KEY,
    engine: 'google_flights',
    ...params,
  };

  try {
    const resp = await axios.get('https://serpapi.com/search', {
      params: searchParams,
      timeout: 30000,
    });

    return resp.data;
  } catch (err: any) {
    // Re-throw a normalized error so callers can handle HTTP status codes
    const msg = err.response?.data || err.message || 'Unknown error calling SerpApi';
    const status = err.response?.status || 500;
    const msgString = typeof msg === 'string' ? msg : JSON.stringify(msg);
    const error: any = new Error(msgString);
    error.status = status;
    throw error;
  }
}
