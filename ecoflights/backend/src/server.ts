import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import flightsRouter from "../routes/flights";

dotenv.config();

const app = express(); // ✅ now works properly
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

app.get("/", (req, res) => {
  res.send("Backend is running and connected to Gemini!");
});

app.post("/api/gemini", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ response: text });
  } catch (error: any) {
    console.error("Error calling Gemini:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
});

// Mount flights routes
app.use('/api/flights', flightsRouter);

const PORT = parseInt(process.env.PORT || '3001', 10);
// Explicitly bind to localhost instead of 0.0.0.0 for development
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
  console.log(`Try accessing via: http://127.0.0.1:${PORT}`);
  console.log(`Also available on: http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('Failed to start server:', err);
  console.error('Error details:', err.message);
  process.exit(1);
});
