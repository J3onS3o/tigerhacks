// src/services/geminiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure your environment variable is set correctly for your setup (Vite in this case)
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY; 

// Initialize the AI client
const genAI = new GoogleGenerativeAI(apiKey);
// Changed model to gemini-2.5-flash for potentially better availability 
// and efficiency for this type of structured task
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 

interface UserStats {
  totalCO2Saved: number;
  reductionPercent: number;
  flightsOffset: number;
}

export async function getImpactMessage(stats: UserStats): Promise<string> {
  
  // The refined prompt to generate a formatted list
  const prompt: string = `
    A user has saved ${stats.totalCO2Saved.toFixed(1)} kg of CO₂e, 
    a ${stats.reductionPercent.toFixed(1)}% reduction across flights, 
    roughly equal to ${stats.flightsOffset} flights offset.

    Write a message with the following two parts, using a fun and encouraging tone:
    
    1. **An introductory line:** Start with a positive greeting and lots of emojis (e.g., "Great job! 🎉"), followed by the sentence: "The amount you reduced in kg CO₂e is equivalent to:"
    2. **A list of comparisons:** Provide exactly four (4) unique, fun, and relevant environmental comparisons for the saved CO₂e amount. Format this strictly as a numbered list (1., 2., 3., 4.).

    **CRITICAL:** Output ONLY the introductory line and the numbered list.
    
    **Example Final Output:**
    Awesome work! 🎉 The ${stats.totalCO2Saved.toFixed(1)} kg CO₂e you reduced is equivalent to:
    1. The carbon absorbed by 5 mature trees in a year 🌳
    2. Taking a 300-mile road trip off the map 🚗
    3. Powering an average smartphone for nearly 30 years 🔋
    4. Switching three households to LED lightbulbs for a full year 💡
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