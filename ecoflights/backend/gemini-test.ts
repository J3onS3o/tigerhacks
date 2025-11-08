// filename: gemini-test.ts
import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Use the environment variable for your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

async function runGenerateText() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const prompt = "Say Hello World";

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log(text);
  } catch (error) {
    console.error("Error generating text:", error);
  }
}

runGenerateText();