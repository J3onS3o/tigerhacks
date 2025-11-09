import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import flightsRouter from "./routes/flights";

dotenv.config();

const app = express(); // ✅ now works properly
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

app.get("/", (req, res) => {
  res.json({
    status: "Backend is running and connected!",
    availableEndpoints: {
      root: "GET /",
      flightSearch: "POST /api/flights/search",
      flightTest: "GET /api/flights/test",
      gemini: "POST /api/gemini"
    }
  });
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
console.log('Mounting flights router at /api/flights');
app.use('/api/flights', flightsRouter);

// Add simple route logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

const PORT = parseInt(process.env.PORT || '3001', 10);

// Listen on all available network interfaces
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Test the API: curl http://localhost:${PORT}/api/flights/test`);
}).on('error', (err) => {
  console.error('Failed to start server:', err);
  console.error('Error details:', err.message);
  process.exit(1);
});
