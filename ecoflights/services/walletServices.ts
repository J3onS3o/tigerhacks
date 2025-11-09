// mock wallet services for gemini API calls
// src/services/walletService.ts

export interface WalletData {
  address: string;
  co2SavedKg: number;
  percentReduction: number;
}

export async function getWalletData(walletAddress: string): Promise<WalletData> {
  // TODO: Replace this mock data with real blockchain query
  return {
    address: walletAddress,
    co2SavedKg: 87.4, // Example token -> CO2 kg conversion
    percentReduction: 22.5,
  };
}
