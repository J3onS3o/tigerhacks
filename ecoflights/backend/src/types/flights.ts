export interface Flight {
  flightNumber: string;
  airline: string;
  departure: {
    airport: string;
    time: string;
  };
  arrival: {
    airport: string;
    time: string;
  };
  duration: string;
  price: number;
  emissions?: {
    co2Grams: number;
    comparisonPercent: number;
  };
  bookingLink: string;
}