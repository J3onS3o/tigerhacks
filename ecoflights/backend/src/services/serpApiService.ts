import axios from 'axios';

/**
 * Call SerpApi Google Flights endpoint with provided search parameters.
 * The backend route will pass the same body the frontend sends.
 */
export async function fetchFlightsFromSerpApi(params: Record<string, any>) {
  const searchParams = {
    api_key: process.env.SERPAPI_KEY,
    engine: 'google_flights',
    emissions: '1', // Always filter for eco-friendly flights
    ...params,
  };

  console.log('Calling SerpAPI with params:', {
    ...searchParams,
    api_key: searchParams.api_key ? '***' : undefined // Hide API key in logs
  });

  try {
    const resp = await axios.get('https://serpapi.com/search', {
      params: searchParams,
      timeout: 30000,
    });

    console.log('SerpAPI response status:', resp.status);
    console.log('SerpAPI response structure:', JSON.stringify({
      keys: Object.keys(resp.data),
      bestFlightsCount: resp.data.best_flights?.length,
      otherFlightsCount: resp.data.other_flights?.length,
      sampleFlight: resp.data.best_flights?.[0] || resp.data.other_flights?.[0]
    }, null, 2));
    
    return resp.data;
  } catch (err: any) {
    // Log detailed error information
    console.error('SerpAPI Error:', {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
      config: {
        url: err.config?.url,
        params: {
          ...err.config?.params,
          api_key: '***' // Hide API key in logs
        }
      }
    });

    // Re-throw a normalized error so callers can handle HTTP status codes
    const msg = err.response?.data || err.message || 'Unknown error calling SerpApi';
    const status = err.response?.status || 500;
    const msgString = typeof msg === 'string' ? msg : JSON.stringify(msg);
    const error: any = new Error(msgString);
    error.status = status;
    throw error;
  }
}
