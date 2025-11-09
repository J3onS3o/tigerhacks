// src/services/geminiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure your environment variable is set correctly for your setup (Vite in this case)
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY; 

// Initialize the AI client
const genAI = new GoogleGenerativeAI(apiKey);
// Changed model to gemini-2.5-flash for potentially better availability 
// and efficiency for this type of structured task
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 

interface UserStats {
  totalCO2Saved: number;
  reductionPercent: number;
  flightsOffset: number;
}

export async function getImpactMessage(stats: UserStats): Promise<string> {
  
  // The refined prompt to generate a formatted list
  const prompt: string = `
    Your output must be the final, generated message ONLY. DO NOT include any titles, labels (e.g., "Option 1:"), explanations, or conversational filler (e.g., "Here is the message...").

    Generate a friendly, encouraging, and UNIQUE summary of the user's environmental impact in no more than 30 words. The message must incorporate the following statistics and use a creative analogy (e.g., trees planted, miles not driven, gasoline gallons saved) to illustrate the impact:

    Saved CO₂e: ${stats.totalCO2Saved.toFixed(1)} kg of CO₂e
    Reduction: ${stats.reductionPercent.toFixed(1)}% reduction
    Flights Offset: ${stats.flightsOffset} flights offset
    `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error calling Gemini:", error);
    // Return a fallback message if the API call fails
    return "We had trouble calculating your full impact, but great job on your reduction!";
  }
}