import type { Flight } from '../types';

// --- Mock Data for MVP ---
// This data is used to simulate an API response for development purposes.
// When you're ready to integrate your SerpApi logic, you can replace the
// implementation in the `searchFlights` function below.
const mockFlights: Flight[] = [
  {
    flightNumber: 'EF123',
    airline: 'EcoFly',
    departure: { airport: 'SFO', time: '08:30' },
    arrival: { airport: 'JFK', time: '16:45' },
    duration: '5h 15m',
    price: 350,
    emissions: { co2Grams: 150000, comparisonPercent: -18 },
    bookingLink: '#',
  },
  {
    flightNumber: 'EA456',
    airline: 'Earth Airways',
    departure: { airport: 'SFO', time: '10:00' },
    arrival: { airport: 'JFK', time: '18:10' },
    duration: '5h 10m',
    price: 375,
    emissions: { co2Grams: 145000, comparisonPercent: -22 },
    bookingLink: '#',
  },
  {
    flightNumber: 'GV789',
    airline: 'GreenVoyage',
    departure: { airport: 'SFO', time: '13:15' },
    arrival: { airport: 'JFK', time: '21:35' },
    duration: '5h 20m',
    price: 410,
    emissions: { co2Grams: 155000, comparisonPercent: -15 },
    bookingLink: '#',
  }
];

/**
 * Searches for flights based on the provided criteria.
 *
 * This is a MOCK implementation for the MVP. It returns a predefined list
 * of flights after a short delay to simulate a network request.
 *
 * TODO: Replace this with your actual SerpApi implementation.
 * 1. Construct the request URL with the correct parameters for the SerpApi proxy.
 * 2. Make a `fetch` call to your proxy endpoint.
 * 3. Handle the JSON response, including success and error cases.
 * 4. Map the API response data to the `Flight[]` type, similar to the original implementation.
 */
export const searchFlights = async (
  origin: string,
  destination: string,
  departureDate: Date,
  returnDate: Date | null
): Promise<Flight[]> => {
  console.log('Searching flights (mock API):', { origin, destination, departureDate, returnDate });

  // Simulate a network delay
  return new Promise(resolve => {
    setTimeout(() => {
      // In a real implementation, you would filter results based on search params.
      // For this mock, we just return the full list.
      resolve(mockFlights);
    }, 1200);
  });
};