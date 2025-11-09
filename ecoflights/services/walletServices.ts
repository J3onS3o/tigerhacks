// mock wallet services for gemini API calls
// src/services/walletService.ts

export interface WalletStats {
  totalCO2Saved: number; // in kg
  reductionPercent: number;
  flightsOffset: number;
}

export async function getWalletStats(): Promise<WalletStats> {
  // Placeholder – replace with your blockchain API call
  return {
    totalCO2Saved: 154.3,
    reductionPercent: 22.5,
    flightsOffset: 3,
  };
}

