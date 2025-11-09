import React, { createContext, useContext, useState, useCallback } from 'react';

interface BookedFlight {
  id: string;
  flightNumber: string;
  airline: string;
  co2Saved: number; // in grams
  comparisonPercent: number;
  price: number;
  date: string;
  pnrCode: string;
}

interface NFTBadge {
  name: string;
  unlocked: boolean;
  benefit: string;
  requiredTokens: number;
  requiredImpact: number; // percentage
  icon: string;
}

interface EcoWalletContextType {
  ecoTokens: number;
  co2Saved: number; // in kg
  ecoImpact: number; // percentage
  bookedFlights: BookedFlight[];
  nftBadges: NFTBadge[];
  bookFlight: (flight: {
    id: string;
    flightNumber: string;
    airline: string;
    co2Grams: number;
    comparisonPercent: number;
    price: number;
  }) => string; // returns PNR code
  redeemPNR: (pnrCode: string) => boolean;
  getFlightByPNR: (pnrCode: string) => BookedFlight | undefined;
}

const EcoWalletContext = createContext<EcoWalletContextType | undefined>(undefined);

// Define NFT badge tiers
const NFT_BADGES: NFTBadge[] = [
  {
    name: 'Seedling NFT 🌱',
    unlocked: false,
    benefit: '5% OFF American Airlines',
    requiredTokens: 2000,
    requiredImpact: 5,
    icon: '🌱'
  },
  {
    name: 'Sapling NFT 🌳',
    unlocked: false,
    benefit: 'Free Lounge Pass',
    requiredTokens: 5000,
    requiredImpact: 10,
    icon: '🌳'
  },
  {
    name: 'Great Tree NFT 🌲',
    unlocked: false,
    benefit: '10% Lifetime Discount',
    requiredTokens: 10000,
    requiredImpact: 20,
    icon: '🌲'
  },
  {
    name: 'Ancient Forest NFT 🌲🌲',
    unlocked: false,
    benefit: 'Carbon Neutral Badge + Priority Boarding',
    requiredTokens: 20000,
    requiredImpact: 30,
    icon: '🌲🌲'
  }
];

export const EcoWalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ecoTokens, setEcoTokens] = useState(0);
  const [co2Saved, setCo2Saved] = useState(0); // in kg
  const [ecoImpact, setEcoImpact] = useState(0); // percentage
  const [bookedFlights, setBookedFlights] = useState<BookedFlight[]>([]);
  const [nftBadges, setNftBadges] = useState<NFTBadge[]>(NFT_BADGES);

  // Generate a random PNR code
  const generatePNR = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let pnr = '';
    for (let i = 0; i < 6; i++) {
      pnr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pnr;
  };

  // Book a flight and generate PNR (but don't claim tokens yet)
  const bookFlight = useCallback((flight: {
    id: string;
    flightNumber: string;
    airline: string;
    co2Grams: number;
    comparisonPercent: number;
    price: number;
  }): string => {
    const pnrCode = generatePNR();
    
    // Only count savings if comparison percent is negative (lower emissions)
    const co2SavedGrams = flight.comparisonPercent < 0 ? Math.abs(flight.co2Grams * (flight.comparisonPercent / 100)) : 0;
    
    const bookedFlight: BookedFlight = {
      id: flight.id,
      flightNumber: flight.flightNumber,
      airline: flight.airline,
      co2Saved: co2SavedGrams,
      comparisonPercent: flight.comparisonPercent,
      price: flight.price,
      date: new Date().toISOString(),
      pnrCode: pnrCode
    };

    setBookedFlights(prev => [...prev, bookedFlight]);
    
    return pnrCode;
  }, []);

  // Check and unlock NFT badges based on current stats
  const checkAndUnlockBadges = useCallback((newTokens: number, newImpact: number) => {
    setNftBadges(prevBadges => 
      prevBadges.map(badge => {
        if (!badge.unlocked && newTokens >= badge.requiredTokens && newImpact >= badge.requiredImpact) {
          return { ...badge, unlocked: true };
        }
        return badge;
      })
    );
  }, []);

  // Redeem a PNR code to claim tokens
  const redeemPNR = useCallback((pnrCode: string): boolean => {
    const flight = bookedFlights.find(f => f.pnrCode === pnrCode);
    
    if (!flight) {
      return false;
    }

    // Calculate tokens: 1 kg CO₂e saved ≈ 43 ECO Tokens
    const co2SavedKg = flight.co2Saved / 1000;
    const tokensEarned = Math.round(co2SavedKg * 43);
    
    // Update totals
    const newCo2Saved = co2Saved + co2SavedKg;
    const newEcoTokens = ecoTokens + tokensEarned;
    
    // Calculate average impact percentage across all redeemed flights
    const totalFlights = bookedFlights.filter(f => f.pnrCode !== pnrCode).length + 1;
    const newEcoImpact = Math.abs(
      bookedFlights
        .filter(f => f.comparisonPercent < 0)
        .reduce((sum, f) => sum + f.comparisonPercent, 0) / totalFlights
    );

    setCo2Saved(newCo2Saved);
    setEcoTokens(newEcoTokens);
    setEcoImpact(newEcoImpact);

    // Remove the redeemed flight from the pending list
    setBookedFlights(prev => prev.filter(f => f.pnrCode !== pnrCode));

    // Check for badge unlocks
    checkAndUnlockBadges(newEcoTokens, newEcoImpact);

    return true;
  }, [bookedFlights, co2Saved, ecoTokens, checkAndUnlockBadges]);

  const getFlightByPNR = useCallback((pnrCode: string): BookedFlight | undefined => {
    return bookedFlights.find(f => f.pnrCode === pnrCode);
  }, [bookedFlights]);

  return (
    <EcoWalletContext.Provider value={{
      ecoTokens,
      co2Saved,
      ecoImpact,
      bookedFlights,
      nftBadges,
      bookFlight,
      redeemPNR,
      getFlightByPNR
    }}>
      {children}
    </EcoWalletContext.Provider>
  );
};

export const useEcoWallet = () => {
  const context = useContext(EcoWalletContext);
  if (context === undefined) {
    throw new Error('useEcoWallet must be used within an EcoWalletProvider');
  }
  return context;
};